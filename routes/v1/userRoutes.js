const express = require("express");
const { userController } = require("../../controllers");
const authMiddleware = require("../../middlewares/authMiddleware");
const validate = require("../../middlewares/validateParams");
const { userValidation } = require("../../validations");
const router = express.Router();

// Define versioned route for the API
// GET /api/v1/users/{userId}/recentlyViewed - Retrieve recently viewed products
router.get(
  "/:userId/recentlyViewed",
  authMiddleware,
  validate(userValidation.getRecentlyViewed),
  userController.getRecentlyViewed
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/v1/users/{userId}/recentlyViewed:
 *   get:
 *     summary: Retrieve recently viewed products for a user
 *     description: This endpoint retrieves a list of products that a user has recently viewed, including only product ID and timestamp of the view.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Specify the security scheme for Bearer Token
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose recently viewed products are to be retrieved.
 *     responses:
 *       "200":
 *         description: List of recently viewed products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: The ID of the product
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the product was viewed
 *             example:
 *               - productId: "123"
 *                 timestamp: "2024-12-01T12:00:00Z"
 *               - productId: "456"
 *                 timestamp: "2024-12-01T13:00:00Z"
 *       "400":
 *         description: Invalid user ID or request parameters
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: User not found
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     Unauthorized:
 *       description: The request requires user authentication.
 *     InternalError:
 *       description: An unexpected error occurred.
 */
