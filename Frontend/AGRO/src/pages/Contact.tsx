import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      details: "support@freshconnect.com",
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      details: "+91 98765 43210",
      subtitle: "Mon-Fri 9AM-6PM"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      details: "123 Farm Street, New Delhi",
      subtitle: "India 110001"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Support Hours",
      details: "24/7 Customer Support",
      subtitle: "Always here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our platform? Need help with your orders? 
            We're here to support both farmers and buyers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Input placeholder="What's this about?" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-card transition-shadow">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        <p className="text-foreground">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">How do I become a seller?</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on "Sell with Us" and fill out our simple registration form. 
                    We'll verify your details and get you started within 24 hours.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">What are the delivery charges?</h4>
                  <p className="text-sm text-muted-foreground">
                    Delivery charges vary by location and order value. 
                    Orders above ₹500 get free delivery within the city.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">How fresh are the products?</h4>
                  <p className="text-sm text-muted-foreground">
                    We work directly with farmers to ensure products are harvested 
                    and delivered within 24-48 hours for maximum freshness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;