import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { register, sendOTP, verifyOTP } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    aadharNumber: "",
    aadharCardImage: null as File | null,
    tradeLicenseNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, JPEG, or PNG file",
          variant: "destructive",
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        aadharCardImage: file
      }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      const success = await sendOTP(formData.email, 'registration');
      
      if (success) {
        setOtpSent(true);
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
      const success = await verifyOTP(formData.email, otpValue, 'registration');
      
      if (success) {
        toast({
          title: "OTP Verified",
          description: "Email verified successfully!",
        });
        setOtpSent(false);
        setOtpValue("");
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.aadharNumber || !formData.email || !formData.tradeLicenseNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.aadharCardImage) {
      toast({
        title: "Aadhar card image required",
        description: "Please upload your Aadhar card image",
        variant: "destructive",
      });
      return;
    }

    if (!otpSent) {
      toast({
        title: "Email verification required",
        description: "Please verify your email address with OTP first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        username: formData.name.toLowerCase().replace(/\s+/g, '_'),
        password: formData.aadharNumber.slice(-6), // Use last 6 digits as password
        first_name: formData.name,
        email: formData.email,
        role: 'seller',
        address: formData.address,
        aadhar_number: formData.aadharNumber,
        trade_license_number: formData.tradeLicenseNumber,
        aadhar_card_image: formData.aadharCardImage,
        otp_code: otpValue, // Include OTP for verification
      };

      const success = await register(userData);
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to VendorConnect!",
        });
        // Redirect to seller dashboard or shop
        navigate("/shop");
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="relative pb-6">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 h-8 w-8 p-0"
              onClick={() => navigate("/seller-login")}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center text-2xl font-bold text-green-800">
              Register as Seller
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Aadhar Number */}
              <div className="space-y-2">
                <Label htmlFor="aadharNumber" className="text-sm font-medium text-gray-700">
                  Aadhar Number
                </Label>
                <Input
                  id="aadharNumber"
                  name="aadharNumber"
                  type="text"
                  placeholder="Enter your Aadhar number"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  maxLength={12}
                  required
                />
              </div>

              {/* Email Address with OTP Verification */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 flex-1"
                    required
                    disabled={otpSent}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendOTP}
                    disabled={isSendingOtp || !formData.email}
                    className="border-gray-300 hover:border-green-500"
                  >
                    <Smartphone className="h-4 w-4 mr-1" />
                    {isSendingOtp ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </div>

              {/* OTP Verification */}
              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    OTP Code
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 flex-1"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleVerifyOTP}
                      disabled={isVerifyingOtp || !otpValue}
                      className="border-gray-300 hover:border-green-500"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Aadhar Card Image */}
              <div className="space-y-2">
                <Label htmlFor="aadharCardImage" className="text-sm font-medium text-gray-700">
                  Aadhar Card Image (jpg, jpeg, png, max 10MB)
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('aadharCardImage')?.click()}
                    className="border-gray-300 hover:border-green-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {formData.aadharCardImage ? formData.aadharCardImage.name : "No file chosen"}
                  </span>
                </div>
                <input
                  id="aadharCardImage"
                  name="aadharCardImage"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>

              {/* Trade License Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="tradeLicenseNumber" className="text-sm font-medium text-gray-700">
                  Trade License Registration No.
                </Label>
                <Input
                  id="tradeLicenseNumber"
                  name="tradeLicenseNumber"
                  type="text"
                  placeholder="Enter your trade license registration no."
                  value={formData.tradeLicenseNumber}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
                disabled={isLoading || !otpSent}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/seller-login" className="text-green-600 hover:text-green-700 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerRegistration; 