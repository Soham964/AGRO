import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BuyerRegistration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    aadharNumber: "",
    aadharCardImage: null as File | null,
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.aadharNumber || !formData.phoneNumber) {
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

    setIsLoading(true);
    
    try {
      const userData = {
        username: formData.name.toLowerCase().replace(/\s+/g, '_'),
        password: formData.aadharNumber.slice(-6), // Use last 6 digits as password
        first_name: formData.name,
        email: `${formData.name.toLowerCase().replace(/\s+/g, '_')}@example.com`,
        role: 'buyer',
        address: formData.address,
        aadhar_number: formData.aadharNumber,
        phone_number: formData.phoneNumber,
        aadhar_card_image: formData.aadharCardImage,
      };

      const success = await register(userData);
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to VendorConnect",
        });
        navigate("/shop");
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again",
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
              onClick={() => navigate("/buyer-login")}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center text-2xl font-bold text-green-800">
              Register as Buyer
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

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/buyer-login" className="text-green-600 hover:text-green-700 font-medium">
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

export default BuyerRegistration; 