import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Plus, Trash2, Banknote, IndianRupee, QrCode } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockMethods = [
  {
    id: 1,
    type: "Card",
    brand: "Visa",
    last4: "1234",
    name: "Test Buyer",
    expiry: "12/27",
    icon: <CreditCard className="h-5 w-5 text-blue-600" />,
    isDefault: true
  },
  {
    id: 2,
    type: "UPI",
    upi: "testbuyer@upi",
    icon: <QrCode className="h-5 w-5 text-green-600" />,
    isDefault: false
  },
  {
    id: 3,
    type: "Bank",
    bank: "SBI",
    account: "XXXX5678",
    icon: <Banknote className="h-5 w-5 text-yellow-600" />,
    isDefault: false
  }
];

const PaymentMethods = () => {
  const { toast } = useToast();
  const [methods, setMethods] = useState(mockMethods);
  const [showAdd, setShowAdd] = useState(false);
  const [paymentType, setPaymentType] = useState<string>("");
  const [newPayment, setNewPayment] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: ""
  });

  const handleRemovePayment = (id: number) => {
    const paymentToRemove = methods.find(method => method.id === id);
    if (paymentToRemove?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot remove default payment method. Set another method as default first.",
        variant: "destructive",
      });
      return;
    }

    setMethods(methods.filter(method => method.id !== id));
    toast({
      title: "Success",
      description: "Payment method removed successfully!",
    });
  };

  const handleAddPayment = () => {
    if (!paymentType) {
      toast({
        title: "Error",
        description: "Please select a payment type.",
        variant: "destructive",
      });
      return;
    }

    let isValid = false;
    let newMethod: any = {};

    if (paymentType === "Card") {
      if (!newPayment.cardNumber || !newPayment.cardHolder || !newPayment.expiry || !newPayment.cvv) {
        toast({
          title: "Error",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }
      isValid = true;
      newMethod = {
        id: Math.max(...methods.map(m => m.id)) + 1,
        type: "Card",
        brand: "Visa", // In real app, detect from card number
        last4: newPayment.cardNumber.slice(-4),
        name: newPayment.cardHolder,
        expiry: newPayment.expiry,
        icon: <CreditCard className="h-5 w-5 text-blue-600" />,
        isDefault: methods.length === 0
      };
    } else if (paymentType === "UPI") {
      if (!newPayment.upiId) {
        toast({
          title: "Error",
          description: "Please enter UPI ID.",
          variant: "destructive",
        });
        return;
      }
      isValid = true;
      newMethod = {
        id: Math.max(...methods.map(m => m.id)) + 1,
        type: "UPI",
        upi: newPayment.upiId,
        icon: <QrCode className="h-5 w-5 text-green-600" />,
        isDefault: methods.length === 0
      };
    } else if (paymentType === "Bank") {
      if (!newPayment.bankName || !newPayment.accountNumber || !newPayment.ifscCode || !newPayment.accountHolder) {
        toast({
          title: "Error",
          description: "Please fill in all bank details.",
          variant: "destructive",
        });
        return;
      }
      isValid = true;
      newMethod = {
        id: Math.max(...methods.map(m => m.id)) + 1,
        type: "Bank",
        bank: newPayment.bankName,
        account: `XXXX${newPayment.accountNumber.slice(-4)}`,
        icon: <Banknote className="h-5 w-5 text-yellow-600" />,
        isDefault: methods.length === 0
      };
    }

    if (isValid) {
      setMethods([...methods, newMethod]);
      setNewPayment({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
        upiId: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolder: ""
      });
      setPaymentType("");
      setShowAdd(false);
      
      toast({
        title: "Success",
        description: "Payment method added successfully!",
      });
    }
  };

  const handleSetDefault = (id: number) => {
    setMethods(methods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast({
      title: "Success",
      description: "Default payment method updated!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Methods</h1>
          <p className="text-muted-foreground">Manage your saved cards, UPI, and bank accounts</p>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Payment Methods</CardTitle>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {methods.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No payment methods saved.</div>
            ) : (
              methods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <div className="font-medium">
                        {method.type === "Card" && `**** **** **** ${method.last4} (${method.brand})`}
                        {method.type === "UPI" && `${method.upi}`}
                        {method.type === "Bank" && `${method.bank} (${method.account})`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {method.type === "Card" && `Name: ${method.name} | Exp: ${method.expiry}`}
                        {method.isDefault && <span className="ml-2 text-green-600 font-semibold">Default</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
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
                          <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this payment method? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemovePayment(method.id)}>
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
              <CardTitle>Add New Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Payment Type</label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === "Card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Card Number</label>
                    <Input 
                      placeholder="1234 5678 9012 3456"
                      value={newPayment.cardNumber}
                      onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cardholder Name</label>
                    <Input 
                      placeholder="John Doe"
                      value={newPayment.cardHolder}
                      onChange={(e) => setNewPayment({...newPayment, cardHolder: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input 
                        placeholder="MM/YY"
                        value={newPayment.expiry}
                        onChange={(e) => setNewPayment({...newPayment, expiry: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CVV</label>
                      <Input 
                        placeholder="123"
                        value={newPayment.cvv}
                        onChange={(e) => setNewPayment({...newPayment, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentType === "UPI" && (
                <div>
                  <label className="text-sm font-medium">UPI ID</label>
                  <Input 
                    placeholder="username@upi"
                    value={newPayment.upiId}
                    onChange={(e) => setNewPayment({...newPayment, upiId: e.target.value})}
                  />
                </div>
              )}

              {paymentType === "Bank" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Bank Name</label>
                    <Input 
                      placeholder="State Bank of India"
                      value={newPayment.bankName}
                      onChange={(e) => setNewPayment({...newPayment, bankName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Holder Name</label>
                    <Input 
                      placeholder="John Doe"
                      value={newPayment.accountHolder}
                      onChange={(e) => setNewPayment({...newPayment, accountHolder: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Number</label>
                    <Input 
                      placeholder="1234567890"
                      value={newPayment.accountNumber}
                      onChange={(e) => setNewPayment({...newPayment, accountNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">IFSC Code</label>
                    <Input 
                      placeholder="SBIN0001234"
                      value={newPayment.ifscCode}
                      onChange={(e) => setNewPayment({...newPayment, ifscCode: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddPayment}>Add Payment Method</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods; 