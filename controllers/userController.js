const { status } = require("http-status");
const { userService } = require("../services");
const ApiError = require("../utils/ApiError");

const getRecentlyViewed = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const recentlyViewed = await userService.getRecentlyViewedProducts(userId);
    return res.status(status.OK).json({
      success: true,
      data: recentlyViewed,
    });
  } catch (error) {
    next(new ApiError(error.statusCode, error.message));
  }
};

module.exports = { getRecentlyViewed };
