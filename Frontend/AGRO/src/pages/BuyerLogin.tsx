import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Users, Truck, Sprout, TrendingUp, Shield, Globe, Smartphone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BuyerLogin = () => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>("buyer");
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  const { loginWithOTP, sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/shop");
    return null;
  }

  const handleSendOTP = async () => {
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please enter both name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      const success = await sendOTP(email, 'login');
      
      if (success) {
        setShowOtpPage(true);
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your email address.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpValue) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // First verify the OTP
      const otpVerified = await verifyOTP(email, otpValue, 'login');

      if (otpVerified) {
        // Then login with OTP
        const result = await loginWithOTP(email, otpValue);

        if (result) {
          toast({
            title: "Login successful!",
            description: "Welcome back!",
          });
          // Redirect to shop
          navigate("/shop");
        } else {
          toast({
            title: "Login failed",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleBackToLogin = () => {
    setShowOtpPage(false);
    setOtpValue("");
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
              {!showOtpPage ? (
                // Login Form with Name and Phone
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="h-11" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="h-11" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-11 text-base font-semibold" 
                    size="lg" 
                    onClick={handleSendOTP}
                    disabled={isSendingOtp}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              ) : (
                // OTP Verification Page
                <div className="space-y-5">
                  <div className="text-center mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToLogin}
                      className="mb-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Enter OTP
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a 6-digit code to {email}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">OTP Code</label>
                    <Input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      className="h-11 text-center text-lg tracking-widest" 
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  
                  <Button 
                    className="w-full h-11 text-base font-semibold" 
                    size="lg" 
                    onClick={handleVerifyOTP}
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleSendOTP}
                      disabled={isSendingOtp}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
              )}

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
    </div>
  );
};

export default BuyerLogin;