import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  MapPin,
  Calendar,
  Truck,
  DollarSign,
  Clock,
  ChevronLeft,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Info,
  Send,
  Map,
  Building2,
  FileText,
  Plus,
  CreditCard,
  Download,
  Receipt,
  MoreHorizontal,
  ChevronRight,
  User,
  TrendingUp,
  X,
  Sparkles,
  Timer,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export interface PilotCarPosition {
  type: "Lead" | "Chase";
  needed: number;
  rateType: "Flat Rate" | "Per Mile" | "Hourly";
  suggestedRate?: string;
  bidStatus?: "pending" | "accepted" | "rejected";
  yourBid?: string;
}

export interface PaymentItem {
  id: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  type: "base" | "incidental" | "detention";
  date: string;
}

export interface PilotCarJob {
  id: string;
  tripId: string;
  jobType?: "Route Survey" | "Convoy";
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  distance: string;
  loadType: string;
  commodityType?: string;
  vehicleType: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  positions: PilotCarPosition[];
  status:
    | "open"
    | "bidding"
    | "awarded"
    | "active"
    | "completed";
  postedDate: string;
  jurisdictions: string[];
  specialRequirements?: string[];
  carrierInfo?: {
    name: string;
    contact: string;
    email: string;
  };
  permitInfo?: {
    number: string;
    validFrom: string;
    validTo: string;
  };
  routeNotes?: string;
  restrictions?: string[];
  paymentDetails?: {
    totalAmount: number;
    currency: string;
    status: "unpaid" | "processing" | "paid" | "overdue";
    items: PaymentItem[];
    invoiceNumber?: string;
    paymentMethod?: string;
  };
}

interface PilotCarJobDetailProps {
  job: PilotCarJob;
  onBack: () => void;
}

