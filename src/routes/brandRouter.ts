import { Router } from "express";
const router = Router();
import brandController from "../controllers/brandController";

router.get("/:brandId/products", brandController.getProductsByBrandId);
router.get("/products/:productId/stores", brandController.getStoresByProductId);

export default router;
