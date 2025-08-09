const apiUrl = process.env.REACT_APP_API_URL;

export async function login(email, password) {
  try {
    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password 
    }),
    });
    return await response.json();
  } catch (err) {
    return { error: 'Network error' };
  }
}

export async function register(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });
    return await response.json();
  } catch (err) {
    return { error: 'Network error' };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await fetch(`${apiUrl}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (err) {
    return { error: 'Network error' };
  }
}

export async function activate(token, signal) {
  try {
    const response = await fetch(`${apiUrl}/api/activate?token=${token}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      signal: signal
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || `HTTP error! status: ${response.status}` };
    }
    
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Request was aborted');
      throw err;
    }
    return { error: 'Network error: ' + err.message };
  }
}
