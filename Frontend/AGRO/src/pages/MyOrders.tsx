import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Star,
  MessageCircle,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock order data - in real app, this would come from API
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1250.00,
    items: [
      { name: "Fresh Tomatoes", quantity: 2, price: 80.00, image: "🍅" },
      { name: "Organic Carrots", quantity: 1, price: 60.00, image: "🥕" },
      { name: "Green Bell Peppers", quantity: 3, price: 120.00, image: "🫑" }
    ],
    deliveryAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18",
    actualDelivery: "2024-01-17"
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 890.00,
    items: [
      { name: "Fresh Spinach", quantity: 2, price: 40.00, image: "🥬" },
      { name: "Sweet Corn", quantity: 4, price: 100.00, image: "🌽" },
      { name: "Cucumber", quantity: 2, price: 30.00, image: "🥒" }
    ],
    deliveryAddress: "456 Oak Avenue, Building 7, Delhi, Delhi 110001",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-13"
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 650.00,
    items: [
      { name: "Fresh Onions", quantity: 3, price: 90.00, image: "🧅" },
      { name: "Potatoes", quantity: 2, price: 80.00, image: "🥔" }
    ],
    deliveryAddress: "789 Pine Street, Flat 12, Bangalore, Karnataka 560001",
    estimatedDelivery: "2024-01-08"
  },
  {
    id: "ORD-004",
    date: "2023-12-28",
    status: "cancelled",
    total: 450.00,
    items: [
      { name: "Fresh Garlic", quantity: 1, price: 50.00, image: "🧄" },
      { name: "Ginger", quantity: 2, price: 60.00, image: "🫚" }
    ],
    deliveryAddress: "321 Elm Road, House 5, Chennai, Tamil Nadu 600001",
    cancellationReason: "Out of stock"
  }
];

const MyOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Functional handlers
  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowOrderDetails(true);
  };

  const handleRateOrder = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowRatingDialog(true);
  };

  const handleContactSupport = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowSupportDialog(true);
  };

  const handleTrackPackage = (orderId: string) => {
    toast({
      title: "Tracking Information",
      description: `Tracking details for order ${orderId} would be displayed here.`,
    });
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast({
      title: "Download Started",
      description: `Invoice for order ${orderId} is being downloaded.`,
    });
  };

  const handleCancelOrder = (orderId: string) => {
    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled successfully.`,
    });
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Rating Submitted",
      description: `Thank you for your ${rating}-star rating!`,
    });
    setShowRatingDialog(false);
    setRating(0);
    setRatingComment("");
  };

  const handleSubmitSupport = () => {
    if (!supportMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Support Request Sent",
      description: "Your support request has been submitted. We'll get back to you soon.",
    });
    setShowSupportDialog(false);
    setSupportMessage("");
  };

  const filteredOrders = {
    all: mockOrders,
    delivered: mockOrders.filter(order => order.status === "delivered"),
    shipped: mockOrders.filter(order => order.status === "shipped"),
    processing: mockOrders.filter(order => order.status === "processing"),
    cancelled: mockOrders.filter(order => order.status === "cancelled")
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your orders and view order history</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders ({filteredOrders.all.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({filteredOrders.processing.length})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({filteredOrders.shipped.length})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({filteredOrders.delivered.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({filteredOrders.cancelled.length})</TabsTrigger>
          </TabsList>

          {Object.entries(filteredOrders).map(([status, orders]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                    <p className="text-muted-foreground text-center">
                      {status === "all" 
                        ? "You haven't placed any orders yet."
                        : `You don't have any ${status} orders.`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Order ID</p>
                            <p className="font-medium">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Order Date</p>
                            <p className="font-medium">{formatDate(order.date)}</p>
                          </div>
                          {order.estimatedDelivery && (
                            <div>
                              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                              <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{item.image}</span>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">{formatCurrency(item.price)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Order Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Delivery Address
                          </h4>
                          <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                        </div>

                        <div className="space-y-4">
                          {order.trackingNumber && (
                            <div>
                              <h4 className="font-semibold mb-2">Tracking Number</h4>
                              <p className="text-sm font-mono bg-muted p-2 rounded">
                                {order.trackingNumber}
                              </p>
                            </div>
                          )}

                          {order.actualDelivery && (
                            <div>
                              <h4 className="font-semibold mb-2">Delivered On</h4>
                              <p className="text-sm">{formatDate(order.actualDelivery)}</p>
                            </div>
                          )}

                          {order.cancellationReason && (
                            <div>
                              <h4 className="font-semibold mb-2">Cancellation Reason</h4>
                              <p className="text-sm text-red-600">{order.cancellationReason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {order.status === "delivered" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRateOrder(order.id)}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Rate Order
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactSupport(order.id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Support
                            </Button>
                          </>
                        )}

                        {order.status === "shipped" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTrackPackage(order.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(order.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>

                        {order.status === "processing" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <X className="h-4 w-4 mr-2" />
                                Cancel Order
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel order {order.id}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No, keep order</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>
                                  Yes, cancel order
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Order Summary Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredOrders.all.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{filteredOrders.delivered.length}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{filteredOrders.processing.length}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{filteredOrders.cancelled.length}</p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder}</DialogTitle>
            <DialogDescription>
              Detailed information about your order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedOrder && mockOrders.find(order => order.id === selectedOrder) && (
              <div>
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Order ID:</strong> {selectedOrder}</p>
                  <p><strong>Date:</strong> {formatDate(mockOrders.find(order => order.id === selectedOrder)!.date)}</p>
                  <p><strong>Status:</strong> {getStatusText(mockOrders.find(order => order.id === selectedOrder)!.status)}</p>
                  <p><strong>Total:</strong> {formatCurrency(mockOrders.find(order => order.id === selectedOrder)!.total)}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Order</DialogTitle>
            <DialogDescription>
              Share your experience with order {selectedOrder}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment (optional)</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
                rows={3}
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRating}>
                Submit Rating
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Need help with order {selectedOrder}? Send us a message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
                rows={4}
                placeholder="Describe your issue..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSupportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSupport}>
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders; 