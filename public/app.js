/**
 * SoulSync — Adventure Over Algorithm Frontend Engine
 * Authors: Tanmayi Nagabhairava & Dharshini V.
 */

// --- Initial Campus Seed Data (Used directly or as offline fallback) ---
const INITIAL_QUESTS = [
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
    status: "active"
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
    status: "active"
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
    status: "active"
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
    status: "active"
  }
];

let currentUser = {
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

// Global App State
let quests = [...INITIAL_QUESTS];
let selectedQuest = null;
let currentFilter = 'all';
let map, markersLayer, avatarsLayer;
let simulatedAvatars = [];

// --- Geofence Perimeter Bounds (Safe Campus Zone) ---
const CAMPUS_CENTER = [12.9344, 77.5345];
const CAMPUS_PERIMETER = [
  [12.9360, 77.5330],
  [12.9360, 77.5365],
  [12.9330, 77.5365],
  [12.9330, 77.5330]
];

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  setupEventListeners();
  fetchInitialData();
  renderQuestsList();
  renderProfile();
  initSimulatedAvatars();
});

// --- Map Initialization ---
function initMap() {
  map = L.map('campus-map', {
    zoomControl: false,
    minZoom: 15,
    maxZoom: 19
  }).setView(CAMPUS_CENTER, 17);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Standard OpenStreetMap Tiles (100% Free, No API Key Required)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Safe Public Campus Zone Polygon (Boundary)
  L.polygon(CAMPUS_PERIMETER, {
    color: '#4f46e5',
    weight: 2,
    dashArray: '6, 6',
    fillColor: '#6366f1',
    fillOpacity: 0.08
  }).addTo(map).bindTooltip("🎓 Safe Public Campus Perimeter", { sticky: true });

  // Styled Campus Landmark Footprints
  const landmarks = [
    {
      name: "📚 Central Library",
      coords: [[12.9346, 77.5346], [12.9350, 77.5346], [12.9350, 77.5350], [12.9346, 77.5350]],
      color: '#3b82f6'
    },
    {
      name: "☕ Cafeteria & Food Court",
      coords: [[12.9339, 77.5350], [12.9343, 77.5350], [12.9343, 77.5354], [12.9339, 77.5354]],
      color: '#f59e0b'
    },
    {
      name: "🥏 Sports Ground / Turf",
      coords: [[12.9335, 77.5338], [12.9340, 77.5338], [12.9340, 77.5343], [12.9335, 77.5343]],
      color: '#10b981'
    },
    {
      name: "🚀 Tech Park Atrium",
      coords: [[12.9350, 77.5354], [12.9354, 77.5354], [12.9354, 77.5358], [12.9350, 77.5358]],
      color: '#8b5cf6'
    }
  ];

  landmarks.forEach(lm => {
    L.polygon(lm.coords, {
      color: lm.color,
      weight: 1.5,
      fillColor: lm.color,
      fillOpacity: 0.25
    }).addTo(map).bindTooltip(lm.name, { permanent: false, direction: 'top' });
  });

  markersLayer = L.layerGroup().addTo(map);
  avatarsLayer = L.layerGroup().addTo(map);

  renderMapMarkers();

  // Invalidate map size so tiles calculate container dimensions cleanly
  setTimeout(() => {
    map.invalidateSize();
  }, 250);
  window.addEventListener('resize', () => {
    map.invalidateSize();
  });
}

// --- Render Map Markers ---
function renderMapMarkers() {
  markersLayer.clearLayers();

  const filtered = currentFilter === 'all' 
    ? quests 
    : quests.filter(q => q.category === currentFilter);

  filtered.forEach(quest => {
    const isSelected = selectedQuest && selectedQuest.id === quest.id;

    const iconHtml = `
      <div class="custom-quest-marker ${isSelected ? 'ring-4 ring-brand-500 scale-110' : ''} quest-pulse-beacon">
        ${quest.hostAvatar || '📍'}
        <span class="marker-label">${quest.title.split(' ')[0]} ${quest.title.split(' ')[1] || ''}</span>
      </div>
    `;

    const marker = L.marker([quest.coordinates.lat, quest.coordinates.lng], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: iconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      })
    });

    marker.on('click', () => {
      openRiddleModal(quest);
    });

    markersLayer.addLayer(marker);
  });
}

