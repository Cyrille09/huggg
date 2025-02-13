import { Response } from "express";
import { errorHandler } from "../exceptions/errorHandler";
import brandService from "../services/brandService";
import { ERROR_MESSAGES } from "../constants/defaultValues";

export default {
  async getProductsByBrandId(req: any, res: Response): Promise<void> {
    try {
      const brand = await brandService.getProductsByBrandId(req.params.brandId);
      res.status(200).json(brand);
    } catch (error: unknown) {
      if (req.logger?.error) req.logger.error(`${ERROR_MESSAGES.BRAND_NOT_FOUND}`, error);
      errorHandler(res, error, 404);
    }
  },

  async getStoresByProductId(req: any, res: Response): Promise<void> {
    try {
      const stores = await brandService.getStoresByProductId(req.params.productId);
      res.status(200).json(stores);
    } catch (error: unknown) {
      if (req.logger?.error) req.logger.error(`${ERROR_MESSAGES.STORE_NOT_FOUND}`, error);
      errorHandler(res, error, 404);
    }
  },
};
