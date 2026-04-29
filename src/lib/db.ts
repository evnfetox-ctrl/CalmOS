export interface AngerLog {
  id: string;
  timestamp: number;
  trigger: string;
  reacted: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  ageGroup?: string;
  goals: string;
  triggers?: string;
  copingMethods?: string;
  preferences: string;
  hasSeenTour?: boolean;
}

const DB_NAME = 'calmOS_db';
const LOGS_STORE = 'anger_logs';
const CHAT_STORE = 'chat_messages';
const PROFILE_STORE = 'user_profile';
const DB_VERSION = 3;

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(LOGS_STORE)) {
        db.createObjectStore(LOGS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PROFILE_STORE)) {
        db.createObjectStore(PROFILE_STORE);
      }
    };
  });
}

// Profile Functions
export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROFILE_STORE, 'readwrite');
    const store = transaction.objectStore(PROFILE_STORE);
    const request = store.put(profile, 'current_user');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getProfile(): Promise<UserProfile | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROFILE_STORE, 'readonly');
    const store = transaction.objectStore(PROFILE_STORE);
    const request = store.get('current_user');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function markTourAsSeen(): Promise<void> {
  const profile = await getProfile() || { name: '', goals: '', preferences: '' };
  await saveProfile({ ...profile, hasSeenTour: true });
}

// Anger Logs Functions
export async function saveLog(log: AngerLog): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOGS_STORE, 'readwrite');
    const store = transaction.objectStore(LOGS_STORE);
    const request = store.add(log);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getLogs(): Promise<AngerLog[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOGS_STORE, 'readonly');
    const store = transaction.objectStore(LOGS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Chat Functions
export async function saveChatMessage(message: ChatMessage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHAT_STORE, 'readwrite');
    const store = transaction.objectStore(CHAT_STORE);
    const request = store.add(message);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHAT_STORE, 'readonly');
    const store = transaction.objectStore(CHAT_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result as ChatMessage[];
      resolve(results.sort((a, b) => a.timestamp - b.timestamp));
    };
    request.onerror = () => reject(request.error);
  });
}

// Export/Import
export async function exportAllData(): Promise<string> {
  const logs = await getLogs();
  const chats = await getChatHistory();
  const profile = await getProfile();
  return JSON.stringify({ logs, chats, profile, version: DB_VERSION });
}

export async function importData(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData);
  const db = await openDB();
  const transaction = db.transaction([LOGS_STORE, CHAT_STORE, PROFILE_STORE], 'readwrite');
  
  const logStore = transaction.objectStore(LOGS_STORE);
  const chatStore = transaction.objectStore(CHAT_STORE);
  const profileStore = transaction.objectStore(PROFILE_STORE);

  logStore.clear();
  chatStore.clear();
  profileStore.clear();

  if (data.logs) data.logs.forEach((l: any) => logStore.put(l));
  if (data.chats) data.chats.forEach((c: any) => chatStore.put(c));
  if (data.profile) profileStore.put(data.profile, 'current_user');

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function clearAllData(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LOGS_STORE, CHAT_STORE, PROFILE_STORE], 'readwrite');
    transaction.objectStore(LOGS_STORE).clear();
    transaction.objectStore(CHAT_STORE).clear();
    transaction.objectStore(PROFILE_STORE).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
