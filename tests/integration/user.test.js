const request = require("supertest");
const express = require("express");
const { userController } = require("../../controllers");
const { db } = require("../../config/firebase");

jest.mock("firebase-admin", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "mockUid" }),
  }),
}));

jest.mock("../../config/firebase", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/v1", userController);

describe("User Controller Integration Tests", () => {
  it("should get recently viewed products for a user", async () => {
    const mockUserId = "user123";
    const mockProducts = ["product1", "product2"];

    db.get.mockResolvedValue({
      exists: true,
      data: () => ({ recentlyViewedProducts: mockProducts }),
    });

    const response = await request(app)
      .get(`/api/v1/users/${mockUserId}/recentlyViewed`)
      .set("Authorization", "Bearer valid-jwt-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
  });

  it("should return 500 if there is an error", async () => {
    const mockUserId = "user123";

    db.get.mockResolvedValue({
      exists: false,
    });

    const response = await request(app)
      .get(`/api/v1/users/${mockUserId}/recentlyViewed`)
      .set("Authorization", "Bearer valid-jwt-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return 401 if token is invalid", async () => {
    const response = await request(app)
      .get("/api/v1/users/user123/recentlyViewed")
      .set("Authorization", "Bearer invalid-jwt-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid or expired token" });
  });
});