// --- Live Simulated Walking Avatars ---
function initSimulatedAvatars() {
  const avatarEmojis = ['🎒', '🎧', '🏃‍♂️', '🎨', '🛹'];
  
  simulatedAvatars = avatarEmojis.map((emoji, idx) => ({
    id: `avatar-${idx}`,
    emoji: emoji,
    lat: 12.9344 + (Math.random() - 0.5) * 0.002,
    lng: 77.5345 + (Math.random() - 0.5) * 0.002,
    targetQuest: quests[idx % quests.length]
  }));

  updateAvatarPositions();
  setInterval(updateAvatarPositions, 3000);
}

function updateAvatarPositions() {
  avatarsLayer.clearLayers();

  simulatedAvatars.forEach(avatar => {
    // Walk slowly towards target quest
    if (avatar.targetQuest) {
      avatar.lat += (avatar.targetQuest.coordinates.lat - avatar.lat) * 0.08 + (Math.random() - 0.5) * 0.0001;
      avatar.lng += (avatar.targetQuest.coordinates.lng - avatar.lng) * 0.08 + (Math.random() - 0.5) * 0.0001;
    }

    const marker = L.marker([avatar.lat, avatar.lng], {
      icon: L.divIcon({
        className: 'custom-avatar-div',
        html: `<div class="custom-avatar-marker">${avatar.emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    });

    avatarsLayer.addLayer(marker);
  });
}

// --- Render Quests List in Sidebar ---
function renderQuestsList() {
  const container = document.getElementById('quests-list');
  const counter = document.getElementById('active-quests-count');

  const filtered = currentFilter === 'all' 
    ? quests 
    : quests.filter(q => q.category === currentFilter);

  counter.textContent = `${filtered.length} live`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <i class="fa-solid fa-compass text-3xl mb-2 text-slate-300"></i>
        <p class="text-sm font-semibold">No active quests in this category.</p>
        <p class="text-xs mt-1">Be the first to host one!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(quest => {
    const isSelected = selectedQuest && selectedQuest.id === quest.id;
    const categoryBadgeColors = {
      study: 'bg-blue-100 text-blue-700 border-blue-200',
      social: 'bg-amber-100 text-amber-800 border-amber-200',
      sports: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tech: 'bg-purple-100 text-purple-700 border-purple-200'
    };

    return `
      <div class="quest-card bg-white p-4 rounded-xl border ${isSelected ? 'border-brand-500 shadow-md ring-2 ring-brand-100' : 'border-slate-200 hover:border-slate-300 shadow-sm'} transition-all cursor-pointer" onclick="selectQuest('${quest.id}')">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2.5">
            <span class="text-2xl">${quest.hostAvatar || '📍'}</span>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryBadgeColors[quest.category] || 'bg-slate-100 text-slate-700'}">
                ${quest.category}
              </span>
              <h3 class="font-bold text-slate-900 text-sm mt-0.5">${quest.title}</h3>
            </div>
          </div>
          <span class="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            ${quest.difficulty}
          </span>
        </div>

        <p class="text-xs text-slate-500 line-clamp-2 mt-2 italic font-serif">
          "${quest.riddle}"
        </p>

        <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
          <span class="text-slate-500 flex items-center font-medium">
            <i class="fa-solid fa-users text-slate-400 mr-1.5"></i>
            ${quest.participantsJoined}/${quest.maxParticipants} joined
          </span>
          <button class="text-brand-600 font-bold hover:text-brand-700 flex items-center">
            <span>Solve Riddle</span>
            <i class="fa-solid fa-chevron-right text-[10px] ml-1"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- Select a Quest ---
window.selectQuest = function(questId) {
  selectedQuest = quests.find(q => q.id === questId);
  if (!selectedQuest) return;

  renderQuestsList();
  renderMapMarkers();

  // Pan map to quest coordinate
  map.flyTo([selectedQuest.coordinates.lat, selectedQuest.coordinates.lng], 18, {
    duration: 1.2
  });

  openRiddleModal(selectedQuest);
};

// --- Riddle Modal & Solving ---
function openRiddleModal(quest) {
  selectedQuest = quest;
  const modal = document.getElementById('riddle-modal');

  document.getElementById('modal-host-avatar').textContent = quest.hostAvatar || '👩‍💻';
  document.getElementById('modal-category-tag').textContent = quest.category;
  document.getElementById('modal-quest-title').textContent = quest.title;
  document.getElementById('modal-host-subtext').textContent = `Hosted by ${quest.host} • ${quest.participantsJoined}/${quest.maxParticipants} Joined`;
  document.getElementById('modal-difficulty-badge').textContent = quest.difficulty;
  document.getElementById('modal-riddle-text').textContent = `"${quest.riddle}"`;
  document.getElementById('modal-hint-text').textContent = quest.hint || "Search around the prominent central landmarks.";
  document.getElementById('modal-hint-text').classList.add('hidden');

  // Reset inputs
  document.getElementById('riddle-answer-input').value = '';
  document.getElementById('riddle-feedback-msg').classList.add('hidden');
  document.getElementById('unlocked-destination-box').classList.add('hidden');
  document.getElementById('solver-input-section').classList.remove('hidden');

  modal.classList.remove('hidden');
}

function handleRiddleSubmit() {
  if (!selectedQuest) return;

  const input = document.getElementById('riddle-answer-input');
  const answer = (input.value || '').toLowerCase().trim();
  const feedback = document.getElementById('riddle-feedback-msg');

  if (!answer) {
    feedback.textContent = "Please enter your guess!";
    feedback.className = "text-xs font-semibold text-rose-600";
    feedback.classList.remove('hidden');
    return;
  }

  // Check answer against accepted answers
  const isMatch = selectedQuest.riddleAnswers.some(accepted => 
    answer.includes(accepted.toLowerCase()) || accepted.toLowerCase().includes(answer)
  );

  if (isMatch) {
    feedback.textContent = "🎉 Correct! Destination coordinate unlocked on radar (+30 XP)";
    feedback.className = "text-xs font-bold text-emerald-600";
    feedback.classList.remove('hidden');

    document.getElementById('solver-input-section').classList.add('hidden');
    document.getElementById('unlocked-landmark-name').textContent = selectedQuest.landmarkName;
    document.getElementById('unlocked-destination-box').classList.remove('hidden');

    // Update Profile XP
    currentUser.xp += 30;
    currentUser.riddlesSolved += 1;
    renderProfile();

    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  } else {
    feedback.textContent = "❌ Not quite! Review the clue carefully or reveal a hint.";
    feedback.className = "text-xs font-semibold text-rose-600";
    feedback.classList.remove('hidden');
  }
}

// --- "The Reveal" Trigger (Proximity Simulation) ---
function triggerTheReveal() {
  if (!selectedQuest) {
    selectedQuest = quests[0]; // Auto-select first active quest as default
  }

  // Populate Reveal Modal
  document.getElementById('reveal-host-avatar').textContent = selectedQuest.hostAvatar || '👩‍💻';
  document.getElementById('reveal-host-name').textContent = selectedQuest.host;
  document.getElementById('reveal-physical-clue').textContent = `"${selectedQuest.physicalClue}"`;
  document.getElementById('reveal-icebreaker').textContent = `"${selectedQuest.secretIcebreaker}"`;

  // Close other modals and show reveal modal
  document.getElementById('riddle-modal').classList.add('hidden');
  document.getElementById('reveal-modal').classList.remove('hidden');

  // Trigger celebratory confetti
  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// --- Claim Meetup Reward ---
function claimMeetupReward() {
  currentUser.questsCompleted += 1;
  currentUser.xp += 100;

  if (currentUser.xp >= currentUser.nextLevelXp) {
    currentUser.level += 1;
    currentUser.title = "Master of Quests";
    currentUser.nextLevelXp += 250;
    alert(`🎉 Level Up! You reached Level ${currentUser.level}: ${currentUser.title}!`);
  }

  renderProfile();
  document.getElementById('reveal-modal').classList.add('hidden');
  document.getElementById('riddle-modal').classList.add('hidden');

  alert("🌟 Meetup verified! +100 XP awarded to your adventurer profile.");
}

// --- "Host a Quest" Submission ---
function handleHostQuestSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('new-quest-title').value.trim();
  const category = document.getElementById('new-quest-category').value;
  const maxParticipants = parseInt(document.getElementById('new-quest-max').value) || 4;
  const landmarkSelect = document.getElementById('new-quest-landmark');
  const selectedOption = landmarkSelect.options[landmarkSelect.selectedIndex];
  const landmarkName = selectedOption.text;
  const lat = parseFloat(selectedOption.getAttribute('data-lat'));
  const lng = parseFloat(selectedOption.getAttribute('data-lng'));
  const riddle = document.getElementById('new-quest-riddle').value.trim();
  const answer = document.getElementById('new-quest-answer').value.trim();
  const physical = document.getElementById('new-quest-physical').value.trim();

  const categoryAvatars = {
    social: '☕',
    study: '📚',
    sports: '🥏',
    tech: '🚀'
  };

  const newQuest = {
    id: `quest-${Date.now()}`,
    title: title,
    category: category,
    host: currentUser.name.split(' ')[0],
    hostAvatar: categoryAvatars[category] || '🌟',
    landmarkName: landmarkName,
    coordinates: { lat, lng },
    difficulty: "Medium",
    participantsJoined: 1,
    maxParticipants: maxParticipants,
    riddle: riddle,
    riddleAnswers: [answer, landmarkName.split(' ')[0].toLowerCase()],
    hint: `Located around ${landmarkName}`,
    physicalClue: physical,
    secretIcebreaker: "Introduce yourself and share what brought you to this quest!",
    status: "active"
  };

  quests.unshift(newQuest);
  currentUser.questsHosted += 1;
  currentUser.xp += 50;

  renderQuestsList();
  renderMapMarkers();
  renderProfile();

  document.getElementById('host-modal').classList.add('hidden');
  document.getElementById('host-quest-form').reset();

  alert("🚀 Quest broadcast live across campus radar! +50 XP");
}

// --- AI Riddle Auto-Generator Presets ---
function generateAIRiddle() {
  const landmarkSelect = document.getElementById('new-quest-landmark');
  const landmark = landmarkSelect.value;
  const riddleBox = document.getElementById('new-quest-riddle');
  const answerBox = document.getElementById('new-quest-answer');

  const riddleTemplates = {
    "Central Library Lawn": {
      riddle: "Where thousand pages bind the brightest minds, seek the green lawn outside the main book depository.",
      answer: "library"
    },
    "Campus Cafeteria Courtyard": {
      riddle: "Follow the hot steam of filter coffee and warm samosas to the shaded stone tables outside.",
      answer: "cafeteria"
    },
    "Quadrangle Green Turf": {
      riddle: "Under the open Bangalore sky where sports cleats meet turf, listen for the bounce near the bleachers.",
      answer: "turf"
    },
    "Tech Park Atrium": {
      riddle: "Where student startups pitch and circuit boards hum, find the glass entrance with the interactive wall.",
      answer: "tech park"
    }
  };

  const selected = riddleTemplates[landmark] || {
    riddle: "At the center of campus where paths cross and students meet between lectures.",
    answer: "campus"
  };

  riddleBox.value = selected.riddle;
  answerBox.value = selected.answer;
}

// --- Render Profile Header & Modal ---
function renderProfile() {
  document.getElementById('nav-streak').textContent = `${currentUser.streakDays}d`;
  document.getElementById('nav-level-title').textContent = `Lvl ${currentUser.level} ${currentUser.title}`;
  document.getElementById('nav-xp-counter').textContent = `${currentUser.xp}/${currentUser.nextLevelXp} XP`;

  const pct = Math.min(100, Math.round((currentUser.xp / currentUser.nextLevelXp) * 100));
  document.getElementById('nav-xp-bar').style.width = `${pct}%`;

  // Profile Modal Stats
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-email').textContent = currentUser.email;
  document.getElementById('profile-rank').textContent = `Lvl ${currentUser.level} ${currentUser.title}`;
  document.getElementById('stat-completed').textContent = currentUser.questsCompleted;
  document.getElementById('stat-riddles').textContent = currentUser.riddlesSolved;
  document.getElementById('stat-hosted').textContent = currentUser.questsHosted;

  // Badges
  const badgesContainer = document.getElementById('badges-container');
  badgesContainer.innerHTML = currentUser.badges.map(b => `
    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
      <span class="text-xl">${b.icon}</span>
      <div>
        <h6 class="text-xs font-bold text-slate-800">${b.name}</h6>
        <p class="text-[10px] text-slate-500 leading-tight">${b.desc}</p>
      </div>
    </div>
  `).join('');
}

// --- Setup Event Listeners ---
function setupEventListeners() {
  // Category Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = "filter-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition";
      });
      e.target.className = "filter-btn px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium shadow-sm transition";

      currentFilter = e.target.getAttribute('data-filter');
      renderQuestsList();
      renderMapMarkers();
    });
  });

  // Modal Triggers & Closers
  document.getElementById('close-riddle-modal-btn').addEventListener('click', () => {
    document.getElementById('riddle-modal').classList.add('hidden');
  });

  document.getElementById('submit-riddle-btn').addEventListener('click', handleRiddleSubmit);
  document.getElementById('riddle-answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleRiddleSubmit();
  });

  document.getElementById('toggle-hint-btn').addEventListener('click', () => {
    document.getElementById('modal-hint-text').classList.toggle('hidden');
  });

  document.getElementById('simulate-proximity-btn').addEventListener('click', triggerTheReveal);
  document.getElementById('claim-meetup-btn').addEventListener('click', claimMeetupReward);
  document.getElementById('close-reveal-modal-btn').addEventListener('click', () => {
    document.getElementById('reveal-modal').classList.add('hidden');
  });

  // Click backdrop outside modal box to close
  ['riddle-modal', 'reveal-modal', 'host-modal', 'profile-modal'].forEach(modalId => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) modalEl.classList.add('hidden');
      });
    }
  });

  // Host a Quest
  document.getElementById('open-host-modal-btn').addEventListener('click', () => {
    document.getElementById('host-modal').classList.remove('hidden');
  });
  document.getElementById('close-host-modal-btn').addEventListener('click', () => {
    document.getElementById('host-modal').classList.add('hidden');
  });
  document.getElementById('host-quest-form').addEventListener('submit', handleHostQuestSubmit);
  document.getElementById('auto-generate-riddle-btn').addEventListener('click', generateAIRiddle);

  // Profile Modal
  document.getElementById('open-profile-btn').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.remove('hidden');
  });
  document.getElementById('profile-pill-btn').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.remove('hidden');
  });
  document.getElementById('close-profile-modal-btn').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.add('hidden');
  });

  // Center Campus View Button
  document.getElementById('campus-view-btn').addEventListener('click', () => {
    map.flyTo(CAMPUS_CENTER, 17);
  });
}

// --- Fetch Initial Data from Server (with fallback) ---
async function fetchInitialData() {
  try {
    const res = await fetch('/api/quests');
    if (res.ok) {
      const data = await res.json();
      if (data.quests && data.quests.length > 0) {
        quests = data.quests;
        renderQuestsList();
        renderMapMarkers();
      }
    }
  } catch (e) {
    console.log("Running in standalone/offline mode with built-in campus seed data.");
  }
}
