import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Shield, Clock } from "lucide-react";
import heroProduceImage from "@/assets/hero-produce.jpg";
import farmingCommunityImage from "@/assets/farming-community.jpg";

const Hero = () => {
  const features = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Bulk Delivery",
      description: "Raw materials delivered to your street food stall"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Verified Suppliers",
      description: "Trusted vendors with quality certifications"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Fresh Stock",
      description: "Regular supply to keep your business running"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                🍛 Trusted Raw Materials for Street Food
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Reliable Suppliers for
                <span className="text-primary block">Street Food Vendors</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Quality spices, oils, flour, and fresh ingredients from verified suppliers. 
                Build trust, save costs, and ensure consistent quality for your food business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="/buyer-login">
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">300+</div>
                <div className="text-sm text-muted-foreground">Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1500+</div>
                <div className="text-sm text-muted-foreground">Street Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <img
                src={heroProduceImage}
                alt="Fresh produce from local farms"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <Card className="absolute bottom-4 left-4 right-4 p-4 bg-background/95 backdrop-blur-sm border-border shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-semibold">4.9</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Trusted by thousands</div>
                  <div className="text-sm text-muted-foreground">⭐⭐⭐⭐⭐ (2,450 reviews)</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-card transition-shadow bg-background border-border">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <img
                src={farmingCommunityImage}
                alt="Local farming community"
                className="w-full h-[350px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
                  🍛 Building Trust in Food Business
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Empowering Street Food Vendors
                </h2>
                <p className="text-muted-foreground">
                  We connect street food vendors with reliable suppliers for quality raw materials. 
                  Build trust, reduce costs, and ensure consistent supply for your food business 
                  while supporting local vendor communities.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Verified Supplier Network</div>
                    <div className="text-sm text-muted-foreground">Quality-checked vendors with trust ratings</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Bulk Pricing Benefits</div>
                    <div className="text-sm text-muted-foreground">Lower costs through group purchasing power</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Local Supply Chains</div>
                    <div className="text-sm text-muted-foreground">Faster delivery and fresher ingredients</div>
                  </div>
                </div>
              </div>
              
              <Button variant="default" size="lg" className="mt-6">
                Learn More About Our Farmers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;