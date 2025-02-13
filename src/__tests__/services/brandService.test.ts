import { ERROR_MESSAGES } from "../../constants/defaultValues";
import { getCacheKey, setCacheKey } from "../../redis/redis";

// Mock Redis functions
jest.mock("../../redis/redis", () => ({
  getCacheKey: jest.fn(),
  setCacheKey: jest.fn(),
}));

// Mock brands.json data before importing brandService
jest.doMock("fs", () => ({
  readFileSync: jest.fn(() =>
    JSON.stringify({
      data: [
        {
          id: "123",
          products: ["Product A", "Product B"],
          consolidated_products: [],
          stores: ["Store X", "Store Y"],
        },
        {
          id: "brand1",
          products: ["abc"],
          consolidated_products: ["def"],
          stores: ["Store X", "Store Y"],
        },
      ],
    })
  ),
}));

import brandService from "../../services/brandService";

describe("brandService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("getProductsByBrandId", () => {
    it("should return cached products if present in Redis", async () => {
      const mockBrandId = "123";
      const mockCachedProducts = { brandId: "123", products: ["Product A"] };

      (getCacheKey as jest.Mock).mockResolvedValue(mockCachedProducts);

      const result = await brandService.getProductsByBrandId(mockBrandId);

      expect(result).toEqual(mockCachedProducts);
      expect(getCacheKey).toHaveBeenCalledWith(expect.stringContaining(mockBrandId));
      expect(setCacheKey).not.toHaveBeenCalled();
    });

    it("should return products when brand exists", async () => {
      const mockBrandId = "123";
      const mockProducts = { brandId: "123", products: ["Product A", "Product B"] };

      (getCacheKey as jest.Mock).mockResolvedValue(null);

      const result = await brandService.getProductsByBrandId(mockBrandId);

      expect(result).toEqual(mockProducts);
      expect(setCacheKey).toHaveBeenCalledWith(expect.stringContaining(mockBrandId), mockProducts, expect.any(Number));
    });

    it("should return 404 error when brand is not found", async () => {
      const mockBrandId = "999";

      (getCacheKey as jest.Mock).mockResolvedValue(null);

      const result = await brandService.getProductsByBrandId(mockBrandId);

      expect(result).toEqual({ error: ERROR_MESSAGES.BRAND_NOT_FOUND, statusCode: 404 });
      expect(setCacheKey).not.toHaveBeenCalled();
    });
  });

  describe("getStoresByProductId", () => {
    it("should return cached stores if present in Redis", async () => {
      const mockProductId = "abc";
      const mockCachedStores = { productId: "abc", stores: ["Store X"] };

      (getCacheKey as jest.Mock).mockResolvedValue(mockCachedStores);

      const result = await brandService.getStoresByProductId(mockProductId);

      expect(result).toEqual(mockCachedStores);
      expect(getCacheKey).toHaveBeenCalledWith(expect.stringContaining(mockProductId));
      expect(setCacheKey).not.toHaveBeenCalled();
    });

    it("should return stores when product exists", async () => {
      const mockProductId = "abc";
      const expectedStores = { productId: "abc", stores: ["Store X", "Store Y"] };

      (getCacheKey as jest.Mock).mockResolvedValue(null);

      const result = await brandService.getStoresByProductId(mockProductId);

      expect(result).toEqual(expectedStores);
      expect(setCacheKey).toHaveBeenCalledWith(
        expect.stringContaining(mockProductId),
        expectedStores,
        expect.any(Number)
      );
    });

    it("should return 404 error when stores are not found", async () => {
      const mockProductId = "xyz";

      (getCacheKey as jest.Mock).mockResolvedValue(null);

      const result = await brandService.getStoresByProductId(mockProductId);

      expect(result).toEqual({ error: ERROR_MESSAGES.STORE_NOT_FOUND, statusCode: 404 });
      expect(setCacheKey).not.toHaveBeenCalled();
    });
  });
});
