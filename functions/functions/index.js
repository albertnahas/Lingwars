const functions = require("firebase-functions");

const seedRange = 999999

// Listens for user creation
exports.challengeCreated = functions.firestore.document("/challenges/{id}")
    .onCreate(async (snap) => {
        snap.ref.set({ seed: Math.round(Math.random() * seedRange) }, { merge: true });
        return true;
    });
