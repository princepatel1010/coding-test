import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../mocks/product";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchedProduct = mockProducts[productId];
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="text-center text-xl font-semibold">Product not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2 p-6">
            <img
              src={product.image}
              alt={product.productName}
              className="w-96 h-96 object-cover rounded-lg"
            />
          </div>
          <div className="lg:w-1/2 p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-semibold text-gray-900">
              {product.productName}
            </h1>
            <p className="text-xl text-gray-700 mt-2">${product.price}</p>
            <p className="text-sm text-gray-500 mt-4">{product.description}</p>

            <div className="mt-6">
              <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Product Details
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Category:</strong> {product.category}
            </li>
            <li>
              <strong>Brand:</strong> {product.brand}
            </li>
            <li>
              <strong>Stock:</strong> {product.stock}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
