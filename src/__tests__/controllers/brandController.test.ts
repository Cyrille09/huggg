import request from "supertest";
import express from "express";
import brandController from "../../controllers/brandController";
import brandService from "../../services/brandService";
import { ERROR_MESSAGES } from "../../constants/defaultValues";

jest.mock("../../services/brandService"); // Mock the service

const app = express();
app.use(express.json());

// Register routes for testing
app.get("/api/brands/:brandId/products", brandController.getProductsByBrandId);
app.get("/api/brands/products/:productId/stores", brandController.getStoresByProductId);

describe("brandController", () => {
  describe("getProductsByBrandId", () => {
    it("should return products when brand exists", async () => {
      const mockBrandId = "123";
      const mockProducts = [{ id: "1", name: "Product A" }];

      (brandService.getProductsByBrandId as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app).get(`/api/brands/${mockBrandId}/products`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(brandService.getProductsByBrandId).toHaveBeenCalledWith(mockBrandId);
    });

    it("should return 404 when brand is not found", async () => {
      const mockBrandId = "999";

      (brandService.getProductsByBrandId as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.BRAND_NOT_FOUND));

      const response = await request(app).get(`/api/brands/${mockBrandId}/products`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toEqual({ error: ERROR_MESSAGES.BRAND_NOT_FOUND, statusCode: 404 });
    });
  });

  describe("getStoresByProductId", () => {
    it("should return stores when product exists", async () => {
      const mockProductId = "456";
      const mockStores = [{ id: "1", name: "Store A" }];

      (brandService.getStoresByProductId as jest.Mock).mockResolvedValue(mockStores);

      const response = await request(app).get(`/api/brands/products/${mockProductId}/stores`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStores);
      expect(brandService.getStoresByProductId).toHaveBeenCalledWith(mockProductId);
    });

    it("should return 404 when product is not found", async () => {
      const mockProductId = "999";

      (brandService.getStoresByProductId as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.STORE_NOT_FOUND));

      const response = await request(app).get(`/api/brands/products/${mockProductId}/stores`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toEqual({ error: ERROR_MESSAGES.STORE_NOT_FOUND, statusCode: 404 });
    });
  });
});