export default function PilotCarJobDetail({
  job,
  onBack,
}: PilotCarJobDetailProps) {
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]); 
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [bidNotes, setBidNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBidSheetOpen, setIsBidSheetOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  
  // Mock drivers and vehicles
  const mockDrivers = [
    { id: "driver-1", name: "John Smith", defaultVehicle: "vehicle-1" },
    { id: "driver-2", name: "Maria Garcia", defaultVehicle: "vehicle-2" },
  ];

  const mockVehicles = [
    { id: "vehicle-1", name: "Ford F-250 (License: ABC-1234)", type: "Lead" },
    { id: "vehicle-2", name: "Chevy Silverado (License: XYZ-5678)", type: "Chase" },
  ];

  // Mock bidding status
  const biddingStatus = {
    isOpen: job.status === "open",
    timeRemaining: "2 days, 14 hours",
    numberOfBids: 8,
    closingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  };

  // Mock existing bid (if user already bid)
  const existingBid = job.status === "bidding" ? {
    id: "bid-123",
    positions: ["Lead"],
    amounts: { "Lead": "$1,750" },
    status: "pending" as "pending" | "accepted" | "rejected",
    submittedDate: "2026-02-20",
  } : null;

  const handlePositionToggle = (positionType: string) => {
    setSelectedPositions(prev => {
      if (prev.includes(positionType)) {
        return prev.filter(p => p !== positionType);
      } else {
        return [...prev, positionType];
      }
    });
  };

  const handleDriverChange = (driverId: string) => {
    setSelectedDriver(driverId);
    const driver = mockDrivers.find(d => d.id === driverId);
    if (driver?.defaultVehicle) {
      setSelectedVehicle(driver.defaultVehicle);
    }
  };

  const handleSubmitBid = async () => {
    if (selectedPositions.length === 0 || !selectedDriver || !selectedVehicle) return;

    // Check if all selected positions have bid amounts
    const allHaveBids = selectedPositions.every(pos => bidAmounts[pos]);
    if (!allHaveBids) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsBidSheetOpen(false);

    alert("Bid submitted successfully!");
    onBack();
  };

  const getPositionRate = (position: PilotCarPosition) => {
    if (position.rateType === "Per Mile") {
      const rate = parseFloat(
        position.suggestedRate?.replace(/[^0-9.]/g, "") || "0",
      );
      const miles = parseFloat(
        job.distance.replace(/[^0-9.]/g, "") || "0",
      );
      return `$${(rate * miles).toLocaleString()}`;
    }
    return position.suggestedRate || "N/A";
  };

  const calculateEstimatedEarnings = () => {
    let total = 0;
    selectedPositions.forEach(posType => {
      const bidAmount = bidAmounts[posType];
      if (bidAmount) {
        const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, "") || "0");
        const position = job.positions.find(p => p.type === posType);
        if (position?.rateType === "Per Mile") {
          const miles = parseFloat(job.distance.replace(/[^0-9.]/g, "") || "0");
          total += amount * miles;
        } else {
          total += amount;
        }
      }
    });
    return total;
  };

  const calculatePayRange = () => {
    if (!job.positions || job.positions.length === 0)
      return "N/A";

    const rates = job.positions
      .map((p) => {
        if (p.rateType === "Per Mile") {
          const rate = parseFloat(
            p.suggestedRate?.replace(/[^0-9.]/g, "") || "0",
          );
          const miles = parseFloat(
            job.distance.replace(/[^0-9.]/g, "") || "0",
          );
          return rate * miles;
        } else {
          return parseFloat(
            p.suggestedRate?.replace(/[^0-9.]/g, "") || "0",
          );
        }
      })
      .filter((r) => !isNaN(r) && r > 0);

    if (rates.length === 0) return "Negotiable";

    const min = Math.min(...rates);
    const max = Math.max(...rates);

    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(job.origin)}&destination=${encodeURIComponent(job.destination)}`;
    window.open(url, "_blank");
  };

  const isHighPoleRequired = job.specialRequirements?.some(
    (r) =>
      r.toLowerCase().includes("pole") ||
      r.toLowerCase().includes("height"),
  );
  const isPoliceEscortRequired = job.specialRequirements?.some(
    (r) =>
      r.toLowerCase().includes("police") ||
      r.toLowerCase().includes("escort"),
  );

  const availablePositionsCount = job.positions.reduce((sum, p) => sum + p.needed, 0);

  return (
    <div className="fixed inset-0 bg-white flex flex-col h-full z-50">
      {/* Minimal Header - Mobile First */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 px-4 py-4 flex-none shadow-sm z-10">
        {/* Top: Back Button + Job ID */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
          <Badge variant="outline" className="border-white/30 text-white text-xs font-mono">
            JOB-{job.id}
          </Badge>
        </div>

        {/* Middle: Job Title + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold text-white leading-tight flex-1">
            {job.loadType} Pilot Car
          </h1>
          {job.status === "open" && (
            <Badge className="bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB] text-xs px-2.5 h-6 font-semibold hover:bg-[#E3F2FD] shadow-none flex-shrink-0">
              Open
            </Badge>
          )}
          {job.status === "bidding" && (
            <Badge className="bg-[#FFF3E0] text-[#C2410C] border border-[#FFE0B2] text-xs px-2.5 h-6 font-semibold hover:bg-[#FFF3E0] shadow-none flex-shrink-0">
              Bid Submitted
            </Badge>
          )}
        </div>

        {/* Bottom: Estimated Pay */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Estimated Pay
          </span>
          <span className="text-base font-bold text-white">
            {calculatePayRange()}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 pb-32 max-w-3xl mx-auto space-y-4">
          
          {/* Bidding Status Section - Only show for open/bidding jobs */}
          {(job.status === "open" || job.status === "bidding") && (
            <Card className={`border-2 shadow-sm ${biddingStatus.isOpen ? 'border-blue-200 bg-blue-50/50' : 'border-gray-300 bg-gray-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {biddingStatus.isOpen ? (
                      <div className="bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="bg-red-500 rounded-full p-1">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">
                        {biddingStatus.isOpen ? "Bidding Open" : "Bidding Closed"}
                      </p>
                      {biddingStatus.isOpen && (
                        <p className="text-xs text-gray-600">
                          Closes in {biddingStatus.timeRemaining}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{availablePositionsCount}</p>
                    <p className="text-xs text-gray-600">Position{availablePositionsCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Total Bids</p>
                      <p className="font-semibold text-gray-900">{biddingStatus.numberOfBids}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Closes On</p>
                      <p className="font-semibold text-gray-900 text-xs">
                        {biddingStatus.closingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Your Bid Section - Show if user has already bid */}
          {existingBid && (
            <Card className="border-2 border-purple-200 bg-purple-50/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <p className="font-bold text-gray-900">Your Bid</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Submitted on {new Date(existingBid.submittedDate).toLocaleDateString()}
                    </p>
                    <div className="space-y-1">
                      {existingBid.positions.map(pos => (
                        <div key={pos} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{pos} Pilot</Badge>
                          <span className="font-semibold text-gray-900">{existingBid.amounts[pos]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Badge className={
                    existingBid.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    existingBid.status === "accepted" ? "bg-green-100 text-green-700 border-green-200" :
                    "bg-red-100 text-red-700 border-red-200"
                  }>
                    {existingBid.status === "pending" ? "Under Review" :
                     existingBid.status === "accepted" ? "Accepted" : "Declined"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Positions - Improved with selection */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  Available Positions
                </CardTitle>
                {selectedPositions.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {selectedPositions.length} selected
                  </Badge>
                )}
              </div>
              {job.status === "open" && (
                <p className="text-xs text-gray-500 mt-1">
                  Select positions you want to bid on
                </p>
              )}
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {job.positions.map((position, idx) => {
                  const isSelected = selectedPositions.includes(position.type);
                  return (
                    <div
                      key={idx}
                      onClick={() => job.status === "open" && handlePositionToggle(position.type)}
                      className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                      } ${job.status !== "open" ? 'cursor-default' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {job.status === "open" && (
                            <div className="pt-0.5">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => handlePositionToggle(position.type)}
                                className="border-2"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {position.type} Pilot Car
                            </p>
                            {position.needed > 1 && (
                              <p className="text-xs text-gray-600 mt-0.5">
                                {position.needed} positions available
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 h-5 text-[10px] px-2">
                          {position.rateType}
                        </Badge>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-600">
                            Suggested Market Rate
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {position.suggestedRate}
                          </p>
                        </div>
                        {position.rateType === "Per Mile" && (
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-2">
                            <p className="text-[10px] text-gray-500">
                              Estimated Total ({job.distance})
                            </p>
                            <p className="text-xs font-semibold text-green-700">
                              {getPositionRate(position)}
                            </p>
                          </div>
                        )}
                        <p className="text-[10px] text-gray-500 mt-2 italic">
                          You can bid higher or lower
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Route & Schedule Information */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-base">
                  Route & Schedule
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={handleOpenMaps}
                >
                  <Map className="w-3.5 h-3.5 mr-1.5" />
                  Open Maps
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Origin
                  </span>
                  <span className="font-medium text-gray-900 text-sm text-right max-w-[60%]">
                    {job.origin}
                  </span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Destination
                  </span>
                  <span className="font-medium text-gray-900 text-sm text-right max-w-[60%]">
                    {job.destination}
                  </span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Distance
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.distance}
                  </span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Departure
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {new Date(job.departureDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Return
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {new Date(job.returnDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Load Information */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3">
              <h3 className="font-semibold text-gray-900 text-base">
                Load Information
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Load Type
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.loadType}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Vehicle Type
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.vehicleType}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                  Jurisdictions
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.jurisdictions.map((state, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-gray-50 text-gray-700"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {state}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            {/* Dimensions - Updated UI */}
            {job.dimensions && (
              <div className="bg-blue-50 border-t border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    Oversized Load Dimensions
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Length:</span>
                    <span className="font-medium text-gray-900">
                      {job.dimensions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Width:</span>
                    <span className="font-medium text-gray-900">
                      {job.dimensions.width}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium text-gray-900">
                      {job.dimensions.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">
                      {job.dimensions.weight}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements - Simplified checklist style */}
            {(job.specialRequirements && job.specialRequirements.length > 0) && (
              <div className="border-t border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Requirements Checklist
                </p>

                <div className="space-y-2">
                  {isHighPoleRequired && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">Height Pole Required</span>
                    </div>
                  )}
                  {isPoliceEscortRequired && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-gray-700">Police Escort Required</span>
                    </div>
                  )}
                  {job.specialRequirements?.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Carrier Information */}
          {job.carrierInfo && (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  Carrier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Company
                    </p>
                    <p className="font-semibold text-gray-900 text-base">
                      {job.carrierInfo.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2"
                  >
                    View Profile
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm pt-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-1.5 rounded-full">
                      <Phone className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Contact Person
                      </p>
                      <p className="text-gray-900 font-medium">
                        {job.carrierInfo.contact}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Footer - Updated CTA */}
      {job.status === "open" && biddingStatus.isOpen && (
        <div className="flex-none bg-white border-t border-gray-200 p-4 shadow-lg z-20">
          <div className="max-w-3xl mx-auto">
            {/* Earnings Summary */}
            {selectedPositions.length > 0 && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Estimated Earnings
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-700">
                    ${calculateEstimatedEarnings().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Based on {selectedPositions.length} selected position{selectedPositions.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedPositions.length > 0 ? "Ready to bid?" : "Select positions to continue"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedPositions.length > 0 
                    ? `${selectedPositions.length} position${selectedPositions.length !== 1 ? 's' : ''} selected`
                    : "Choose one or more positions above"}
                </p>
              </div>
              <Sheet
                open={isBidSheetOpen}
                onOpenChange={setIsBidSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button 
                    className="w-full sm:w-auto min-w-[200px] h-12 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-bold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedPositions.length === 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Continue to Bid
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[85vh] sm:h-auto sm:max-w-2xl rounded-t-xl sm:rounded-l-xl overflow-y-auto"
                  aria-describedby={undefined}
                >
                  <SheetHeader className="text-left pb-4 border-b">
                    <SheetTitle>Submit Your Bid</SheetTitle>
                    <SheetDescription>
                      Enter your rates and driver information for the selected positions
                    </SheetDescription>
                  </SheetHeader>

                  <div className="py-6 space-y-6 px-1">
                    {/* Selected Positions with Bid Amounts */}
                    <div>
                      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                        Your Bid Amounts
                      </Label>
                      <div className="space-y-3">
                        {selectedPositions.map((posType) => {
                          const position = job.positions.find(p => p.type === posType);
                          if (!position) return null;
                          
                          return (
                            <div key={posType} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {posType} Pilot Car
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {position.rateType} • Market: {position.suggestedRate}
                                  </p>
                                </div>
                              </div>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder={`Enter your rate (e.g. ${position.suggestedRate?.replace('$', '')})`}
                                  value={bidAmounts[posType] || ""}
                                  onChange={(e) => setBidAmounts(prev => ({ ...prev, [posType]: e.target.value }))}
                                  className="pl-9 h-10 text-sm"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Driver & Vehicle Selection */}
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
                        Assignment Details
                      </Label>
                      
                      <div>
                        <Label htmlFor="driver" className="text-sm mb-2 block">
                          Select Driver
                        </Label>
                        <Select value={selectedDriver} onValueChange={handleDriverChange}>
                          <SelectTrigger id="driver" className="w-full">
                            <SelectValue placeholder="Choose driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockDrivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="vehicle" className="text-sm mb-2 block">
                          Select Vehicle
                        </Label>
                        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                          <SelectTrigger id="vehicle" className="w-full">
                            <SelectValue placeholder="Choose vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockVehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Bid Notes */}
                    <div>
                      <Label
                        htmlFor="bidNotes"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2"
                      >
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="bidNotes"
                        placeholder="Experience, certifications, equipment details..."
                        value={bidNotes}
                        onChange={(e) => setBidNotes(e.target.value)}
                        className="min-h-[100px] text-sm"
                      />
                    </div>

                    {/* Validation Checklist */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Submission Checklist:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          {selectedPositions.every(pos => bidAmounts[pos]) ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span className="text-gray-700">All bid amounts entered</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {selectedDriver ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span className="text-gray-700">Driver selected</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {selectedVehicle ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span className="text-gray-700">Vehicle selected</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-gray-600 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        By submitting this bid, you agree to the job requirements and schedule if accepted.
                      </p>
                    </div>
                  </div>

                  <SheetFooter className="border-t pt-4">
                    <Button
                      className="w-full bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-12 text-base font-bold shadow-sm"
                      onClick={handleSubmitBid}
                      disabled={
                        selectedPositions.length === 0 ||
                        !selectedPositions.every(pos => bidAmounts[pos]) ||
                        !selectedDriver ||
                        !selectedVehicle ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Bid
                        </>
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Closed Message */}
      {job.status === "open" && !biddingStatus.isOpen && (
        <div className="flex-none bg-gray-100 border-t border-gray-300 p-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-semibold">Bidding has closed for this job</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              This position is no longer accepting new bids
            </p>
          </div>
        </div>
      )}
    </div>
  );
}