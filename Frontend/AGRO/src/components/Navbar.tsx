import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Leaf,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">VendorConnect</span>
          </Link>

          {/* Search Bar - Desktop - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search raw materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center space-x-3">
                {/* Cart Icon - Only show when authenticated */}
                <Button variant="ghost" size="sm" className="relative" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Hi, {user?.first_name || user?.username}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Login Button - Only show when NOT authenticated */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/buyer-login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button - Only show when authenticated */}
          {isAuthenticated && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {/* Mobile Login Button - Only show when NOT authenticated */}
          {!isAuthenticated && (
            <div className="md:hidden">
              <Button variant="outline" size="sm" asChild>
                <Link to="/buyer-login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Search - Only show when authenticated */}
        {isAuthenticated && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search raw materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation - Only show when authenticated */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col space-y-2 pt-2">
                {/* Cart */}
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart ({cartItemCount})
                  </Link>
                </Button>
                
                {/* User Menu */}
                <div className="space-y-2">
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Hi, {user?.first_name || user?.username}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;