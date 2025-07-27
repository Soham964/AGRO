import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Leaf,
  LogOut,
  UserCircle,
  Package,
  Settings,
  CreditCard,
  MapPin,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "Order Delivered",
    description: "Your order ORD-001 has been delivered.",
    icon: <Bell className="h-4 w-4 text-green-600" />,
    time: "2h ago"
  },
  {
    id: 2,
    title: "Order Shipped",
    description: "Your order ORD-002 is on the way!",
    icon: <Bell className="h-4 w-4 text-blue-600" />,
    time: "1d ago"
  },
  {
    id: 3,
    title: "New Offer",
    description: "Get 10% off on your next purchase!",
    icon: <Bell className="h-4 w-4 text-yellow-600" />,
    time: "3d ago"
  }
];

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
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {mockNotifications.length}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0">
                    <DropdownMenuLabel className="p-4 pb-2 text-base font-semibold">Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockNotifications.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground text-sm">
                        No new notifications
                      </div>
                    ) : (
                      mockNotifications.map((notif) => (
                        <DropdownMenuItem key={notif.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50">
                          <div className="mt-1">{notif.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{notif.title}</div>
                            <div className="text-xs text-muted-foreground">{notif.description}</div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 mt-1">{notif.time}</div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dashboard Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <UserCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {user?.first_name || user?.username}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/addresses" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Delivery Addresses</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/payments" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Payment Methods</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications (3)
                </Button>

                {/* Profile Menu */}
                <div className="space-y-2">
                  <div className="px-2 py-1 text-sm font-medium text-foreground">
                    {user?.first_name} {user?.last_name}
                  </div>

                  <Button variant="ghost" size="sm" className="justify-start w-full" asChild>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" className="justify-start w-full" asChild>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" className="justify-start w-full" asChild>
                    <Link to="/addresses" onClick={() => setIsMenuOpen(false)}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Delivery Addresses
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" className="justify-start w-full" asChild>
                    <Link to="/payments" onClick={() => setIsMenuOpen(false)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" className="justify-start w-full" asChild>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start w-full text-red-600"
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