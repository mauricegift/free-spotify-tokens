# free-spotify-token

> **1 fresh Spotify access token** — updated every **30 minutes**

A free, continuously refreshed **Spotify Web Player access token** — no login, no API keys, no cost. Works with all public Spotify API endpoints. Powered by a reverse-engineered TOTP flow identical to the official web player.

![Token](https://img.shields.io/badge/Token-1-1DB954?style=flat-square&logo=spotify&logoColor=white)
![Interval](https://img.shields.io/badge/Refresh-20min-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

🌐 Live Dashboard: [stoken.giftedtech.co.ke](https://stoken.giftedtech.co.ke)

---

## Token JSON

```
https://stoken.giftedtech.co.ke/token.json
```

### Structure

```json
{
  "token": "BQC...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "last_updated": "2026-04-06T03:10:49.000Z"
}
```

---

## Usage

### JavaScript / Node.js

```js
const res = await fetch('https://stoken.giftedtech.co.ke/token.json');
const { token } = await res.json();

const data = await fetch('https://api.spotify.com/v1/browse/new-releases', {
  headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());
```

### Python

```python
import requests

res = requests.get('https://stoken.giftedtech.co.ke/token.json').json()
token = res['token']

data = requests.get(
    'https://api.spotify.com/v1/browse/new-releases',
    headers={'Authorization': f'Bearer {token}'}
).json()
```

### cURL

```bash
TOKEN=$(curl -s https://stoken.giftedtech.co.ke/token.json | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
curl -H "Authorization: Bearer $TOKEN" https://api.spotify.com/v1/browse/new-releases
```

---

## Supported Endpoints

Works with any **public** Spotify API endpoint, including:

| Endpoint | Description |
|---|---|
| `/v1/search` | Search tracks, albums, artists, playlists |
| `/v1/browse/new-releases` | New album releases |
| `/v1/browse/featured-playlists` | Featured playlists |
| `/v1/browse/categories` | Browse categories |
| `/v1/albums/{id}` | Album details |
| `/v1/artists/{id}` | Artist details |
| `/v1/tracks/{id}` | Track details |
| `/v1/recommendations` | Track recommendations |
| `/v1/audio-features/{id}` | Audio analysis |

---

## Notes

- Token expires roughly **1 hour** after issue but is refreshed every **30 minutes** so it's always fresh
- This is an **anonymous web-player token** — user-specific endpoints (liked songs, playlists) require OAuth login
- Runs 24/7 on a VPS by [Gifted Tech](https://giftedtech.co.ke)

---

*Made with ♥ by [mauricegift](https://github.com/mauricegift)*
