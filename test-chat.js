// test-chat.js - Script untuk test chat dengan emote
import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:10000');

ws.on('open', () => {
  console.log('✅ Connected to server');
  
  // Simulate chat messages with emotes
  const testMessages = [
    {
      type: 'chat',
      author: 'TestUser1',
      message: 'Hello :hand-pink-waving: everyone!',
      role: 'yt-viewer',
      time: new Date().toISOString()
    },
    {
      type: 'chat',
      author: 'TestMod',
      message: 'Great stream :fire: :fire: :fire:',
      role: 'yt-moderator',
      time: new Date().toISOString()
    },
    {
      type: 'chat',
      author: 'TestOwner',
      message: 'Thanks for watching :red-heart: :clapping-hands:',
      role: 'yt-owner',
      time: new Date().toISOString()
    },
    {
      type: 'chat',
      author: 'TestMember',
      message: 'Amazing content :thumbs-up: :100:',
      role: 'yt-subscriber',
      time: new Date().toISOString()
    },
    {
      type: 'chat',
      author: 'TestUser2',
      message: 'This is awesome :heart-eyes: :sparkles: :tada:',
      role: 'yt-viewer',
      time: new Date().toISOString()
    }
  ];

  // Send messages with delay
  testMessages.forEach((msg, index) => {
    setTimeout(() => {
      console.log(`Sending message ${index + 1}:`, msg.message);
      // Broadcast to all clients (server will handle this)
      // We need to send to server, but server only broadcasts received messages
      // So we'll just log here - in real scenario, messages come from YouTube API
    }, index * 1000);
  });

  // Test stream ended after 10 seconds
  setTimeout(() => {
    console.log('📡 Simulating stream ended...');
    // Server will send this when stream actually ends
  }, 10000);

  setTimeout(() => {
    ws.close();
    console.log('Test completed');
  }, 12000);
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('error', (error) => {
  console.error('Error:', error);
});
