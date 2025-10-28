// relay.js
import express from "express";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.YT_API_KEY || "ISI_API_KEY_KAMU"; // taruh di dashboard Render
const VIDEO_ID = process.env.YT_VIDEO_ID || "ganti_dengan_video_id_kamu";

const app = express();
const server = app.listen(PORT, () => {
  console.log(`🚀 Relay Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

// === Store connection clients ===
let clients = new Set();
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});

// === Helper: Broadcast message ke semua client overlay ===
function broadcast(msg) {
  const data = JSON.stringify(msg);
  for (const client of clients) {
    if (client.readyState === 1) client.send(data);
  }
}

// === YouTube Live Chat Handling ===
let liveChatId = null;
let nextPageToken = "";
let lastFetch = Date.now();

async function getLiveChatId(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items?.[0]?.liveStreamingDetails?.activeLiveChatId || null;
}

async function fetchChat() {
  if (!liveChatId) return;

  let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    nextPageToken = data.nextPageToken;
    lastFetch = Date.now();

    const messages = data.items || [];
    for (const item of messages) {
      const author = item.authorDetails.displayName;
      const message = item.snippet.displayMessage;
      const isOwner = item.authorDetails.isChatOwner;
      const isMod = item.authorDetails.isChatModerator;
      const isMember = item.authorDetails.isChatSponsor;

      let role = "yt-viewer";
      if (isOwner) role = "yt-owner";
      else if (isMod) role = "yt-moderator";
      else if (isMember) role = "yt-subscriber";

      broadcast({
        type: "chat",
        author,
        message,
        role,
        time: new Date().toISOString(),
      });
    }

    const delay = Math.max(data.pollingIntervalMillis || 4000, 3000);
    setTimeout(fetchChat, delay);
  } catch (err) {
    console.error("⚠️ Fetch error:", err.message);
    if (Date.now() - lastFetch > 300000) {
      console.log("🔄 Refreshing LiveChat ID...");
      initChat();
    } else {
      setTimeout(fetchChat, 10000);
    }
  }
}

async function initChat() {
  console.log("🎬 Initializing YouTube Chat...");
  liveChatId = await getLiveChatId(VIDEO_ID);
  if (liveChatId) {
    console.log("✅ Got LiveChat ID:", liveChatId);
    fetchChat();
  } else {
    console.log("❌ Stream offline, retrying in 30s...");
    setTimeout(initChat, 30000);
  }
}

// Start fetching
initChat();

// Simple homepage
app.get("/", (req, res) => {
  res.send("✅ YouTube Relay Server is running.");
});
