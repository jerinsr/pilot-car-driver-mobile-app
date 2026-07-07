import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
  Camera,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Gauge,
  Image as ImageIcon,
  Edit2,
  Download,
  Eye,
  Save,
  Check,
} from "lucide-react";
import { PilotCarJob } from "./PilotCarJobDetail";

interface JobAssignment {
  id: string;
  type: "Lead" | "Chase" | "Survey";
  pricingType: "Flat" | "Per Mile" | "Per KM";
  baseRate: number;
  selected: boolean;
}

interface AdditionalCharge {
  id: string;
  type: "layover" | "standby" | "overtime" | "change-request" | "manual";
  description: string;
  quantity?: number; // hours/days
  amount: number;
}

interface OdometerData {
  starting: number;
  final: number;
  photo?: File | null;
  photoPreview?: string;
}

interface SubmitInvoiceModalProps {
  job: PilotCarJob;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceSubmissionData) => void;
}

export interface InvoiceSubmissionData {
  assignments: JobAssignment[];
  odometer: OdometerData;
  distance: number;
  additionalCharges: AdditionalCharge[];
  serviceCost: number;
  additionalChargesTotal: number;
  grossAmount: number;
  overwizeFee: number;
  tax: number;
  netAmount: number;
}

export function SubmitInvoiceModal({
  job,
  open,
  onClose,
  onSubmit,
}: SubmitInvoiceModalProps) {
  // Mock assignments - in real app this would come from job data
  const [assignments, setAssignments] = useState<JobAssignment[]>([
    {
      id: "assign-1",
      type: "Lead",
      pricingType: "Flat",
      baseRate: parseFloat(job.positions[0]?.suggestedRate?.replace(/[^0-9.]/g, "") || "800"),
      selected: false,
    },
    {
      id: "assign-2",
      type: "Chase",
      pricingType: "Per Mile",
      baseRate: 3.5,
      selected: false,
    },
  ]);

  const [odometer, setOdometer] = useState<OdometerData>({
    starting: 12450, // Mock starting odometer
    final: 0,
    photo: null,
    photoPreview: undefined,
  });

  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);
  const [isAdditionalChargesExpanded, setIsAdditionalChargesExpanded] = useState(false);
  
  // New charge form state
  const [newChargeType, setNewChargeType] = useState<AdditionalCharge["type"]>("standby");
  const [newChargeDescription, setNewChargeDescription] = useState("");
  const [newChargeQuantity, setNewChargeQuantity] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Calculations
  const selectedCount = assignments.filter((a) => a.selected).length;
  const distance = odometer.final > odometer.starting ? odometer.final - odometer.starting : 0;

  const calculateServiceCost = (): number => {
    return assignments.reduce((total, assignment) => {
      if (!assignment.selected) return total;
      
      if (assignment.pricingType === "Flat") {
        return total + assignment.baseRate;
      } else {
        // Per Mile / Per KM
        return total + (assignment.baseRate * distance);
      }
    }, 0);
  };

  const serviceCost = calculateServiceCost();
  const additionalChargesTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const grossAmount = serviceCost + additionalChargesTotal;
  const overwizeFee = grossAmount * 0.05; // 5% fee
  const tax = (grossAmount + overwizeFee) * 0.08; // 8% tax
  const netAmount = grossAmount + overwizeFee + tax;

  // Validation checklist
  const validations = {
    assignmentSelected: selectedCount > 0,
    odometerEntered: odometer.final > 0 && odometer.final > odometer.starting,
    photoUploaded: !!odometer.photo,
  };

  const allValidationsPassed = Object.values(validations).every(v => v);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedCount === 0) {
      newErrors.assignments = "Please select at least one assignment";
    }

    if (!odometer.final || odometer.final <= 0) {
      newErrors.odometer = "Please enter a valid final odometer reading";
    }

    if (odometer.final > 0 && odometer.final <= odometer.starting) {
      newErrors.odometer = "Final odometer must be greater than starting reading";
    }

    if (!odometer.photo) {
      newErrors.odometerPhoto = "Please upload the final odometer reading photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSubmit = allValidationsPassed;

  const handleAssignmentToggle = (id: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === id ? { ...a, selected: !a.selected } : a
      )
    );
    if (errors.assignments) {
      setErrors({ ...errors, assignments: "" });
    }
  };

  const handleOdometerChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setOdometer({ ...odometer, final: numValue });
    if (errors.odometer) {
      setErrors({ ...errors, odometer: "" });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOdometer({
          ...odometer,
          photo: file,
          photoPreview: reader.result as string,
        });
        if (errors.odometerPhoto) {
          setErrors({ ...errors, odometerPhoto: "" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setOdometer({
      ...odometer,
      photo: null,
      photoPreview: undefined,
    });
  };

  const addAdditionalCharge = () => {
    if (!newChargeAmount || parseFloat(newChargeAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (newChargeType === "manual" && !newChargeDescription.trim()) {
      alert("Description is required for manual charges");
      return;
    }

    const newCharge: AdditionalCharge = {
      id: `charge-${Date.now()}`,
      type: newChargeType,
      description: newChargeDescription || getChargeTypeLabel(newChargeType),
      quantity: newChargeQuantity ? parseFloat(newChargeQuantity) : undefined,
      amount: parseFloat(newChargeAmount),
    };

    setAdditionalCharges([...additionalCharges, newCharge]);
    
    // Reset form
    setNewChargeType("standby");
    setNewChargeDescription("");
    setNewChargeQuantity("");
    setNewChargeAmount("");
  };

  const removeAdditionalCharge = (id: string) => {
    setAdditionalCharges(additionalCharges.filter((c) => c.id !== id));
  };

  const getChargeTypeLabel = (type: AdditionalCharge["type"]): string => {
    switch (type) {
      case "layover": return "Layover";
      case "standby": return "Standby / Waiting";
      case "overtime": return "Overtime";
      case "change-request": return "Change Request";
      case "manual": return "Manual Extra Charge";
      default: return "Additional Charge";
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    // In real app, save to local storage or backend
    alert("✅ Draft saved successfully!");
  };

  const handleReview = () => {
    if (!validateForm()) {
      return;
    }
    setShowReviewScreen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const submissionData: InvoiceSubmissionData = {
      assignments: assignments.filter((a) => a.selected),
      odometer,
      distance,
      additionalCharges,
      serviceCost,
      additionalChargesTotal,
      grossAmount,
      overwizeFee,
      tax,
      netAmount,
    };

    onSubmit(submissionData);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (selectedCount > 0 || additionalCharges.length > 0 || odometer.final > 0) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const hasUnsavedChanges = selectedCount > 0 || additionalCharges.length > 0 || odometer.final > 0;

  // Review Screen
  if (showReviewScreen) {
    return (
      <Sheet open={open} onOpenChange={() => setShowReviewScreen(false)}>
        <SheetContent
          side="bottom"
          className="h-[95vh] flex flex-col rounded-t-2xl max-w-[600px] mx-auto p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="pb-4 border-b border-gray-200 px-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Review Invoice</SheetTitle>
                <SheetDescription>
                  Review your invoice before submitting
                </SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviewScreen(false)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
            {/* Job Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">JOB-{job.id}</p>
                    <h4 className="font-bold text-gray-900 text-base">
                      {job.origin} → {job.destination}
                    </h4>
                  </div>
                  <Badge className="bg-blue-600 text-white border-0">
                    Invoice
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span>{new Date(job.departureDate).toLocaleDateString()}</span>
                  <span className="text-gray-400">•</span>
                  <span>{job.positions[0]?.type} Pilot</span>
                  <span className="text-gray-400">•</span>
                  <span>{distance} mi traveled</span>
                </div>
              </CardContent>
            </Card>

            {/* Selected Assignments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Job Assignments</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {selectedCount} selected
                </Badge>
              </div>

              {assignments.filter(a => a.selected).map((assignment) => (
                <Card key={assignment.id} className="border-blue-200 bg-blue-50/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {assignment.type} Pilot
                      </p>
                      <Badge variant="outline" className="text-[10px] bg-white">
                        {assignment.pricingType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {assignment.pricingType === "Flat" 
                          ? `Flat Rate: $${assignment.baseRate.toFixed(2)}` 
                          : `$${assignment.baseRate.toFixed(2)}/${assignment.pricingType === "Per Mile" ? "mi" : "km"} × ${distance} ${assignment.pricingType === "Per Mile" ? "mi" : "km"}`
                        }
                      </span>
                      <span className="text-sm font-bold text-blue-700">
                        ${assignment.pricingType === "Flat"
                          ? assignment.baseRate.toFixed(2)
                          : (assignment.baseRate * distance).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Odometer & Distance */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-gray-500" />
                  Odometer Reading
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Starting</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">
                      {odometer.starting.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Final</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">
                      {odometer.final.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Distance</p>
                    <p className="text-sm font-mono font-semibold text-blue-700">
                      {distance.toLocaleString()} mi
                    </p>
                  </div>
                </div>
                {odometer.photoPreview && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Odometer Photo</p>
                    <img
                      src={odometer.photoPreview}
                      alt="Odometer reading"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Charges */}
            {additionalCharges.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Additional Charges ({additionalCharges.length})
                </h3>
                {additionalCharges.map((charge) => (
                  <Card key={charge.id} className="border-gray-200">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">{charge.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] bg-gray-50">
                              {getChargeTypeLabel(charge.type)}
                            </Badge>
                            {charge.quantity && (
                              <span className="text-xs text-gray-500">
                                Qty: {charge.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-900">${charge.amount.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Invoice Breakdown */}
            <Card className="border-2 border-gray-300 bg-gray-50">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Invoice Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Cost</span>
                    <span className="font-medium text-gray-900">${serviceCost.toFixed(2)}</span>
                  </div>
                  {additionalChargesTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Charges</span>
                      <span className="font-medium text-gray-900">${additionalChargesTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Amount</span>
                    <span className="font-medium text-gray-900">${grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Overwize Service Fee (5%)</span>
                    <span className="text-gray-700">${overwizeFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Tax (8%)</span>
                    <span className="text-gray-700">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 text-base">Net Amount Payable</span>
                    <span className="font-bold text-xl text-green-700">${netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sticky Footer */}
          <div className="border-t border-gray-200 bg-white p-4 space-y-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReviewScreen(false)}
                disabled={isSubmitting}
                className="flex-1 h-11"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-semibold h-11"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Main Form Screen
  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="bottom"
          className="h-[95vh] flex flex-col rounded-t-2xl max-w-[600px] mx-auto p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="pb-4 border-b border-gray-200 px-4 pt-4">
            <SheetTitle>Submit Invoice</SheetTitle>
            <SheetDescription>
              Create and submit your invoice for job {job.id}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-64">
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
                      <span>{new Date(job.departureDate).toLocaleDateString()}</span>
                      <span className="text-gray-400">•</span>
                      <span>{job.positions[0]?.type} Pilot</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Checklist */}
            <Card className={`border-2 ${allValidationsPassed ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'}`}>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${allValidationsPassed ? 'text-green-600' : 'text-blue-600'}`} />
                  Required Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {validations.assignmentSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-sm ${validations.assignmentSelected ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                      Select at least one assignment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validations.odometerEntered ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-sm ${validations.odometerEntered ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                      Enter valid final odometer reading
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validations.photoUploaded ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-sm ${validations.photoUploaded ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                      Upload odometer photo
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Select Job Assignments</h3>
                <Badge variant="secondary" className={`${selectedCount > 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  Selected: {selectedCount}
                </Badge>
              </div>

              {errors.assignments && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{errors.assignments}</p>
                </div>
              )}

              <div className="space-y-2">
                {assignments.map((assignment) => {
                  const calculatedCharge = assignment.pricingType === "Flat" 
                    ? assignment.baseRate 
                    : assignment.baseRate * distance;
                  
                  return (
                    <Card
                      key={assignment.id}
                      className={`border-2 transition-all cursor-pointer ${
                        assignment.selected 
                          ? "border-blue-500 bg-blue-50 shadow-md" 
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => handleAssignmentToggle(assignment.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={assignment.selected}
                            onCheckedChange={() => handleAssignmentToggle(assignment.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  {assignment.type} Pilot
                                </p>
                                {assignment.selected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <Badge variant="outline" className={`text-[10px] ${assignment.selected ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white'}`}>
                                {assignment.pricingType}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  {assignment.pricingType === "Flat" 
                                    ? "Flat Rate" 
                                    : `Rate: $${assignment.baseRate.toFixed(2)}/${assignment.pricingType === "Per Mile" ? "mi" : "km"}`
                                  }
                                </span>
                                <span className={`text-xs font-medium ${assignment.selected ? 'text-blue-700' : 'text-gray-500'}`}>
                                  Base: ${assignment.baseRate.toFixed(2)}
                                </span>
                              </div>
                              {assignment.selected && distance > 0 && assignment.pricingType !== "Flat" && (
                                <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-200">
                                  <span className="text-blue-600">
                                    {distance} {assignment.pricingType === "Per Mile" ? "mi" : "km"} × ${assignment.baseRate.toFixed(2)}
                                  </span>
                                  <span className="text-sm font-bold text-blue-700">
                                    ${calculatedCharge.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {assignment.selected && assignment.pricingType === "Flat" && (
                                <div className="flex items-center justify-end pt-1 border-t border-blue-200">
                                  <span className="text-sm font-bold text-blue-700">
                                    ${calculatedCharge.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Odometer Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-500" />
                Odometer Reading
              </h3>
              <p className="text-xs text-gray-600 -mt-2">
                Enter your final odometer reading. Distance will be calculated automatically.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 font-medium">Starting Odometer</Label>
                  <div className="mt-1.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm font-mono font-medium text-gray-700">
                      {odometer.starting.toLocaleString()} mi
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600 font-medium flex items-center gap-1">
                    Final Odometer <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={odometer.final || ""}
                    onChange={(e) => handleOdometerChange(e.target.value)}
                    placeholder="0"
                    className={`mt-1.5 font-mono ${errors.odometer ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>
              </div>

              {errors.odometer && (
                <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{errors.odometer}</p>
                </div>
              )}

              {distance > 0 && !errors.odometer && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-700">Distance Traveled</span>
                    <span className="text-lg font-bold text-blue-900 font-mono">{distance.toLocaleString()} mi</span>
                  </div>
                </div>
              )}
            </div>

            {/* Odometer Photo Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                Odometer Photo <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600 -mt-2">
                Upload a clear photo of your final odometer reading for verification.
              </p>

              {!odometer.photoPreview ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                      className="h-24 border-dashed border-2 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Camera className="w-6 h-6 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Take Photo</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById("photo-upload") as HTMLInputElement;
                        if (input) {
                          input.removeAttribute("capture");
                          input.click();
                          input.setAttribute("capture", "environment");
                        }
                      }}
                      className="h-24 border-dashed border-2 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Upload className="w-6 h-6 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Upload from Gallery</span>
                    </Button>
                  </div>
                  {errors.odometerPhoto && (
                    <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700">{errors.odometerPhoto}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={odometer.photoPreview}
                    alt="Odometer reading"
                    className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                      className="bg-white hover:bg-gray-100 shadow-md h-8"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="bg-white hover:bg-red-50 hover:text-red-600 shadow-md h-8"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-green-600 text-white border-0">
                      <Check className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Charges Section - Collapsible */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdditionalChargesExpanded(!isAdditionalChargesExpanded)}
                className="w-full justify-between p-4 border border-gray-200 hover:bg-gray-50 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Additional Charges
                  </span>
                  {additionalCharges.length > 0 && !isAdditionalChargesExpanded && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {additionalCharges.length} • ${additionalChargesTotal.toFixed(2)}
                    </Badge>
                  )}
                </div>
                {isAdditionalChargesExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              {/* Add Charge - Always visible */}
              <Card className="border-dashed border-2 border-blue-300 bg-blue-50/30">
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    Add Charge
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Type</Label>
                      <select
                        value={newChargeType}
                        onChange={(e) => setNewChargeType(e.target.value as AdditionalCharge["type"])}
                        className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="layover">Layover</option>
                        <option value="standby">Standby / Waiting</option>
                        <option value="overtime">Overtime</option>
                        <option value="change-request">Change Request</option>
                        <option value="manual">Manual Extra Charge</option>
                      </select>
                    </div>
                    {(newChargeType === "manual" || newChargeType === "layover" || newChargeType === "standby" || newChargeType === "overtime") && (
                      <div>
                        <Label className="text-xs font-medium text-gray-700">
                          Description {newChargeType === "manual" ? <span className="text-red-500">*</span> : "(Optional)"}
                        </Label>
                        <Input
                          value={newChargeDescription}
                          onChange={(e) => setNewChargeDescription(e.target.value)}
                          placeholder="Enter description"
                          className="mt-1.5"
                        />
                      </div>
                    )}
                    {(newChargeType === "standby" || newChargeType === "overtime" || newChargeType === "layover") && (
                      <div>
                        <Label className="text-xs font-medium text-gray-700">
                          Quantity (hours/days)
                        </Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={newChargeQuantity}
                          onChange={(e) => setNewChargeQuantity(e.target.value)}
                          placeholder="0"
                          className="mt-1.5"
                        />
                      </div>
                    )}
                    <div>
                      <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        Amount <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-gray-500 text-sm">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={newChargeAmount}
                          onChange={(e) => setNewChargeAmount(e.target.value)}
                          placeholder="0.00"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addAdditionalCharge}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Charge
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing charges - shown when expanded */}
              {isAdditionalChargesExpanded && additionalCharges.length > 0 && (
                <div className="space-y-2">
                  {additionalCharges.map((charge) => (
                    <Card key={charge.id} className="border-gray-200 bg-white">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">{charge.description}</p>
                              <p className="text-sm font-bold text-gray-900">${charge.amount.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] bg-gray-50">
                                {getChargeTypeLabel(charge.type)}
                              </Badge>
                              {charge.quantity && (
                                <span className="text-xs text-gray-500">
                                  Qty: {charge.quantity}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalCharge(charge.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer - Invoice Summary + Actions */}
          <div className="border-t-2 border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            {/* Calculation Summary */}
            <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Invoice Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Cost</span>
                  <span className="font-medium text-gray-900">${serviceCost.toFixed(2)}</span>
                </div>
                {additionalChargesTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Charges</span>
                    <span className="font-medium text-gray-900">${additionalChargesTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Amount</span>
                  <span className="font-medium text-gray-900">${grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Overwize Fee (5%)</span>
                  <span className="text-gray-700">${overwizeFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tax (8%)</span>
                  <span className="text-gray-700">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Net Payable</span>
                  <span className="font-bold text-2xl text-green-700">${netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={!hasUnsavedChanges}
                  className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleReview}
                  disabled={!canSubmit}
                  className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-semibold h-11"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Invoice
                </Button>
              </div>
              {!canSubmit && (
                <p className="text-xs text-center text-gray-500">
                  Complete all required fields to continue
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Unsaved Invoice Details</h3>
                  <p className="text-sm text-gray-600">
                    You have unsaved invoice details. Are you sure you want to leave?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1"
                >
                  Stay
                </Button>
                <Button
                  onClick={() => {
                    setShowExitConfirm(false);
                    onClose();
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Leave
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
