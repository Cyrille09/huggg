# Engineer Tech Test

Thank you for reviewing my submission for the Engineer Tech Test. This document provides an overview of the task, implementation details, and additional improvements I made.

## Task Overview

This project is a mock service designed to provide discrete pieces of information about brands, products, and stores via HTTP GET endpoints. The service is built to handle potentially large datasets and includes features to ensure scalability, performance, and maintainability. The implementation uses modern tools and best practices to meet the requirements outlined in the task. The service supports the following operations:

## Features and Endpoints

- Get all products for a brand by brand-id: `http://localhost:3000/api/brands/:brandId/products`

  - This endpoint retrieves all product entities associated with a specific brand, including "consolidated" products. Consolidated products are those that belong to multiple brands and stores, in addition to their "true" parent brand.
  - Sample result:

```json
{
  "brandId": "5a4e6d14-53d4-4583-bd6b-49f81b021d24",
  "products": ["5a3fe6f7-7796-44ca-84fe-70d4f751527d"]
}
```

- Get all stores for a product by product-id: `http://localhost:3000/api/brands/products/:productId/stores`

  - This endpoint retrieves all store entities where a specific product is available.
  - Sample result:

```json
{
  "productId": "5a3fe6f7-7796-44ca-84fe-70d4f751527d",
  "stores": [
    "15af2cdc-f352-11e8-80cd-02e611b48058",
    "15af31b3-f352-11e8-80cd-02e611b48058",
    "15af328f-f352-11e8-80cd-02e611b48058",
    "15af3342-f352-11e8-80cd-02e611b48058",
    "15af340c-f352-11e8-80cd-02e611b48058"
  ]
}
```

## Implementation Details

### Technologies Used

- **TypeScript**: Ensures type safety and improves code maintainability.
- **Express.js**: A powerful and flexible web framework that makes it easy to build fast and scalable web applications and APIs.
- **Redis**: Used for caching to improve performance and reduce database load.
- **Winston**: A logging library for structured and consistent logging.
- **Jest**: A testing framework for writing and running unit tests.
- **Docker**: Used to containerize the application for easy deployment and scalability.
- **GitHub Actions**: Implements a CI/CD pipeline for automated testing, building, and deployment.
- **Rate-limit**: A restriction on how often a request can be performed within a set time frame.

## Additional Features & Improvements

- **Caching with Redis**

  - Redis is used to cache responses to improve performance.
  - Cached data reduces repeated storage calls for frequently accessed data.

- **Logging with Winston**

  - Implemented structured logging for debugging and monitoring.
  - Logs include request details, errors, and system events.

- **Rate Limiting**

  - Used the rate-limit middleware to prevent abuse and ensure fair usage.

- **Dockerization**

  - Created a Dockerfile to containerize the application.
  - Simplifies deployment and ensures consistent environments.

- **Unit Testing with Jest**

  - Wrote unit tests to ensure API correctness and reliability.
  - Tested API responses and edge cases.

- **CI/CD Pipeline with GitHub Actions**

  - Automated build and test process.
  - Ensures code quality and prevents breaking changes before deployment.

## How to Run the Application

### Prerequisites

- Node.js and npm installed.
- Docker installed (if running in a containerized environment).
- Redis installed and running (or use a Dockerized Redis instance).

### Running Locally

- Clone the repository:
  `git clone https://github.com/Cyrille09/huggg.git` and then `cd huggg`

- Create `.env` file in the root directory and add the below info

```PORT=3000
HOST=http://localhost
NODE_ENV=dev

# redis
REDIS_URL=redis://localhost:6379
REDIS_EXPIRY_TIME= 3600
PRODUCTS_REDIS_KEY=products
STORES_REDIS_KEY=stores
```

- Install dependencies:
  `npm install`

- Start the Redis server (if not already running):
  `redis-server`

- Run the server:
  `npm run run:dev`

### Running with Docker

- Build the application to setup **dist/app.js** directory:
  `npm run build`

- Build the Docker image and run the Docker container:
  `docker-compose up --build`

- Access the endpoints at `http://localhost:3000`

### Running Tests

- To run the unit tests, use the following command:
  `npm test`

## Conclusion

This project demonstrates a scalable and maintainable approach to building a mock service for handling large datasets. By leveraging modern tools like TypeScript, Redis, and Docker, the service is optimised for performance and reliability. Automated testing and a CI/CD pipeline ensure that the application is robust and ready for production use.
If I had extra time, I would enhance the system further by implementing:

- **API documentation with Swagger** to improve usability and make the service easier to integrate.
- **Better observability** by integrating monitoring tools like Prometheus for real-time analytics.
