# 🧭 SoulSync — Adventure Over Algorithm

> **A Gamified Solution to Student Disconnection**  
> *Created & Designed by Tanmayi Nagabhairava & Dharshini V.*

---

## 🌟 Overview

**SoulSync** is an interactive, location-based social adventure web application engineered to bridge the gap between students on campus. 

Traditional social networking tools rely on algorithmic profiles and cold direct messages that often feel awkward or forced. SoulSync introduces **"Adventure Over Algorithm"** — bringing students together through shared real-world experiences. 

Campus hosts broadcast **Quests** disguised as clever riddles and puzzles leading to safe, public physical meetup spots. When participants arrive within the geofenced perimeter, the app triggers **"The Reveal"**, removing social anxiety by identifying the host and providing a fun icebreaker!

---

## ✨ Core Features & Mechanics

| Feature | Description |
| :--- | :--- |
| 📍 **Live Interactive Campus Radar** | Dynamic Leaflet map centered on campus displaying active quest beacons, safe perimeter polygons, and real-time anonymized participant avatars. |
| 🧩 **Riddle-Based Quests** | Meetup locations are encrypted behind contextual campus riddles with hint systems and answer validation. |
| 🎉 **"The Reveal" Engine** | Proximity detection (Haversine formula < 20m) unlocks the host's identity, physical appearance cue (*e.g., "navy hoodie sitting by the glass steps with an open laptop"*), and a secret icebreaker. |
| 🚀 **Host a Quest Studio** | Students can host their own study sprints, casual chai chats, badminton matches, or hackathon brainstorms with an integrated **AI Riddle Generator**. |
| 🛡️ **Safety by Design** | Mandatory institutional email authentication (`@pes.edu` / `@*.edu`) and geofencing restricted strictly to pre-approved public campus grounds. |
| 🏆 **Gamification & Badges** | XP leveling system (*Campus Pathfinder* ➔ *Master of Quests*), daily active streaks, and collectible achievement badges. |

---

## 📂 Project Architecture

```
soulsync-campus-quests/
├── docs/
│   ├── CONCEPT_AND_DESIGN.md      # Detailed system design, problem statement, and roadmap
│   └── SoulSync_Presentation.pptx # Original concept presentation
├── public/                        # Frontend Single-Page Application (PWA Ready)
│   ├── index.html                 # Modern Tailwind CSS + Leaflet responsive UI
│   ├── app.js                     # State management, geofencing, Leaflet mapping, avatar simulation
│   └── styles.css                 # Glassmorphism, animations, and custom radar pulse beacons
├── tests/
│   └── test_engine.js             # Automated unit tests for geofencing, riddles, auth, and XP leveling
├── server.js                      # Node.js Express REST API & static server (fallback-resilient)
├── package.json                   # Project metadata and dependencies
└── README.md
```

---

## 🚀 Getting Started

### 1. Instant Run (No Setup Required)
You can directly open `public/index.html` in any modern web browser! The application includes offline resilience and embedded campus seed data.

### 2. Full-Stack Server Mode
To run with the Node.js backend server:

```bash
# Clone the repository
git clone https://github.com/Tanmayi-n14/soulsync-campus-quests.git
cd soulsync-campus-quests

# Install dependencies (optional, server has native http fallback)
npm install

# Start the server
npm start
```
The application will launch at: **`http://localhost:3001`** (or your assigned port).

---

## 🧪 Automated Testing

SoulSync includes a unit test suite validating the core geofencing math, email domain verification, and riddle matching:

```bash
npm test
```

### Verified Test Coverage:
* ✔️ **Haversine Distance Accuracy**: Verifies $O(1)$ coordinate distance calculations and 15–20m geofence thresholds.
* ✔️ **University Email Gatekeeping**: Validates `@pes.edu` and `@*.edu` while strictly filtering generic email providers.
* ✔️ **Riddle Matching Engine**: Case-insensitivity, whitespace trimming, and contextual keyword matching.

---

## 👥 Authors

* **Tanmayi Nagabhairava** ([@Tanmayi-n14](https://github.com/Tanmayi-n14)) — `PES1UG24CS493`
* **Dharshini V.** ([@DharshiniPES](https://github.com/DharshiniPES))
* Department of Computer Science & Engineering, PES University
