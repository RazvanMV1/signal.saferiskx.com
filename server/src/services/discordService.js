// services/discordService.js
const axios = require('axios');

class DiscordService {
  constructor() {
    this.clientId = process.env.DISCORD_CLIENT_ID;
    this.clientSecret = process.env.DISCORD_CLIENT_SECRET;
    this.botToken = process.env.DISCORD_BOT_TOKEN;
    this.guildId = process.env.DISCORD_GUILD_ID;
    this.premiumRoleId = process.env.DISCORD_PREMIUM_ROLE_ID;
    this.redirectUri = process.env.DISCORD_REDIRECT_URI;
    
    console.log('🎮 Discord Service initialized');
  }

  // Generează URL pentru Discord OAuth
  getOAuthUrl() {
    const baseUrl = 'https://discord.com/api/oauth2/authorize';
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'identify guilds.join',
      prompt: 'consent'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Exchange authorization code pentru access token
  async exchangeCodeForTokens(code) {
    try {
      console.log('🔄 Exchanging Discord code for tokens...');
      console.log('🔧 Using client_id:', this.clientId);
      console.log('🔧 Using redirect_uri:', this.redirectUri);
      console.log('🔧 Code length:', code?.length || 'NO CODE');
      
      if (!code) {
        throw new Error('No authorization code provided');
      }

      if (!this.clientId || !this.clientSecret) {
        throw new Error('Missing Discord client credentials');
      }

      const tokenData = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
      };

      console.log('📡 Making token exchange request to Discord...');

      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams(tokenData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('✅ Discord token exchange successful');
      return response.data;
    } catch (error) {
      console.error('❌ Discord token exchange detailed error:');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', error.response?.data);
      console.error('Request Config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });

      // Mai multe detalii pentru debugging
      if (error.response?.status === 400) {
        console.error('❌ Bad Request - Check client credentials and redirect URI');
      }

      throw new Error(`Discord token exchange failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Obține informații despre utilizatorul Discord
  async getUserInfo(accessToken) {
    try {
      console.log('👤 Fetching Discord user info...');
      
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('✅ Discord user info received:', response.data.username);
      return response.data;
    } catch (error) {
      console.error('❌ Discord user info error:', error.response?.data || error.message);
      throw new Error('Failed to get Discord user info');
    }
  }

  // Adaugă utilizator în server cu access token
  async addUserToGuild(userId, accessToken) {
  try {
    console.log(`🏠 Adding user ${userId} to guild ${this.guildId}...`);
    
    const response = await axios.put(
      `https://discord.com/api/guilds/${this.guildId}/members/${userId}`,
      {
        access_token: accessToken,
        roles: [this.premiumRoleId] // Adaugă direct cu rolul premium
      },
      {
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ User ${userId} added to guild with premium role`);
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response data:`, response.data);

    // ✅ FIX: Verifică explicit status 204 (user already in guild)
    if (response.status === 204) {
      console.log(`ℹ️ User ${userId} already in guild (status 204), assigning premium role...`);
      
      try {
        await this.assignPremiumRole(userId);
        console.log(`✅ User ${userId} already in guild, premium role assigned`);
        return { status: 'already_member', roleAssigned: true };
      } catch (roleError) {
        console.error(`❌ Failed to assign premium role:`, roleError.message);
        return { status: 'already_member', roleAssigned: false };
      }
    }

    return { status: 'added', data: response.data };
    
  } catch (error) {
    console.log(`❌ Discord API Error Details:`);
    console.log(`Status: ${error.response?.status}`);
    console.log(`Data:`, error.response?.data);
    
    console.error('❌ Discord add to guild error:', error.response?.data || error.message);
    throw new Error('Failed to add user to Discord server');
  }
}


  // ✅ ADĂUGATĂ: Verifică dacă utilizatorul este în server
  async checkUserInGuild(userId) {
    try {
      console.log(`🔍 Checking if user ${userId} is in guild...`);
      
      const response = await axios.get(
        `https://discord.com/api/guilds/${this.guildId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }
      );

      const member = response.data;
      const hasPremiumRole = member.roles.includes(this.premiumRoleId);
      
      console.log(`✅ User ${userId} found in guild, has premium role: ${hasPremiumRole}`);
      
      return { 
        inGuild: true, 
        member: member,
        hasPremiumRole: hasPremiumRole
      };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`ℹ️ User ${userId} not in guild`);
        return { inGuild: false, hasPremiumRole: false };
      }
      
      console.error('❌ Discord check user error:', error.response?.data || error.message);
      throw new Error('Failed to check user in Discord server');
    }
  }

  // Assign role premium
  async assignPremiumRole(userId) {
    try {
      console.log(`🏆 Assigning premium role to user ${userId}...`);
      
      await axios.put(
        `https://discord.com/api/guilds/${this.guildId}/members/${userId}/roles/${this.premiumRoleId}`,
        {},
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }
      );

      console.log(`✅ Premium role assigned to user ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Discord assign role error:', error.response?.data || error.message);
      throw new Error('Failed to assign premium role');
    }
  }

  // Remove role premium
  async removePremiumRole(discordUserId) {
    try {
      console.log(`🎭 Removing premium role from Discord user: ${discordUserId}`);
      
      const response = await axios.delete(
        `https://discord.com/api/v10/guilds/${this.guildId}/members/${discordUserId}/roles/${this.premiumRoleId}`,
        {
          headers: {
            'Authorization': `Bot ${this.botToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Premium role removed from Discord user: ${discordUserId}`);
      return { success: true };

    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`ℹ️ User ${discordUserId} not found in guild or doesn't have the role`);
        return { success: true, message: 'User not found or role not assigned' };
      }
      
      console.error('❌ Error removing premium role:', error.response?.data || error.message);
      throw new Error(`Failed to remove premium role: ${error.response?.data?.message || error.message}`);
    }
  }

  // Test methods (păstrează pentru debugging)
  async testConnection() {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bot ${this.botToken}` },
      });
      return { success: true, bot: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testGuildAccess() {
    try {
      const response = await axios.get(`https://discord.com/api/guilds/${this.guildId}`, {
        headers: { Authorization: `Bot ${this.botToken}` },
      });
      return { success: true, guild: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testPremiumRole() {
    try {
      const response = await axios.get(`https://discord.com/api/guilds/${this.guildId}/roles`, {
        headers: { Authorization: `Bot ${this.botToken}` },
      });
      const premiumRole = response.data.find(role => role.id === this.premiumRoleId);
      return premiumRole 
        ? { success: true, role: premiumRole }
        : { success: false, error: 'Premium role not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DiscordService();
