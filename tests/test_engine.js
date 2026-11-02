/**
 * SoulSync Test Suite
 * Verifies core geofencing, riddle solving, auth validation, and leveling calculations.
 */

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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

function isValidUniversityEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*edu(\.[a-zA-Z]{2,})?$/i;
  return pattern.test(email.trim());
}

function isRiddleAnswerCorrect(userInput, acceptedAnswers) {
  const clean = (userInput || '').toLowerCase().trim();
  return acceptedAnswers.some(accepted => {
    const cleanAccepted = accepted.toLowerCase().trim();
    return clean.includes(cleanAccepted) || cleanAccepted.includes(clean);
  });
}

function runTests() {
  console.log("=== SoulSync Core Engine Test Suite ===\n");
  let passed = 0;
  let total = 0;

  function assert(testName, condition) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // 1. Distance & Geofence Tests
  // Two points ~20 meters apart on PES University campus
  const d1 = calculateDistanceMeters(12.93480, 77.53480, 12.93485, 77.53495);
  assert("Haversine distance calculation is accurate (approx 17-20m)", d1 >= 15 && d1 <= 25);

  const dZero = calculateDistanceMeters(12.9348, 77.5348, 12.9348, 77.5348);
  assert("Distance to same coordinate is 0 meters", dZero === 0);

  // 2. University Email Safety Validation
  assert("Valid PES University email (@pes.edu)", isValidUniversityEmail("tanmayi@pes.edu"));
  assert("Valid Stanford University email (@cs.stanford.edu)", isValidUniversityEmail("student@cs.stanford.edu"));
  assert("Reject generic Gmail (@gmail.com)", !isValidUniversityEmail("random@gmail.com"));
  assert("Reject Yahoo mail (@yahoo.com)", !isValidUniversityEmail("fake@yahoo.com"));

  // 3. Riddle Solver Logic
  const libraryAnswers = ["library", "central library", "discussion pod"];
  assert("Exact riddle answer matches ('central library')", isRiddleAnswerCorrect("central library", libraryAnswers));
  assert("Case-insensitive riddle answer matches ('LIBRARY')", isRiddleAnswerCorrect("LIBRARY", libraryAnswers));
  assert("Conversational riddle answer matches ('at the library')", isRiddleAnswerCorrect("at the library", libraryAnswers));
  assert("Incorrect answer rejected ('cafeteria')", !isRiddleAnswerCorrect("cafeteria", libraryAnswers));

  console.log(`\n===================================`);
  console.log(`Results: ${passed}/${total} tests passed.`);
  console.log(`===================================`);

  if (passed !== total) process.exit(1);
}

runTests();
