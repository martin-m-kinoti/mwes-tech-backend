const admin = require('firebase-admin');
const fs = require('fs');

// Locally FIREBASE_SERVICE_ACCOUNT points at a key file; on Vercel the file is
// not deployed, so the env var holds the service account JSON itself.
function loadCredentials() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!raw) return null;
  if (raw.startsWith('{')) return JSON.parse(raw);
  return JSON.parse(fs.readFileSync(raw, 'utf8'));
}

// Initialises the Firebase Admin SDK.
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  try {
    const credentials = loadCredentials();

    if (credentials) {
      if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }
      admin.initializeApp({ credential: admin.credential.cert(credentials) });
    } else {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    }
  } catch (err) {
    console.error(
      'Firebase Admin SDK could not be initialised. Set FIREBASE_SERVICE_ACCOUNT to the service account JSON (or a path to it locally).',
      err.message
    );
  }
}

initFirebaseAdmin();

// Returns the Firebase Auth instance, or throws if the SDK is not configured.
function getAuth() {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK is not configured.');
  }
  return admin.auth();
}

module.exports = { admin, getAuth };
