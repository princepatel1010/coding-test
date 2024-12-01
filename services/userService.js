const userDAO = require("../dao/userDAO");

/**
 * Get recently viewed products for a user
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
const getRecentlyViewedProducts = async (userId) => {
  const cachedRecentlyViewed = await userDAO.getRecentlyViewedFromCache(userId);

  if (cachedRecentlyViewed) {
    return cachedRecentlyViewed;
  }

  const recentlyViewed = await userDAO.getRecentlyViewedFromFirestore(userId);

  await userDAO.cacheRecentlyViewed(userId, recentlyViewed);
  return recentlyViewed;
};

/**
 * Log a product view for a user
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<void>}
 */
const logProductView = async (userId, productId) => {
  await userDAO.logProductView(userId, productId);
};

/**
 * Check if a product is viewed more than twice within a specific timeframe
 * @param {string} userId
 * @param {string} productId
 * @param {number} timeframeInHours
 * @returns {Promise<boolean>}
 */
const isProductViewedFrequently = async (
  userId,
  productId,
  timeframeInHours
) => {
  const viewsCount = await userDAO.getProductViewCount(
    userId,
    productId,
    timeframeInHours
  );

  return viewsCount > 2;
};

module.exports = {
  getRecentlyViewedProducts,
  logProductView,
  isProductViewedFrequently,
};
