import * as admin from "firebase-admin";
admin.initializeApp();

import * as functions from "firebase-functions";
import fetch from "node-fetch";

interface UrlDictionary {
  [key: string]: string;
}

// Trigger using pubsub every 2 hours
export const cacheData = functions.pubsub
  .schedule("every 2 hours")
  .onRun(async (_context) => {
    await cacheUrls();
  });

// Trigger manually using the cloud-cache/config document
export const manuallyTriggerCache = functions.firestore
  .document("cloud-cache/config")
  .onUpdate(async (change, context) => {
    const manualTrigger = change.after.get("manualTrigger") as boolean;
    if (manualTrigger) {
      await cacheUrls();
      await change.after.ref.update({
        manualTrigger: false,
      });
    }
  });

/**
 * Cache the data from the URLs in the cloud-cache/config document.
 */
async function cacheUrls() {
  const db = admin.firestore();
  const docRef = db.collection("cloud-cache").doc("config");
  const doc = await docRef.get();
  const cacheUrls = doc.get("cacheUrls") as UrlDictionary;

  const promises = Object.entries(cacheUrls).map(async ([key, url]) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const fileRef = admin.storage().bucket().file(key);
    await fileRef.save(Buffer.from(arrayBuffer), {
      contentType: response.headers.get("content-type") || undefined,
    });
    await fileRef.makePublic();
    return key;
  });

  const fileNames = await Promise.all(promises);
  console.log(`Cached files: ${fileNames.join(", ")}`);
}
