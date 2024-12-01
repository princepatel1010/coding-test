const { db } = require("../config/firebase");
const { RECENTLY_VIEWED_NAMESPACE } = require("../constants");
const CacheManager = require("../utils/CacheManager");

/**
 * Get recently viewed products from Redis cache.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>|null>} - The list of recently viewed products or null if not cached.
 */
const getRecentlyViewedFromCache = async (userId) => {
  return CacheManager.get(RECENTLY_VIEWED_NAMESPACE, userId);
};

/**
 * Get recently viewed products from Firestore.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} - The list of recently viewed products from Firestore.
 */
const getRecentlyViewedFromFirestore = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const recentlyViewedRef = userRef.collection("recentlyViewed");

  const snapshot = await recentlyViewedRef
    .orderBy("timestamp", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map((doc) => ({
    productId: doc.id,
    timestamp: doc.data().timestamp.toDate(),
  }));
};

/**
 * Cache recently viewed products in Redis.
 * @param {string} userId - The ID of the user.
 * @param {Array<Object>} recentlyViewed - The list of recently viewed products to cache.
 * @returns {Promise<void>} - Resolves when caching is successful.
 */
const cacheRecentlyViewed = async (userId, recentlyViewed) => {
  await CacheManager.set(RECENTLY_VIEWED_NAMESPACE, userId, recentlyViewed);
};

/**
 * Get the view count of a product within a specific timeframe
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product
 * @param {number} timeframeInHours - Timeframe in hours to check for views
 * @returns {Promise<number>} - The number of views within the specified timeframe
 */
const getProductViewCount = async (userId, productId, timeframeInHours) => {
  const userRef = db.collection("users").doc(userId);
  const recentlyViewedRef = userRef.collection("recentlyViewed");

  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - timeframeInHours);

  const snapshot = await recentlyViewedRef
    .where("productId", "==", productId)
    .where("timestamp", ">=", cutoff)
    .get();

  return snapshot.size;
};

module.exports = {
  getRecentlyViewedFromCache,
  getRecentlyViewedFromFirestore,
  cacheRecentlyViewed,
  getProductViewCount,
};
