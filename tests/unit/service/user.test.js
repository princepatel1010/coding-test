const { userService } = require("../../../services");
const { db } = require("../../../config/firebase");

jest.mock("../../../config/firebase", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
}));

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return recently viewed products for a valid user", async () => {
    const mockUserId = "user123";
    const mockProducts = ["product1", "product2"];

    db.get.mockResolvedValue({
      exists: true,
      data: () => ({ recentlyViewedProducts: mockProducts }),
    });

    const result = await userService.getRecentlyViewedProducts(mockUserId);

    expect(db.collection).toHaveBeenCalledWith("users");
    expect(db.doc).toHaveBeenCalledWith(mockUserId);
    expect(db.get).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });

  it("should throw error if user not found", async () => {
    const mockUserId = "user123";

    db.get.mockResolvedValue({
      exists: false,
    });

    await expect(
      userService.getRecentlyViewedProducts(mockUserId)
    ).rejects.toThrow("User not found");
  });
});
