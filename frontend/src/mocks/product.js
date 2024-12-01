import { faker } from "@faker-js/faker";

const generateMockProducts = () => {
  const products = {};

  for (let i = 1; i <= 15; i++) {
    products[i] = {
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      stock: faker.number.int({ min: 0, max: 1000 }),
    };
  }

  return products;
};

const mockProducts = generateMockProducts();
export default mockProducts;
