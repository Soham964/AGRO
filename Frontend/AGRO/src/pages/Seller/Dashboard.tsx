import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Truck, Shield, Clock, TrendingUp, Users, Store } from "lucide-react";

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <TrendingUp className="h-5 w-5" />, title: "Grow Sales", description: "Reach more buyers and boost your revenue."
    },
    {
      icon: <Store className="h-5 w-5" />, title: "Easy Product Management", description: "List, update, and manage your products easily."
    },
    {
      icon: <Shield className="h-5 w-5" />, title: "Verified Seller", description: "Build trust with buyers through verification."
    },
    {
      icon: <Truck className="h-5 w-5" />, title: "Efficient Delivery", description: "Seamless logistics for your orders."
    },
    {
      icon: <Users className="h-5 w-5" />, title: "Vendor Community", description: "Connect with other sellers and share insights."
    },
    {
      icon: <Clock className="h-5 w-5" />, title: "24/7 Dashboard", description: "Manage your business anytime, anywhere."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="space-y-8 text-center">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4 text-lg">Vendor Connect (Seller)</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">Welcome, Seller!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Manage your products, track your sales, and connect with buyers all in one place. List new products, view your inventory, and grow your business with Vendor Connect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" onClick={() => navigate("/seller/list-products")}>List a New Product</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/seller/my-products")}>View My Products</Button>
          </div>
          {/* Seller Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₹1.2L+</div>
              <div className="text-sm text-muted-foreground">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">120+</div>
              <div className="text-sm text-muted-foreground">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">Seller Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">350+</div>
              <div className="text-sm text-muted-foreground">Orders Fulfilled</div>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="bg-muted/30 py-10 rounded-xl mt-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Sell on Vendor Connect?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 text-center bg-background border border-border rounded-lg shadow-sm hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
