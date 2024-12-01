const admin = require("firebase-admin");
const serviceAccountKey = require("../serviceAccountKey.json");

if (!admin.apps || !admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });
}

const adminAuth = admin.auth();
const db = admin.firestore();

module.exports = { adminAuth, db };
