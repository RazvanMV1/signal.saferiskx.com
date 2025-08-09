const apiUrl = process.env.REACT_APP_API_URL;

// ==================== AUTH ====================

// Înregistrare user nou
export async function register(firstName, lastName, email, password, discordUsername) {
  const res = await fetch(`${apiUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, discordUsername })
  });
  return await res.json();
}

// Login
export async function login(email, password) {
  const res = await fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

// Logout
export async function logout() {
  const res = await fetch(`${apiUrl}/api/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return await res.json();
}

// ==================== USER INFO ====================

export async function getUserInfo() {
  const res = await fetch(`${apiUrl}/api/user`, {
    credentials: 'include'
  });
  return await res.json();
}

// ==================== BILLING / SUBSCRIPTIONS ====================

export async function getBillingInfo() {
  const res = await fetch(`${apiUrl}/api/subscriptions`, {
    credentials: 'include'
  });
  return await res.json();
}

export async function getInvoices() {
  const res = await fetch(`${apiUrl}/api/invoices`, {
    credentials: 'include'
  });
  return await res.json();
}

// ==================== STRIPE ====================

// Inițiază sesiunea Stripe (obține URL)
export async function createStripeSession(plan) {
  const res = await fetch(`${apiUrl}/api/create-stripe-session`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan })
  });
  return await res.json();
}

// Verifică sesiunea Stripe (după plată)
export async function getStripeSession(sessionId) {
  const res = await fetch(`${apiUrl}/api/stripe-session?session_id=${sessionId}`, {
    credentials: 'include'
  });
  return await res.json();
}

// ==================== DISCORD ====================

// Conectează Discord la user
export async function connectDiscord(discordUsername) {
  const res = await fetch(`${apiUrl}/api/discord/connect`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ discordUsername })
  });
  return await res.json();
}

// Verifică status Discord
export async function getDiscordStatus() {
  const res = await fetch(`${apiUrl}/api/discord/status`, {
    credentials: 'include'
  });
  return await res.json();
}
