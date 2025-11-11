# YouTube Chat Overlay

Relay server untuk YouTube chat overlay dengan sistem emote dan localStorage yang sudah diperbaiki.

## Fitur

✅ **Sistem Emote yang Diperbaiki**
- Emote YouTube (`:hand-pink-waving:`, `:fire:`, `:heart:`, dll) sekarang ditampilkan sebagai emoji Unicode
- Tidak lagi muncul sebagai text seperti `:hand-pink-wrap:`
- Support 60+ emote YouTube yang umum digunakan

✅ **localStorage Management**
- Chat history disimpan di localStorage (max 50 messages)
- **Auto-clear saat stream ended**: localStorage otomatis dihapus ketika live stream selesai
- **Auto-clear saat page closed**: localStorage dihapus saat browser ditutup (jika stream tidak live)

✅ **WebSocket Real-time**
- Koneksi WebSocket untuk real-time chat
- Auto-reconnect jika koneksi terputus
- Status indicator (LIVE/OFFLINE/Connecting)

✅ **Role Badges**
- Owner (merah)
- Moderator (biru)
- Subscriber/Member (hijau)
- Viewer (abu-abu)

## Setup

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Environment Variables
Buat file `.env` atau set di dashboard hosting:
\`\`\`
YT_API_KEY=your_youtube_api_key_here
YT_VIDEO_ID=your_video_id_here
PORT=10000
\`\`\`

### 3. Start Server
\`\`\`bash
npm start
\`\`\`

Server akan berjalan di `http://localhost:10000`

## Cara Menggunakan

### 1. Akses Overlay
Buka di browser atau OBS:
\`\`\`
http://localhost:10000/overlay
\`\`\`

Atau jika di-deploy (contoh Render):
\`\`\`
https://your-app.onrender.com/overlay
\`\`\`

### 2. Tambahkan ke OBS
1. Buka OBS Studio
2. Tambah Source → Browser
3. URL: `http://localhost:10000/overlay` (atau URL deploy kamu)
4. Width: 1920, Height: 1080
5. Centang "Shutdown source when not visible" (opsional)
6. Centang "Refresh browser when scene becomes active" (opsional)

### 3. Test Chat (Development)
Untuk testing tanpa live stream:
\`\`\`bash
curl http://localhost:10000/test-chat
\`\`\`

Ini akan mengirim 5 test messages dengan berbagai emote.

### 4. Test Stream Ended
Untuk testing auto-clear localStorage:
\`\`\`bash
curl http://localhost:10000/test-stream-end
\`\`\`

Ini akan trigger event "stream_ended" dan localStorage akan otomatis dihapus.

## Emote yang Didukung

Berikut beberapa emote YouTube yang didukung:

| Code | Emoji | Code | Emoji |
|------|-------|------|-------|
| `:hand-pink-waving:` | 👋 | `:fire:` | 🔥 |
| `:red-heart:` | ❤️ | `:thumbs-up:` | 👍 |
| `:clapping-hands:` | 👏 | `:heart-eyes:` | 😍 |
| `:joy:` | 😂 | `:tada:` | 🎉 |
| `:sparkles:` | ✨ | `:100:` | 💯 |
| `:eyes:` | 👀 | `:pray:` | 🙏 |
| `:muscle:` | 💪 | `:sunglasses:` | 😎 |

Dan masih banyak lagi! Total 60+ emote didukung.

## Cara Kerja localStorage

### Saat Live Stream Aktif
- Chat messages disimpan ke localStorage
- Maximum 50 messages terakhir
- Data persist meskipun refresh browser

### Saat Live Stream Selesai
- Server mendeteksi stream offline
- Broadcast event `stream_ended` ke semua clients
- Overlay otomatis clear localStorage
- Chat history dihapus

### Saat Browser Ditutup
- Jika stream masih live: localStorage **TIDAK** dihapus (data tetap ada)
- Jika stream offline: localStorage **DIHAPUS** otomatis

## File Structure

\`\`\`
youtube-relay/
├── relay.js          # Server utama (WebSocket + Express)
├── overlay.html      # Chat overlay UI
├── package.json      # Dependencies
└── README.md         # Dokumentasi ini
\`\`\`

## API Endpoints

### GET /
Homepage - status server

### GET /overlay
Chat overlay HTML page

### GET /test-chat
Send test chat messages (development only)

### GET /test-stream-end
Trigger stream ended event (development only)

### WebSocket /
Real-time chat connection

## Troubleshooting

### Emote masih muncul sebagai text
- Pastikan sudah restart server setelah update
- Clear browser cache
- Refresh overlay page

### localStorage tidak terhapus saat stream ended
- Cek console browser untuk error
- Pastikan WebSocket connected (lihat status indicator)
- Test manual dengan: `curl http://localhost:10000/test-stream-end`

### WebSocket tidak connect
- Pastikan server running di port yang benar
- Cek firewall/network settings
- Untuk production, pastikan menggunakan WSS (WebSocket Secure) jika site menggunakan HTTPS

### Chat tidak muncul
- Pastikan YouTube API Key valid
- Pastikan Video ID benar
- Cek apakah stream sedang live
- Lihat server logs untuk error

## Deploy ke Production

### Render.com
1. Connect repository
2. Set environment variables:
   - `YT_API_KEY`
   - `YT_VIDEO_ID`
3. Deploy!

### Heroku
\`\`\`bash
heroku create your-app-name
heroku config:set YT_API_KEY=your_key
heroku config:set YT_VIDEO_ID=your_video_id
git push heroku main
\`\`\`

### Vercel/Netlify
Tidak direkomendasikan karena serverless functions memiliki timeout limit yang tidak cocok untuk WebSocket long-polling.

## License

MIT

## Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository ini.
