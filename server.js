/**
 * SoulSync Campus Quests — Backend Server
 * Authors: Tanmayi Nagabhairava & Dharshini V.
 * 
 * Supports Express (when dependencies installed) or fallback to native Node http server.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- Pre-Approved Safe Campus Landmarks & Initial Quests ---
let campusQuests = [
  {
    id: "quest-1",
    title: "Late Night DSA & Algorithmic Prep",
    category: "study",
    host: "Tanmayi",
    hostAvatar: "👩‍💻",
    landmarkName: "Central Library Discussion Pod 3",
    coordinates: { lat: 12.9348, lng: 77.5348 },
    difficulty: "Medium",
    participantsJoined: 3,
    maxParticipants: 5,
    riddle: "Where towers of quiet paper stand and knowledge sleeps on every shelf, find the corner room with glass walls where three whiteboards wait.",
    riddleAnswers: ["library", "central library", "discussion pod", "books"],
    hint: "Think of where you go when you need absolute focus and reference books.",
    physicalClue: "Wearing a navy blue oversized hoodie, sitting near the corner glass with a silver laptop and a green hydro flask.",
    secretIcebreaker: "Say 'Adventure over Algorithm' to break the ice!",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "quest-2",
    title: "Casual Chai & Startup Brainstorm",
    category: "social",
    host: "Dharshini",
    hostAvatar: "☕",
    landmarkName: "Campus Cafeteria Open Courtyard",
    coordinates: { lat: 12.9341, lng: 77.5352 },
    difficulty: "Easy",
    participantsJoined: 4,
    maxParticipants: 6,
    riddle: "Follow the aroma of crushed cardamom and steamed milk. Find the round stone benches under the leafy banyan canopy.",
    riddleAnswers: ["cafeteria", "canteen", "chai", "coffee", "banyan tree"],
    hint: "The most popular midday tea and snack gathering spot on campus.",
    physicalClue: "Wearing a yellow cardigan, holding a spiral sketchbook on the circular stone bench.",
    secretIcebreaker: "Ask: 'What is the wildest startup idea you thought of this week?'",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "quest-3",
    title: "Sunset Frisbee & Casual Catch",
    category: "sports",
    host: "Arjun",
    hostAvatar: "🥏",
    landmarkName: "Campus Sports Turf / Quadrangle Lawn",
    coordinates: { lat: 12.9338, lng: 77.5340 },
    difficulty: "Easy",
    participantsJoined: 2,
    maxParticipants: 8,
    riddle: "Where artificial turf meets open sky and cleats leave gentle marks, listen for the whistle and look near the grandstand bleachers.",
    riddleAnswers: ["turf", "sports turf", "ground", "lawn", "bleachers"],
    hint: "Where evening football matches and athletic practices happen.",
    physicalClue: "Wearing white sneakers and sports shorts, holding a bright neon orange frisbee.",
    secretIcebreaker: "Give a high five and ask if they prefer defense or offense!",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "quest-4",
    title: "Hackathon Teammate Matching & Ideation",
    category: "tech",
    host: "Rohan",
    hostAvatar: "🚀",
    landmarkName: "Tech Park Innovation Hub Atrium",
    coordinates: { lat: 12.9352, lng: 77.5356 },
    difficulty: "Hard",
    participantsJoined: 3,
    maxParticipants: 4,
    riddle: "I bridge silicon and circuit boards, surrounded by patents and 3D printers. Count three steps up to the interactive projector wall.",
    riddleAnswers: ["tech park", "innovation hub", "atrium", "maker space", "lab"],
    hint: "The building where student startups, robotics clubs, and hackathon teams work late.",
    physicalClue: "Wearing black wireframe glasses and a grey hoodie with a mechanical keyboard on the table.",
    secretIcebreaker: "Say 'Hello World' and share your preferred tech stack!",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

let userProfile = {
  name: "Tanmayi N.",
  email: "tanmayi@pes.edu",
  verified: true,
  level: 2,
  title: "Campus Pathfinder",
  xp: 380,
  nextLevelXp: 500,
  streakDays: 4,
  questsCompleted: 7,
  questsHosted: 3,
  riddlesSolved: 9,
  badges: [
    { id: "b1", name: "Campus Pioneer", icon: "🛡️", desc: "Verified university student member" },
    { id: "b2", name: "Riddle Solver", icon: "🧩", desc: "Cracked 5+ campus quest riddles" },
    { id: "b3", name: "Icebreaker", icon: "🤝", desc: "Completed your first physical meetup" },
    { id: "b4", name: "Chai Connector", icon: "☕", desc: "Joined 3+ casual social quests" }
  ]
};

// --- Haversine Distance Calculation (Meters) ---
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// --- MIME Type Lookup ---
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

// --- Request Handler ---
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API Routes ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // 1. GET /api/quests
    if (pathname === '/api/quests' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, quests: campusQuests }));
      return;
    }

    // 2. GET /api/profile
    if (pathname === '/api/profile' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, profile: userProfile }));
      return;
    }

    // 3. POST /api/quests (Create Quest)
    if (pathname === '/api/quests' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (!data.title || !data.landmarkName || !data.riddle) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: "Missing required quest fields." }));
            return;
          }

          const newQuest = {
            id: `quest-${Date.now()}`,
            title: data.title,
            category: data.category || 'social',
            host: data.host || userProfile.name,
            hostAvatar: data.hostAvatar || '🌟',
            landmarkName: data.landmarkName,
            coordinates: data.coordinates || { lat: 12.9344, lng: 77.5345 },
            difficulty: data.difficulty || 'Medium',
            participantsJoined: 1,
            maxParticipants: parseInt(data.maxParticipants) || 5,
            riddle: data.riddle,
            riddleAnswers: (data.riddleAnswers || [data.landmarkName]).map(a => a.toLowerCase().trim()),
            hint: data.hint || "Look around the main campus landmarks.",
            physicalClue: data.physicalClue || "Waiting at the designated location.",
            secretIcebreaker: data.secretIcebreaker || "Say hello and introduce yourself!",
            status: "active",
            createdAt: new Date().toISOString()
          };

          campusQuests.unshift(newQuest);
          userProfile.questsHosted += 1;
          userProfile.xp += 50;

          res.writeHead(201);
          res.end(JSON.stringify({ success: true, quest: newQuest, message: "Quest hosted successfully! +50 XP" }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: "Invalid JSON format." }));
        }
      });
      return;
    }

    // 4. POST /api/quests/:id/solve (Verify Riddle)
    if (pathname.match(/^\/api\/quests\/[\w-]+\/solve$/) && method === 'POST') {
      const questId = pathname.split('/')[3];
      const quest = campusQuests.find(q => q.id === questId);

      if (!quest) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: "Quest not found." }));
        return;
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { answer } = JSON.parse(body);
          const cleanAnswer = (answer || '').toLowerCase().trim();

          const isMatch = quest.riddleAnswers.some(accepted =>
            cleanAnswer.includes(accepted) || accepted.includes(cleanAnswer)
          );

          if (isMatch) {
            userProfile.riddlesSolved += 1;
            userProfile.xp += 30;
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              solved: true,
              message: "Riddle cracked! Destination coordinate unlocked on the radar. +30 XP",
              destination: quest.coordinates,
              landmarkName: quest.landmarkName
            }));
          } else {
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              solved: false,
              message: "Not quite! Re-read the clue carefully or use a hint."
            }));
          }
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: "Invalid JSON." }));
        }
      });
      return;
    }

    // 5. POST /api/quests/:id/proximity (The Reveal)
    if (pathname.match(/^\/api\/quests\/[\w-]+\/proximity$/) && method === 'POST') {
      const questId = pathname.split('/')[3];
      const quest = campusQuests.find(q => q.id === questId);

      if (!quest) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: "Quest not found." }));
        return;
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { userLat, userLng } = JSON.parse(body);
          const distance = calculateDistanceMeters(
            userLat,
            userLng,
            quest.coordinates.lat,
            quest.coordinates.lng
          );

          const GEOFENCE_RADIUS_METERS = 30; // Proximity threshold
          const isWithinRange = distance <= GEOFENCE_RADIUS_METERS;

          if (isWithinRange) {
            userProfile.questsCompleted += 1;
            userProfile.xp += 100;
            if (userProfile.xp >= userProfile.nextLevelXp) {
              userProfile.level += 1;
              userProfile.title = "Master of Quests";
            }

            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              revealed: true,
              distanceMeters: distance,
              revealData: {
                hostName: quest.host,
                hostAvatar: quest.hostAvatar,
                physicalClue: quest.physicalClue,
                secretIcebreaker: quest.secretIcebreaker,
                landmarkName: quest.landmarkName,
                xpEarned: 100
              }
            }));
          } else {
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              revealed: false,
              distanceMeters: distance,
              message: `You are ${distance}m away. Walk closer (within ${GEOFENCE_RADIUS_METERS}m) to trigger The Reveal!`
            }));
          }
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: "Invalid payload." }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: "Endpoint not found." }));
    return;
  }

  // --- Static File Serving ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, safePath);

  // If file doesn't exist in public, check docs directory
  if (!fs.existsSync(filePath)) {
    const docsPath = path.join(__dirname, 'docs', safePath);
    if (fs.existsSync(docsPath)) {
      filePath = docsPath;
    } else {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(handleRequest);

let currentPort = parseInt(process.env.PORT, 10) || 3001;

function startServer(port) {
  server.listen(port, () => {
    console.log(`====================================================`);
    console.log(`🧭 SoulSync — Adventure Over Algorithm Server Active`);
    console.log(`📍 Web App: http://localhost:${port}`);
    console.log(`👥 Authors: Tanmayi Nagabhairava & Dharshini V.`);
    console.log(`====================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort += 1;
    console.log(`Port in use, trying port ${currentPort}...`);
    startServer(currentPort);
  } else {
    console.error(err);
  }
});

startServer(currentPort);

