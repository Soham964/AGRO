import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const Register = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("type") === "seller" ? "seller" : "buyer";
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>(initialTab);
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      e.target.value = '';
      setAadharFile(null);
    } else {
      setAadharFile(file || null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-card">
          <div className="flex justify-center gap-2 pt-8 pb-2">
            <Button variant={activeTab === 'buyer' ? 'default' : 'outline'} size="sm" className="w-32" onClick={() => setActiveTab('buyer')}>Register as Buyer</Button>
            <Button variant={activeTab === 'seller' ? 'default' : 'outline'} size="sm" className="w-32" onClick={() => setActiveTab('seller')}>Register as Seller</Button>
          </div>
          <CardHeader className="text-center px-6 md:px-10 pt-2 pb-0">
            <CardTitle className="text-2xl text-foreground mb-1">{activeTab === 'buyer' ? 'Register as Buyer' : 'Register as Seller'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-10 pb-8 pt-2">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input type="text" placeholder="Enter your name" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input type="text" placeholder="Enter your address" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aadhar Number</label>
                <Input type="text" placeholder="Enter your Aadhar number" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aadhar Card Image (jpg, jpeg, png, max 10MB)</label>
                <input type="file" accept=".jpg,.jpeg,.png" className="block w-full text-sm text-muted-foreground border border-border rounded-lg cursor-pointer bg-muted/50 focus:outline-none" onChange={handleFileChange} />
              </div>
              {activeTab === 'seller' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Trade License Registration No.</label>
                  <Input type="text" placeholder="Enter your trade license registration no." className="h-11" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input type="text" placeholder="Enter your phone number" className="h-11" />
              </div>
              <Button className="w-full h-11 text-base font-semibold" size="lg">Register</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
