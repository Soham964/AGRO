import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Product, Order } from "@/services/api";

const MyProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderCounts, setOrderCounts] = useState<{ [productId: number]: number }>({});

  useEffect(() => {
    const fetchProductsAndOrders = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all products and filter by current user (seller)
        const res = await apiService.getProducts();
        let sellerProducts: Product[] = [];
        if (user) {
          sellerProducts = res.results.filter((p: Product) => p.supplier_name === user.username);
          setProducts(sellerProducts);
        } else {
          setProducts([]);
        }
        // Fetch all orders for this seller
        if (user) {
          const orders: Order[] = await apiService.getOrders();
          // Count orders for each product
          const counts: { [productId: number]: number } = {};
          for (const product of sellerProducts) {
            counts[product.id] = 0;
          }
          for (const order of orders) {
            if (order.seller_name === user.username) {
              for (const item of order.items) {
                if (counts.hasOwnProperty(item.product.id)) {
                  counts[item.product.id] += item.quantity;
                }
              }
            }
          }
          setOrderCounts(counts);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndOrders();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-8 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 relative">
        <h2 className="text-3xl font-bold text-green-800 mb-2 text-center">
          Welcome{user ? `, ${user.first_name || user.username}` : ""}!
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8">Here are the products you have listed.</p>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No products listed yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg border" />
                  <div>
                    <div className="font-semibold text-lg text-green-900">{product.name}</div>
                    <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                    <div className="text-base font-medium">₹{product.price}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">{product.description}</div>
                <div className="flex gap-2 mt-2 items-center">
                  <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1">{product.in_stock ? "In Stock" : "Out of Stock"}</span>
                  <span className="text-xs bg-gray-100 text-gray-800 rounded px-2 py-1">{product.unit}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
                    Orders: {orderCounts[product.id] ?? 0}
                  </span>
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => alert(`Show reviews for ${product.name}`)}>
                    View Reviews
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
