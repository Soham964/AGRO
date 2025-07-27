import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Trash2, Edit2, Home } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

const mockAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    isDefault: true
  },
  {
    id: 2,
    label: "Work",
    address: "456 Oak Avenue, Building 7, Delhi, Delhi 110001",
    isDefault: false
  }
];

const DeliveryAddresses = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: ""
  });

  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.address.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...addresses.map(addr => addr.id)) + 1;
    const addressToAdd = {
      id: newId,
      label: newAddress.label,
      address: newAddress.address,
      isDefault: addresses.length === 0 // First address becomes default
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({ label: "", address: "" });
    setShowAdd(false);
    
    toast({
      title: "Success",
      description: "Address added successfully!",
    });
  };

  const handleRemoveAddress = (id: number) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    if (addressToRemove?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot remove default address. Set another address as default first.",
        variant: "destructive",
      });
      return;
    }

    setAddresses(addresses.filter(addr => addr.id !== id));
    toast({
      title: "Success",
      description: "Address removed successfully!",
    });
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast({
      title: "Success",
      description: "Default address updated!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Delivery Addresses</h1>
          <p className="text-muted-foreground">Manage your saved delivery addresses</p>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Addresses</CardTitle>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No addresses saved.</div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{addr.label}</div>
                      <div className="text-xs text-muted-foreground">{addr.address}</div>
                      {addr.isDefault && <span className="text-green-600 font-semibold">Default</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!addr.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this address? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveAddress(addr.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {showAdd && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Address Label</label>
                <Input 
                  placeholder="e.g., Home, Work, Office"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Full Address</label>
                <textarea
                  placeholder="Enter your complete address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAddress}>Add Address</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddresses; 