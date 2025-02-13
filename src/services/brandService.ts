import fs from "fs";
import path from "path";
import { ERROR_MESSAGES } from "../constants/defaultValues";
import { getCacheKey, setCacheKey } from "../redis/redis";

type Brand = {
  id: string;
  products: string[];
  consolidated_products: string[];
  stores: string[];
};

type BrandsData = {
  data: Brand[];
};

// Load and parse JSON data
const brandsData: BrandsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../brands.json`), "utf-8"));

export default {
  async getProductsByBrandId(brandId: string) {
    const redisKey = `${process.env.PRODUCTS_REDIS_KEY}-${brandId}`;
    const redisExpiry = parseInt(`${process.env.REDIS_EXPIRY_TIME}`);

    const cachedHotel = await getCacheKey(redisKey);
    if (cachedHotel) return cachedHotel;

    const brand: any = brandsData.data.find((b) => b.id === brandId);

    if (!brand) return { error: ERROR_MESSAGES.BRAND_NOT_FOUND, statusCode: 404 };

    const products = [...brand.products, ...brand.consolidated_products];
    const productsWithBrandId = { brandId, products };

    setCacheKey(redisKey, productsWithBrandId, redisExpiry);

    return productsWithBrandId;
  },

  async getStoresByProductId(productId: string) {
    const redisKey = `${process.env.STORES_REDIS_KEY}-${productId}`;
    const redisExpiry = parseInt(`${process.env.REDIS_EXPIRY_TIME}`);

    const cachedHotel = await getCacheKey(redisKey);
    if (cachedHotel) return cachedHotel;

    let stores: string[] = [];

    brandsData.data.forEach((brand) => {
      if (brand.products.includes(productId) || brand.consolidated_products.includes(productId)) {
        stores = [...stores, ...brand.stores];
      }
    });

    if (!stores.length) return { error: ERROR_MESSAGES.STORE_NOT_FOUND, statusCode: 404 };

    const storesWithProductId = { productId, stores };
    setCacheKey(redisKey, storesWithProductId, redisExpiry);

    return storesWithProductId;
  },
};
