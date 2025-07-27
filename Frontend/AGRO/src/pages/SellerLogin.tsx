import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sprout, TrendingUp, Shield, Globe } from "lucide-react";

const SellerLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Login Form */}
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Farmer Login</CardTitle>
              <p className="text-muted-foreground">Sell your fresh produce directly to buyers</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input type="password" placeholder="Enter your password" />
                </div>
              </div>

              <Button className="w-full" size="lg">
                Login to Dashboard
              </Button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <Separator />

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">New to FreshConnect?</p>
                <Button variant="outline" className="w-full" size="lg">
                  Register as Farmer
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Looking to buy? <Link to="/buyer-login" className="text-primary hover:underline">Buyer login</Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
                🌱 For Farmers & Producers
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Grow Your Business with FreshConnect
              </h2>
              <p className="text-muted-foreground">
                Join thousands of farmers who are selling directly to buyers 
                and getting better prices for their quality produce.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Better Prices</h3>
                  <p className="text-muted-foreground">
                    Sell directly to buyers and eliminate middlemen. 
                    Get up to 30% better prices for your produce.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Wider Reach</h3>
                  <p className="text-muted-foreground">
                    Connect with buyers from different cities and regions. 
                    Expand your market beyond local boundaries.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground">
                    Get paid quickly and securely through our platform. 
                    No more waiting for payments or dealing with bad debt.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Easy Management</h3>
                  <p className="text-muted-foreground">
                    Simple dashboard to manage your products, orders, and inventory. 
                    Focus on farming, we handle the tech.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-3">Success Stats:</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Active Farmers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">₹50L+</div>
                  <div className="text-sm text-muted-foreground">Monthly Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;