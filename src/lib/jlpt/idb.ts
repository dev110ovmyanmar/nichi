const DB_NAME = "nichi-n2"
const STORE = "kv"

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function idbGet<T>(key: string): Promise<T | null> {
  if (typeof indexedDB === "undefined") return null
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly")
      const request = tx.objectStore(STORE).get(key)
      request.onsuccess = () => resolve((request.result as T) ?? null)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

export async function idbSet(key: string, value: unknown) {
  if (typeof indexedDB === "undefined") return
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite")
      tx.objectStore(STORE).put(value, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    /* localStorage remains the live source */
  }
}
