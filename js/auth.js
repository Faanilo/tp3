// Setting up the config
const apiKey = '{{api_key}}';
const requestToken = '{{request_token}}';

// Create session (with login)
async function createSession() {
 try {
    const response = await fetch('https://api.themoviedb.org/3/authentication/token/validate_with_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        api_key: apiKey,
        request_token: requestToken,
        username: 'your_username',
        password: 'your_password',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Session created successfully:', data);
 } catch (error) {
    console.error('Failed to create session:', error);
 }
}

createSession();