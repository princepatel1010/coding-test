const Joi = require("joi");

const getRecentlyViewed = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = { getRecentlyViewed };
