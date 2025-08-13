// controllers/discordController.js
const discordService = require('../services/discordService');
const { User, Subscription, sequelize } = require('../../models');

// Inițiază procesul Discord OAuth
exports.initiateDiscordAuth = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    console.log('🔄 Initiating Discord auth for user:', user.email);

    const oauthUrl = discordService.getOAuthUrl();
    res.json({ url: oauthUrl });
  } catch (error) {
    console.error('❌ Discord auth initiate error:', error);
    res.status(500).json({ error: 'Eroare la inițierea autentificării Discord' });
  }
};

// Procesează callback-ul Discord OAuth
exports.handleDiscordCallback = async (req, res) => {
  // Generăm un ID unic pentru fiecare cerere
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`\n🆔 [${requestId}] ==================== NEW Discord callback request ====================`);
  console.log(`🆔 [${requestId}] Timestamp: ${new Date().toISOString()}`);
  console.log(`🆔 [${requestId}] Request method: ${req.method}`);
  console.log(`🆔 [${requestId}] User-Agent: ${req.headers['user-agent']?.substring(0, 100)}...`);
  console.log(`🆔 [${requestId}] Referer: ${req.headers.referer}`);
  console.log(`🆔 [${requestId}] IP: ${req.ip || req.connection.remoteAddress}`);

  try {
    const { code } = req.body;
    const user = req.user;

    console.log(`🆔 [${requestId}] Code: ${code ? code.substring(0, 10) + '...' : 'MISSING'}`);
    console.log(`🆔 [${requestId}] Code length: ${code ? code.length : 0}`);
    console.log(`🆔 [${requestId}] User: ${user ? user.email : 'NOT AUTHENTICATED'}`);
    console.log(`🆔 [${requestId}] Full request body:`, req.body);
    
    console.log(`🆔 [${requestId}] Environment check:`, {
      hasClientId: !!process.env.DISCORD_CLIENT_ID,
      hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
      hasRedirectUri: !!process.env.DISCORD_REDIRECT_URI,
      redirectUri: process.env.DISCORD_REDIRECT_URI
    });

    if (!user) {
      console.log(`🆔 [${requestId}] ❌ REJECTED: User not authenticated`);
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    if (!code) {
      console.log(`🆔 [${requestId}] ❌ REJECTED: Missing Discord code`);
      return res.status(400).json({ error: 'Cod Discord lipsă!' });
    }

    console.log(`🆔 [${requestId}] 🔄 Processing Discord callback for user: ${user.email}`);

    // 1. Exchange code pentru tokens
    console.log(`🆔 [${requestId}] 📡 Starting token exchange...`);
    const tokens = await discordService.exchangeCodeForTokens(code);
    console.log(`🆔 [${requestId}] ✅ Token exchange successful`);
    
    // 2. Obține info user Discord
    console.log(`🆔 [${requestId}] 👤 Fetching Discord user info...`);
    const discordUser = await discordService.getUserInfo(tokens.access_token);
    console.log(`🆔 [${requestId}] 👤 Discord user: ${discordUser.username}#${discordUser.discriminator}`);
    
    // 🛡️ PROTECȚIE ANTI-ABUZ: Verifică dacă user-ul schimbă contul Discord
    console.log(`🆔 [${requestId}] 🛡️ Checking for existing Discord connection...`);
    console.log(`🆔 [${requestId}] Current user Discord ID: ${user.discordId || 'NONE'}`);
    console.log(`🆔 [${requestId}] New Discord ID: ${discordUser.id}`);

    if (user.discordId && user.discordId !== discordUser.id) {
      console.log(`🆔 [${requestId}] 🔄 SECURITY: User switching Discord accounts!`);
      console.log(`🆔 [${requestId}] Old Discord ID: ${user.discordId}`);
      console.log(`🆔 [${requestId}] New Discord ID: ${discordUser.id}`);
      
      // Remove premium role from old Discord account
      try {
        console.log(`🆔 [${requestId}] 🎭 Removing premium role from old Discord account...`);
        const removeResult = await discordService.removePremiumRole(user.discordId);
        console.log(`🆔 [${requestId}] ✅ Successfully removed premium role from old Discord account: ${user.discordId}`);
        console.log(`🆔 [${requestId}] 🛡️ ANTI-ABUSE: Previous Discord account ${user.discordId} role revoked`);
      } catch (error) {
        console.error(`🆔 [${requestId}] ⚠️ Failed to remove role from old Discord account:`, error.message);
        // Nu oprește procesul, doar loghează eroarea
      }
    } else if (user.discordId === discordUser.id) {
      console.log(`🆔 [${requestId}] ℹ️ User reconnecting with same Discord account`);
    } else {
      console.log(`🆔 [${requestId}] ℹ️ User connecting Discord for the first time`);
    }

    // 3. Salvează Discord info în DB
    console.log(`🆔 [${requestId}] 💾 Updating user in database...`);
    await User.update({
      discordId: discordUser.id,
      discordUsername: `${discordUser.username}#${discordUser.discriminator}`,
    }, {
      where: { id: user.id }
    });

    console.log(`🆔 [${requestId}] ✅ Discord account connected: ${discordUser.username}#${discordUser.discriminator}`);

    // 4. Verifică dacă are abonament activ
    console.log(`🆔 [${requestId}] 🔍 Checking for active subscription...`);
    const subscription = await Subscription.findOne({
      where: { userId: user.id, status: 'active' }
    });

    let guildStatus = { inGuild: false, hasPremiumRole: false };

    if (subscription) {
      console.log(`🆔 [${requestId}] 💰 User has active subscription, processing Discord enrollment...`);
      
      try {
        // 5. Adaugă în server cu rolul premium
        console.log(`🆔 [${requestId}] 🏠 Adding user to Discord guild...`);
        const addResult = await discordService.addUserToGuild(discordUser.id, tokens.access_token);
        console.log(`🆔 [${requestId}] 🏠 Add result:`, addResult);
        
        if (addResult.status === 'already_member') {
          console.log(`🆔 [${requestId}] 👥 User already in guild, checking role...`);
          // Dacă e deja în server, verifică și assign role dacă nu îl are
          const status = await discordService.checkUserInGuild(discordUser.id);
          console.log(`🆔 [${requestId}] 🎭 Current guild status:`, status);
          
          if (!status.hasPremiumRole) {
            console.log(`🆔 [${requestId}] 🎭 Assigning premium role...`);
            await discordService.assignPremiumRole(discordUser.id);
            guildStatus = { inGuild: true, hasPremiumRole: true };
          } else {
            guildStatus = status;
          }
        } else {
          // A fost adăugat cu succes cu rolul premium
          guildStatus = { inGuild: true, hasPremiumRole: true };
        }

        console.log(`🆔 [${requestId}] 🎉 Discord enrollment completed for ${user.email}`);
        console.log(`🆔 [${requestId}] 📊 Final guild status:`, guildStatus);
      } catch (error) {
        console.error(`🆔 [${requestId}] ❌ Error during Discord enrollment:`, error);
      }
    } else {
      console.log(`🆔 [${requestId}] ℹ️ User has no active subscription, skipping guild enrollment`);
    }

    // 6. Success response
    const responseData = {
      success: true,
      message: 'Contul Discord a fost conectat cu succes!',
      discord: {
        id: discordUser.id,
        username: `${discordUser.username}#${discordUser.discriminator}`,
        avatar: discordUser.avatar,
      },
      subscription: {
        hasActive: !!subscription,
        inGuild: guildStatus.inGuild,
        hasPremiumRole: guildStatus.hasPremiumRole,
      }
    };

    console.log(`🆔 [${requestId}] ✅ SUCCESS - Sending response:`, responseData);
    console.log(`🆔 [${requestId}] ==================== END Discord callback request ====================\n`);
    
    res.json(responseData);

  } catch (error) {
    console.error(`🆔 [${requestId}] ❌ Discord callback error:`, error);
    console.log(`🆔 [${requestId}] ==================== ERROR END Discord callback request ====================\n`);
    res.status(500).json({ 
      error: 'Eroare la conectarea contului Discord: ' + error.message 
    });
  }
};

