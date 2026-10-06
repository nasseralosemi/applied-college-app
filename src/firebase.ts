import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ActivityRequest, AuditLogEntry, SystemUser } from './types';
import { INITIAL_REQUESTS, INITIAL_AUDIT_LOGS, DEFAULT_USERS } from './data';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore (using custom database ID provisioned in config)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Authenticate anonymously in the background so all operations succeed
let isAuthReady = false;
export const initAuth = async (): Promise<boolean> => {
  if (isAuthReady) return true;
  try {
    await signInAnonymously(auth);
    isAuthReady = true;
    return true;
  } catch (err) {
    console.warn('Anonymous auth note (proceeding with local rules):', err);
    return false;
  }
};
initAuth();

// Quick connectivity check
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently running in offline persistence mode.');
    }
    return false;
  }
}

// Clean undefined properties before saving to Firestore
function sanitizeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

/**
 * Real-time listener for Activity Requests
 * Automatically seeds initial database if empty
 */
export function subscribeToRequests(
  onUpdate: (requests: ActivityRequest[]) => void,
  onSyncStatus?: (status: 'connected' | 'syncing' | 'error') => void
): () => void {
  const requestsCol = collection(db, 'requests');

  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    requestsCol,
    async (snapshot) => {
      onSyncStatus?.('syncing');

      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        console.log('Seeding initial requests to Firestore cloud database...');
        try {
          await seedInitialRequests();
        } catch (e) {
          console.error('Failed to seed requests to Firestore:', e);
        }
        return;
      }

      if (!snapshot.empty) {
        const cloudRequests: ActivityRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ActivityRequest;
          cloudRequests.push(data);
        });

        // Sort by ID ascending
        cloudRequests.sort((a, b) => Number(a.id) - Number(b.id));
        onUpdate(cloudRequests);
        onSyncStatus?.('connected');
      }
    },
    (err) => {
      console.error('Error listening to requests from Firestore:', err);
      onSyncStatus?.('error');
    }
  );

  return unsubscribe;
}

/**
 * Seed initial requests into Firestore in one batch
 */
export async function seedInitialRequests(): Promise<void> {
  const batch = writeBatch(db);
  INITIAL_REQUESTS.forEach((req) => {
    const docRef = doc(db, 'requests', String(req.id));
    batch.set(docRef, sanitizeData(req));
  });
  await batch.commit();
}

/**
 * Save single Activity Request to Cloud Firestore
 */
export async function saveRequestToCloud(request: ActivityRequest): Promise<void> {
  try {
    const docRef = doc(db, 'requests', String(request.id));
    await setDoc(docRef, sanitizeData(request), { merge: true });
  } catch (e) {
    console.error(`Failed to save request #${request.id} to Firestore:`, e);
    throw e;
  }
}

/**
 * Delete Activity Request from Cloud Firestore
 */
export async function deleteRequestFromCloud(requestId: number): Promise<void> {
  try {
    const docRef = doc(db, 'requests', String(requestId));
    await deleteDoc(docRef);
  } catch (e) {
    console.error(`Failed to delete request #${requestId} from Firestore:`, e);
    throw e;
  }
}

/**
 * Real-time listener for Audit Logs
 */
export function subscribeToAuditLogs(
  onUpdate: (logs: AuditLogEntry[]) => void
): () => void {
  const logsCol = collection(db, 'audit_logs');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    logsCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          const batch = writeBatch(db);
          INITIAL_AUDIT_LOGS.forEach((l) => {
            batch.set(doc(db, 'audit_logs', l.id), sanitizeData(l));
          });
          await batch.commit();
        } catch (e) {
          console.error('Failed to seed audit logs:', e);
        }
        return;
      }

      if (!snapshot.empty) {
        const cloudLogs: AuditLogEntry[] = [];
        snapshot.forEach((docSnap) => {
          cloudLogs.push(docSnap.data() as AuditLogEntry);
        });
        cloudLogs.sort((a, b) => (b.id > a.id ? 1 : -1));
        onUpdate(cloudLogs);
      }
    },
    (err) => {
      console.error('Error listening to audit logs:', err);
    }
  );

  return unsubscribe;
}

/**
 * Save single Audit Log to Cloud Firestore
 */
export async function addAuditLogToCloud(log: AuditLogEntry): Promise<void> {
  try {
    const docRef = doc(db, 'audit_logs', log.id);
    await setDoc(docRef, sanitizeData(log));
  } catch (e) {
    console.error('Failed to add audit log to Firestore:', e);
  }
}

/**
 * Real-time listener for Users
 */
export function subscribeToUsers(
  onUpdate: (users: SystemUser[]) => void
): () => void {
  const usersCol = collection(db, 'users');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    usersCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          const batch = writeBatch(db);
          DEFAULT_USERS.forEach((u) => {
            batch.set(doc(db, 'users', u.id), sanitizeData(u));
          });
          await batch.commit();
        } catch (e) {
          console.error('Failed to seed users:', e);
        }
        return;
      }

      if (!snapshot.empty) {
        const cloudUsers: SystemUser[] = [];
        snapshot.forEach((docSnap) => {
          cloudUsers.push(docSnap.data() as SystemUser);
        });
        onUpdate(cloudUsers);
      }
    },
    (err) => {
      console.error('Error listening to users:', err);
    }
  );

  return unsubscribe;
}

/**
 * Save single User to Cloud Firestore
 */
export async function saveUserToCloud(user: SystemUser): Promise<void> {
  try {
    const docRef = doc(db, 'users', user.id);
    await setDoc(docRef, sanitizeData(user), { merge: true });
  } catch (e) {
    console.error('Failed to save user to Firestore:', e);
  }
}
