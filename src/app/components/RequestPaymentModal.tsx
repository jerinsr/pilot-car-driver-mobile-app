import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  DollarSign,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Clock,
  Shield,
  FileText,
} from "lucide-react";
import { PilotCarJob } from "./PilotCarJobDetail";

interface PaymentLineItem {
  id: string;
  description: string;
  amount: number;
  type: "base" | "incidental" | "detention" | "perdiem" | "waiting" | "other";
  editable: boolean;
}

interface RequestPaymentModalProps {
  job: PilotCarJob;
  open: boolean;
  onClose: () => void;
  onSubmit: (items: PaymentLineItem[], notes: string) => void;
}

export function RequestPaymentModal({
  job,
  open,
  onClose,
  onSubmit,
}: RequestPaymentModalProps) {
  // Parse base rate from job
  const baseRate = parseFloat(job.positions[0]?.suggestedRate?.replace(/[^0-9.]/g, "") || "0");
  
  // Initialize with base rate
  const [lineItems, setLineItems] = useState<PaymentLineItem[]>([
    {
      id: "base-1",
      description: `${job.positions[0]?.type || "Lead"} Pilot - Base Rate`,
      amount: baseRate,
      type: "base",
      editable: false,
    },
  ]);

  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New line item form
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemType, setNewItemType] = useState<PaymentLineItem["type"]>("incidental");

  const addLineItem = () => {
    if (!newItemDescription.trim() || !newItemAmount || parseFloat(newItemAmount) <= 0) {
      alert("Please enter a valid description and amount");
      return;
    }

    const newItem: PaymentLineItem = {
      id: `item-${Date.now()}`,
      description: newItemDescription,
      amount: parseFloat(newItemAmount),
      type: newItemType,
      editable: true,
    };

    setLineItems([...lineItems, newItem]);
    setNewItemDescription("");
    setNewItemAmount("");
    setNewItemType("incidental");
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof PaymentLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async () => {
    if (lineItems.length === 0) {
      alert("Please add at least one line item");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    onSubmit(lineItems, notes);
    setIsSubmitting(false);
  };

  const getItemIcon = (type: PaymentLineItem["type"]) => {
    switch (type) {
      case "base":
        return <Shield className="w-4 h-4" />;
      case "incidental":
        return <Receipt className="w-4 h-4" />;
      case "detention":
      case "waiting":
        return <Clock className="w-4 h-4" />;
      case "perdiem":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getItemTypeColor = (type: PaymentLineItem["type"]) => {
    switch (type) {
      case "base":
        return "bg-blue-50 text-blue-600";
      case "incidental":
        return "bg-amber-50 text-amber-600";
      case "detention":
      case "waiting":
        return "bg-purple-50 text-purple-600";
      case "perdiem":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] flex flex-col rounded-t-2xl max-w-[600px] mx-auto"
        aria-describedby={undefined}
      >
        <SheetHeader className="pb-4 border-b border-gray-200">
          <SheetTitle>Request Payment</SheetTitle>
          <SheetDescription>
            Review base charges and add any additional expenses for job {job.id}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
          {/* Job Summary - Compact */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">JOB-{job.id}</p>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">
                    {job.origin} → {job.destination}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 h-5 text-[10px]">
                      Completed
                    </Badge>
                    <span className="text-gray-400">•</span>
                    <span>{job.distance}</span>
                    <span className="text-gray-400">•</span>
                    <span>{job.positions[0]?.type} Pilot</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Payment Items</h3>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                {lineItems.length} {lineItems.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            <div className="space-y-2">
              {lineItems.map((item) => (
                <Card key={item.id} className="border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getItemTypeColor(item.type)}`}>
                        {getItemIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.editable ? (
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(item.id, "description", e.target.value)
                            }
                            className="text-sm font-medium mb-1 h-8"
                            placeholder="Description"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 bg-gray-50 capitalize"
                          >
                            {item.type === "perdiem" ? "Per Diem" : item.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.editable ? (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.amount}
                              onChange={(e) =>
                                updateLineItem(
                                  item.id,
                                  "amount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 text-sm font-semibold h-8"
                            />
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                            ${item.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        )}
                        {item.editable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add New Item Form */}
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Additional Charge
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="item-type" className="text-xs font-medium text-gray-700">
                    Type
                  </Label>
                  <select
                    id="item-type"
                    value={newItemType}
                    onChange={(e) =>
                      setNewItemType(e.target.value as PaymentLineItem["type"])
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="incidental">Incidental Expense</option>
                    <option value="perdiem">Per Diem</option>
                    <option value="detention">Detention Time</option>
                    <option value="waiting">Waiting Time</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="item-description" className="text-xs font-medium text-gray-700">
                    Description
                  </Label>
                  <Input
                    id="item-description"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="e.g., Fuel surcharge, Tolls, Overnight stay"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="item-amount" className="text-xs font-medium text-gray-700">
                    Amount
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500">$</span>
                    <Input
                      id="item-amount"
                      type="number"
                      step="0.01"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={addLineItem}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="payment-notes" className="text-sm font-medium text-gray-900 mb-2 block">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="payment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about this payment request..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Info Banner */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-blue-900">
                    Payment Request Review Process
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    The truck driver will review your request within 24-48 hours. You'll be
                    notified once it's approved and payment is processed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with Total and Actions */}
        <SheetFooter className="pt-4 border-t border-gray-200 space-y-3 block">
          {/* Total Amount */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div>
              <p className="text-xs font-medium text-green-700 mb-0.5">Total Amount</p>
              <p className="text-2xl font-bold text-green-900">
                ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || lineItems.length === 0}
              className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-semibold h-11"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}