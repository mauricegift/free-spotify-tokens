## Free Spotify Tokens

This repository automatically provides updated every 30 minutes  
You can use these tokens to interact with Spotify's public APIs **without needing your own Client ID or Secret**, and **without any special rate limits** for typical usage.

---

## Access Tokens Url

The latest Spotify access tokens are always available at:

   ```
   https://raw.githubusercontent.com/mauricegift/free-spotify-tokens/refs/heads/main/tokens.json

   ```

---

## Usage Example

```javascript
const axios = require('axios');
// import axios from 'axios';

(async () => {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/mauricegift/free-spotify-tokens/refs/heads/main/tokens.json'
    );
   // You can pick any from list
    const accessToken = data.tokens?.[0]?.access_token;

    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await axios.get('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log(response.data);
  } catch (err) {
    console.error('Error:', err.message || err);
  }
})();

```

---

## ⚠️ Disclaimer

- This project is intended for **educational and personal use**.
- This project is **not affiliated with Spotify** in any way.

---
