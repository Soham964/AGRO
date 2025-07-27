import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Users, Truck, Sprout, TrendingUp, Shield, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BuyerLogin = () => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>("buyer");
  const [showBuyerRegister, setShowBuyerRegister] = useState(false);
  const [showSellerRegister, setShowSellerRegister] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  
  // Form states for login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Form states for registration
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    role: "buyer" as "buyer" | "seller",
    phone: "",
    location: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/shop");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        navigate("/shop");
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirm_password) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const success = await register(registerData);
      if (success) {
        toast({
          title: "Success",
          description: "Registration successful!",
        });
        navigate("/shop");
      } else {
        toast({
          title: "Error",
          description: "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Login Form with Tabs */}
          <Card className="shadow-card px-0 py-0 md:px-0 md:py-0">
            {/* Tabs for Buyer/Seller */}
            <div className="flex justify-center gap-2 pt-8 pb-2 md:pt-10 md:pb-4">
              <Button
                variant={activeTab === 'buyer' ? 'default' : 'outline'}
                size="sm"
                className="w-32"
                onClick={() => setActiveTab('buyer')}
              >
                Buyer Login
              </Button>
              <Button
                variant={activeTab === 'seller' ? 'default' : 'outline'}
                size="sm"
                className="w-32"
                onClick={() => setActiveTab('seller')}
              >
                Seller Login
              </Button>
            </div>
            <CardHeader className="text-center px-6 md:px-10 pt-2 pb-0">
              <CardTitle className="text-2xl text-foreground mb-1">{activeTab === 'buyer' ? 'Buyer Login' : 'Seller Login'}</CardTitle>
              <p className="text-muted-foreground text-base">
                {activeTab === 'buyer' ? 'Access fresh produce from local farmers' : 'Sell your fresh produce directly to buyers'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-6 md:px-10 pb-8 pt-2">
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <Input 
                    type="text" 
                    placeholder="Enter your username" 
                    className="h-11" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="h-11" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full h-11 text-base font-semibold" 
                  size="lg" 
                  type="submit"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center pt-4">
                  <span className="text-sm text-muted-foreground">New user?</span>
                  {activeTab === 'buyer' ? (
                    <Link 
                      to="/buyer-registration"
                      className="ml-2 text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Register as Buyer
                    </Link>
                  ) : (
                    <Link 
                      to="/seller-registration"
                      className="ml-2 text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Register as Seller
                    </Link>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-8">
            {activeTab === 'buyer' ? (
              <>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
                  🛒 For Buyers & Vendors
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Why Buy from VendorConnect?
                </h2>
                <p className="text-muted-foreground">
                  Connect directly with local farmers and get the freshest produce 
                  at wholesale prices. Perfect for vendors, restaurants, and bulk buyers.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Wholesale Pricing</h3>
                      <p className="text-muted-foreground">
                        Get better prices by buying directly from farmers. 
                        No middlemen, better margins for your business.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Bulk Orders</h3>
                      <p className="text-muted-foreground">
                        Order in bulk quantities perfect for shops, restaurants, 
                        and commercial kitchens. Flexible delivery options.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Verified Suppliers</h3>
                      <p className="text-muted-foreground">
                        All our farmers are verified and committed to quality. 
                        Build lasting relationships with reliable suppliers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Perfect for:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Retail Shops</Badge>
                    <Badge variant="secondary">Restaurants</Badge>
                    <Badge variant="secondary">Hotels</Badge>
                    <Badge variant="secondary">Caterers</Badge>
                    <Badge variant="secondary">Wholesalers</Badge>
                    <Badge variant="secondary">Institutions</Badge>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
                  🌱 For Farmers & Producers
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Grow Your Business with VendorConnect
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of farmers who are selling directly to buyers 
                  and getting better prices for their quality produce.
                </p>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal for Buyer */}
      {showBuyerRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <button className="absolute top-3 right-3 text-xl" onClick={() => setShowBuyerRegister(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Register as Buyer</h2>
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input 
                  type="text" 
                  placeholder="Enter your username" 
                  className="h-11" 
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="h-11" 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter your first name" 
                  className="h-11" 
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter your last name" 
                  className="h-11" 
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  type="text" 
                  placeholder="Enter your phone number" 
                  className="h-11" 
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  type="text" 
                  placeholder="Enter your location" 
                  className="h-11" 
                  value={registerData.location}
                  onChange={(e) => setRegisterData({...registerData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="h-11" 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="h-11" 
                  value={registerData.confirm_password}
                  onChange={(e) => setRegisterData({...registerData, confirm_password: e.target.value})}
                  required
                />
              </div>
              <Button 
                className="w-full h-11 text-base font-semibold" 
                size="lg" 
                type="submit"
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal for Seller */}
      {showSellerRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <button className="absolute top-3 right-3 text-xl" onClick={() => setShowSellerRegister(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Register as Seller</h2>
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input 
                  type="text" 
                  placeholder="Enter your username" 
                  className="h-11" 
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value, role: 'seller'})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="h-11" 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter your first name" 
                  className="h-11" 
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter your last name" 
                  className="h-11" 
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  type="text" 
                  placeholder="Enter your phone number" 
                  className="h-11" 
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  type="text" 
                  placeholder="Enter your location" 
                  className="h-11" 
                  value={registerData.location}
                  onChange={(e) => setRegisterData({...registerData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="h-11" 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="h-11" 
                  value={registerData.confirm_password}
                  onChange={(e) => setRegisterData({...registerData, confirm_password: e.target.value})}
                  required
                />
              </div>
              <Button 
                className="w-full h-11 text-base font-semibold" 
                size="lg" 
                type="submit"
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerLogin;