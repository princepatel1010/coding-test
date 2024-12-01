import { useEffect, useState } from "react";
import auth from "../config/firebase";
import mockProducts from "../mocks/product";
import { Link } from "react-router-dom";

export default function Profile() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());
        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await fetch(
          `${backendUrl}/api/v1/users/${user.uid}/recentlyViewed`,
          payloadHeader
        );
        const data = await res.json();
        setRecentlyViewed(data.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!recentlyViewed) {
    return <div className="text-center">No data found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-center">
        Recently Viewed Products
      </h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentlyViewed.map((item) => {
          const product = mockProducts[item.productId];
          return (
            <Link
              key={item.productId}
              to={`/product/${item.productId}`}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">
                {product.productName}
              </h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="text-sm text-gray-700 mt-2">${product.price}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
