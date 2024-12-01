const { db, adminAuth } = require("./config/firebase");
const admin = require("firebase-admin");

async function createUserAndSeedData() {
  try {
    const email = "test@email.com";
    const password = "Test@123";

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      console.log("User already exists with ID:", userRecord.uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({
          email,
          password,
        });
        console.log("User created successfully with ID:", userRecord.uid);
      } else {
        throw error;
      }
    }

    const userId = userRecord.uid;
    const recentlyViewedRef = db.collection(`users/${userId}/recentlyViewed`);

    const snapshot = await recentlyViewedRef.get();
    if (snapshot.empty) {
      for (let i = 1; i <= 10; i++) {
        const productRef = recentlyViewedRef.doc(i.toString());
        await productRef.set({
          productId: i.toString(),
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      console.log(
        "10 product IDs added to the 'recentlyViewed' subcollection."
      );
    } else {
      console.log("Data already exists in 'recentlyViewed'. Skipping seed.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating user or adding data:", error);
    process.exit(1);
  }
}

createUserAndSeedData();