// Obține status Discord pentru user curent - ✅ CU VERIFICARE EXPIRARE LA RUNTIME
exports.getDiscordStatus = async (req, res) => {
  try {
    const user = req.user;
    const requestId = Math.random().toString(36).substr(2, 9);
    
    console.log(`\n🔍 [${requestId}] ==================== GET Discord Status ====================`);
    console.log(`🔍 [${requestId}] User from req: ${user ? user.email : 'NOT FOUND'}`);
    console.log(`🔍 [${requestId}] User ID: ${user ? user.id : 'NOT FOUND'}`);

    if (!user) {
      console.log(`🔍 [${requestId}] ❌ No authenticated user`);
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    // 1. Get fresh user data from database
    console.log(`🔍 [${requestId}] 📋 Fetching fresh user data from database...`);
    const freshUser = await User.findByPk(user.id);
    console.log(`🔍 [${requestId}] 📋 Fresh user data:`, {
      id: freshUser?.id,
      email: freshUser?.email,
      discordId: freshUser?.discordId,
      discordUsername: freshUser?.discordUsername
    });

    // 2. Check if Discord is connected
    const isDiscordConnected = !!(freshUser?.discordId && freshUser?.discordUsername);
    console.log(`🔍 [${requestId}] 🔗 Discord connected check:`, {
      hasDiscordId: !!freshUser?.discordId,
      hasDiscordUsername: !!freshUser?.discordUsername,
      isConnected: isDiscordConnected
    });

    // 3. Check subscription WITH EXPIRATION CHECK ✅
    console.log(`🔍 [${requestId}] 💰 Checking subscription...`);
    let subscription = await Subscription.findOne({
      where: { userId: user.id, status: 'active' }
    });
    console.log(`🔍 [${requestId}] 💰 Subscription found:`, !!subscription);

    // ✅ VERIFICARE EXPIRARE LA RUNTIME
    if (subscription && subscription.nextPaymentDate) {
      const now = new Date();
      const paymentDate = new Date(subscription.nextPaymentDate);
      
      console.log(`🔍 [${requestId}] 📅 Payment due date: ${paymentDate.toISOString()}`);
      console.log(`🔍 [${requestId}] 📅 Current date: ${now.toISOString()}`);
      console.log(`🔍 [${requestId}] 📅 Is expired: ${paymentDate < now}`);
      
      if (paymentDate < now) {
        console.log(`🔍 [${requestId}] ⏰ Subscription expired at runtime for user: ${user.email}`);
        console.log(`🔍 [${requestId}] 💰 Payment was due: ${paymentDate.toISOString()}`);
        
        // Remove premium role dacă user-ul are Discord
        if (freshUser.discordId) {
          try {
            console.log(`🔍 [${requestId}] 🎭 Removing premium role due to expired subscription`);
            
            // Verifică mai întâi dacă are rolul
            const guildStatus = await discordService.checkUserInGuild(freshUser.discordId);
            
            if (guildStatus.inGuild && guildStatus.hasPremiumRole) {
              await discordService.removePremiumRole(freshUser.discordId);
              console.log(`🔍 [${requestId}] ✅ Premium role removed due to expiration`);
            } else {
              console.log(`🔍 [${requestId}] ℹ️ User doesn't have premium role or not in server`);
            }
            
          } catch (error) {
            console.error(`🔍 [${requestId}] ❌ Failed to remove expired role:`, error.message);
          }
        }
        
        // Update subscription status
        await subscription.update({ status: 'expired' });
        console.log(`🔍 [${requestId}] 📊 Subscription marked as expired in database`);
        
        // Tratează ca și cum nu ar avea subscription activ
        subscription = null;
      }
    } else if (subscription && !subscription.nextPaymentDate) {
      console.log(`🔍 [${requestId}] ⚠️ Subscription has no payment date - assuming valid`);
    }

    let guildStatus = { inGuild: false, hasPremiumRole: false };

    // 4. If Discord is connected and has subscription, check guild status
    if (isDiscordConnected && subscription) {
      console.log(`🔍 [${requestId}] 🏠 Checking guild status for Discord ID: ${freshUser.discordId}`);
      try {
        guildStatus = await discordService.checkUserInGuild(freshUser.discordId);
        console.log(`🔍 [${requestId}] 🏠 Guild status result:`, guildStatus);
      } catch (error) {
        console.error(`🔍 [${requestId}] ❌ Error checking guild status:`, error);
      }
    } else {
      console.log(`🔍 [${requestId}] ⏩ Skipping guild check:`, {
        discordConnected: isDiscordConnected,
        hasSubscription: !!subscription
      });
    }

    const result = {
      connected: isDiscordConnected,
      hasActiveSubscription: !!subscription,
      inGuild: guildStatus.inGuild,
      hasPremiumRole: guildStatus.hasPremiumRole,
      discord: isDiscordConnected ? {
        id: freshUser.discordId,
        username: freshUser.discordUsername
      } : null
    };

    console.log(`🔍 [${requestId}] ✅ Final result:`, result);
    console.log(`🔍 [${requestId}] ==================== END GET Discord Status ====================\n`);

    res.json(result);

  } catch (error) {
    console.error('❌ Error getting Discord status:', error);
    res.status(500).json({ error: 'Eroare la verificarea statusului Discord' });
  }
};

exports.disconnectDiscord = async (req, res) => {
  try {
    const user = req.user;
    const requestId = Math.random().toString(36).substr(2, 9);
    
    console.log(`\n🔌 [${requestId}] ==================== Discord Disconnect Request ====================`);
    console.log(`🔌 [${requestId}] User: ${user.email}`);
    console.log(`🔌 [${requestId}] User object discordId: ${user.discordId || 'NONE'}`);

    if (!user) {
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    // Get fresh user data from database instead of relying on req.user
    const freshUser = await User.findByPk(user.id);
    console.log(`🔌 [${requestId}] Fresh user Discord ID: ${freshUser.discordId || 'NONE'}`);

    if (!freshUser.discordId) {
      console.log(`🔌 [${requestId}] ℹ️ No Discord account connected`);
      return res.json({ 
        success: true, 
        message: 'Nu există cont Discord conectat',
        alreadyDisconnected: true 
      });
    }

    // Remove premium role from Discord server
    try {
      console.log(`🔌 [${requestId}] 🎭 Removing premium role from Discord account: ${freshUser.discordId}`);
      await discordService.removePremiumRole(freshUser.discordId);
      console.log(`🔌 [${requestId}] ✅ Premium role removed successfully`);
    } catch (error) {
      console.error(`🔌 [${requestId}] ⚠️ Failed to remove premium role:`, error.message);
      // Continue with disconnect even if role removal fails
    }

    // Clear Discord data from database
    console.log(`🔌 [${requestId}] 💾 Clearing Discord data from database...`);
    await User.update({
      discordId: null,
      discordUsername: null,
    }, {
      where: { id: user.id }
    });

    console.log(`🔌 [${requestId}] ✅ Discord account disconnected successfully`);
    console.log(`🔌 [${requestId}] ==================== END Discord Disconnect ====================\n`);

    res.json({
      success: true,
      message: 'Contul Discord a fost deconectat cu succes!'
    });

  } catch (error) {
    console.error('❌ Error disconnecting Discord:', error);
    res.status(500).json({ 
      error: 'Eroare la deconectarea contului Discord: ' + error.message 
    });
  }
};

// Test complet Discord setup (păstrat pentru debugging)
exports.testDiscordSetup = async (req, res) => {
  try {
    const results = {
      connection: await discordService.testConnection(),
      guildAccess: await discordService.testGuildAccess(),
      premiumRole: await discordService.testPremiumRole(),
    };

    const allSuccess = results.connection.success && 
                      results.guildAccess.success && 
                      results.premiumRole.success;

    res.json({
      success: allSuccess,
      message: allSuccess ? 'Discord setup is working!' : 'Some Discord tests failed',
      results: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Test Discord enrollment pentru user existent
exports.testDiscordEnrollment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    console.log('🧪 Testing Discord enrollment for user:', user.email);

    // Verifică dacă user-ul are Discord conectat
    if (!user.discordId) {
      return res.json({
        success: false,
        message: 'User nu are Discord conectat',
        needsDiscordConnection: true
      });
    }

    // Verifică dacă are abonament activ
    const subscription = await Subscription.findOne({
      where: { userId: user.id, status: 'active' }
    });

    if (!subscription) {
      return res.json({
        success: false,
        message: 'User nu are abonament activ',
        needsSubscription: true
      });
    }

    // Testează Discord operations
    const guildStatus = await discordService.checkUserInGuild(user.discordId);
    
    let result = {
      success: true,
      user: {
        email: user.email,
        discordId: user.discordId,
        discordUsername: user.discordUsername
      },
      subscription: {
        id: subscription.id,
        status: subscription.status
      },
      discord: {
        inGuild: guildStatus.inGuild,
        hasPremiumRole: guildStatus.hasPremiumRole
      }
    };

    // Dacă e în server dar nu are rolul, încearcă să îl dea
    if (guildStatus.inGuild && !guildStatus.hasPremiumRole) {
      try {
        await discordService.assignPremiumRole(user.discordId);
        result.discord.hasPremiumRole = true;
        result.message = 'Premium role assigned successfully!';
      } catch (error) {
        result.error = 'Failed to assign premium role: ' + error.message;
      }
    } else if (guildStatus.hasPremiumRole) {
      result.message = 'User already has premium role!';
    } else {
      result.message = 'User not in Discord server - cannot assign role';
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Discord enrollment test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Test failed: ' + error.message 
    });
  }
};

// Endpoint temporar pentru testare - DOAR pentru development
exports.testExpiration = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not allowed in production' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    console.log(`🧪 Testing expiration for user ${userId}`);

    // Query cu numele corect al tabelelor (ambele singulare)
    const [users] = await sequelize.query(`
      SELECT u.id, u.email, u.discord_username, u.discord_id, 
             s.id as subscription_id, s.next_payment_date, s.status
      FROM user u 
      JOIN subscription s ON u.id = s.user_id 
      WHERE u.id = :userId AND s.status = 'active'
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User with active subscription not found' });
    }

    const userData = users[0];

    if (!userData.discord_id) {
      return res.status(400).json({ error: 'User does not have Discord connected' });
    }

    console.log(`📅 Original expiration: ${userData.next_payment_date}`);

    // Modifică data să fie în trecut
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await sequelize.query(`
      UPDATE subscription 
      SET next_payment_date = :expiredDate 
      WHERE id = :subscriptionId
    `, {
      replacements: { 
        expiredDate: expiredDate.toISOString(),
        subscriptionId: userData.subscription_id 
      }
    });

    console.log(`📅 New expiration: ${expiredDate}`);

    // Verifică și șterge rolul Discord
    const discordUser = await discordService.getUserById(userData.discord_id);
    
    if (discordUser) {
      const isInGuild = await discordService.checkUserInGuild(userData.discord_id);
      
      if (isInGuild) {
        console.log(`🔄 Removing premium role from ${userData.discord_username}`);
        const removed = await discordService.removePremiumRole(userData.discord_id);
        
        return res.json({
          success: true,
          message: 'Expiration test completed successfully! 🎉',
          results: {
            userEmail: userData.email,
            discordUsername: userData.discord_username,
            originalDate: userData.next_payment_date,
            newDate: expiredDate,
            roleRemoved: removed,
            userInGuild: isInGuild
          }
        });
      } else {
        return res.json({
          success: true,
          message: 'User not in Discord guild',
          results: {
            userEmail: userData.email,
            discordUsername: userData.discord_username,
            userInGuild: false
          }
        });
      }
    } else {
      return res.status(404).json({ error: 'Discord user not found' });
    }

  } catch (error) {
    console.error('❌ Test expiration error:', error);
    res.status(500).json({ 
      error: 'Test failed', 
      details: error.message
    });
  }
};




module.exports = exports;
