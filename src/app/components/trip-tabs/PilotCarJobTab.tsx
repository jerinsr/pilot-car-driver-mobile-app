import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { 
  MapPin, 
  Calendar, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Truck,
  FileText,
  X,
  Search,
  Star,
  Users
} from "lucide-react";
import type { PilotCarJobInfo, LoadInfo } from "../CreateTripPage";
import AvailablePilotCarsModal from "../AvailablePilotCarsModal";
import { toast } from "sonner";

interface PilotCarJobTabProps {
  data: PilotCarJobInfo;
  onChange: (data: PilotCarJobInfo) => void;
  errors: Record<string, string>;
  loadInfo?: LoadInfo;
  tripId?: string;
  routeOrigin?: string;
  routeDestination?: string;
  routeStartDate?: string;
  routeStates?: string[];
  tripPermits?: Array<{ id: string; name: string; state: string }>;
}

// Mock pilot car data for recommendation system
const ALL_PILOT_CARS = [
  // Lead Pilot Cars
  { id: 'PC-001', company: 'Elite Escorts LLC', driver: 'John Martinez', type: 'Lead', experience: 15, rating: 5.0, jurisdictions: ['CA', 'NV', 'AZ', 'OR'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 450 },
  { id: 'PC-002', company: 'SafeRoute Escorts', driver: 'Sarah Johnson', type: 'Lead', experience: 12, rating: 4.8, jurisdictions: ['TX', 'OK', 'NM', 'LA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 380 },
  { id: 'PC-003', company: 'Priority Pilot Services', driver: 'Mike Thompson', type: 'Lead', experience: 8, rating: 4.9, jurisdictions: ['CA', 'OR', 'WA'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 250 },
  { id: 'PC-004', company: 'Western Escorts Inc', driver: 'Lisa Chen', type: 'Lead', experience: 15, rating: 4.7, jurisdictions: ['NY', 'NJ', 'PA'], availability: true, certifications: ['DOT'], totalTrips: 420 },
  { id: 'PC-005', company: 'Nationwide Pilot Cars', driver: 'David Rodriguez', type: 'Lead', experience: 10, rating: 4.6, jurisdictions: ['FL', 'GA', 'SC', 'NC'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 310 },
  
  // Chase Pilot Cars
  { id: 'PC-006', company: 'Elite Escorts LLC', driver: 'Tom Anderson', type: 'Chase', experience: 15, rating: 5.0, jurisdictions: ['CA', 'NV', 'AZ', 'OR'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 445 },
  { id: 'PC-007', company: 'SafeRoute Escorts', driver: 'Emily Davis', type: 'Chase', experience: 10, rating: 4.9, jurisdictions: ['TX', 'OK', 'NM'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 330 },
  { id: 'PC-008', company: 'Western Escorts Inc', driver: 'Robert Wilson', type: 'Chase', experience: 12, rating: 4.7, jurisdictions: ['CA', 'OR', 'WA'], availability: true, certifications: ['DOT'], totalTrips: 360 },
  { id: 'PC-009', company: 'Priority Pilot Services', driver: 'Jessica Brown', type: 'Chase', experience: 7, rating: 4.8, jurisdictions: ['NY', 'NJ', 'PA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 210 },
  
  // High Pole Pilot Cars
  { id: 'PC-010', company: 'High-Rise Escorts', driver: 'Chris Miller', type: 'High Pole', experience: 18, rating: 5.0, jurisdictions: ['CA', 'OR', 'WA', 'NV'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 520 },
  { id: 'PC-011', company: 'Elite Escorts LLC', driver: 'Amanda Garcia', type: 'High Pole', experience: 14, rating: 4.9, jurisdictions: ['NY', 'NJ', 'PA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 410 },
  { id: 'PC-012', company: 'Western Escorts Inc', driver: 'Mark Taylor', type: 'High Pole', experience: 10, rating: 4.7, jurisdictions: ['TX', 'OK', 'NM'], availability: false, certifications: ['DOT'], totalTrips: 295 },
  
  // Pole Pilot Cars
  { id: 'PC-013', company: 'Pole Masters LLC', driver: 'Jennifer White', type: 'Pole', experience: 12, rating: 4.8, jurisdictions: ['CA', 'NV', 'AZ'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 350 },
  { id: 'PC-014', company: 'SafeRoute Escorts', driver: 'Kevin Harris', type: 'Pole', experience: 9, rating: 4.6, jurisdictions: ['FL', 'GA', 'AL'], availability: true, certifications: ['DOT'], totalTrips: 270 },
  
  // Steer Pilot Cars
  { id: 'PC-015', company: 'Steer Specialists Co', driver: 'Rachel Martinez', type: 'Steer', experience: 16, rating: 5.0, jurisdictions: ['CA', 'OR', 'WA', 'NV', 'AZ'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 480 },
  { id: 'PC-016', company: 'Elite Escorts LLC', driver: 'Brian Lee', type: 'Steer', experience: 11, rating: 4.8, jurisdictions: ['TX', 'OK', 'LA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 340 },
];

export default function PilotCarJobTab({
  data,
  onChange,
  errors,
  loadInfo,
  tripId,
  routeOrigin,
  routeDestination,
  routeStartDate,
  routeStates = [],
  tripPermits = [],
}: PilotCarJobTabProps) {
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    tripDetails: true,
    pilotCar: false,
  });

  const [showJurisdictionDrawer, setShowJurisdictionDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pilot Car Allocation & Modal State
  const [allotmentPref, setAllotmentPref] = useState<'all' | 'pc-group'>('all');
  const [selectedPCGroup, setSelectedPCGroup] = useState('');
  const [showPilotCarsModal, setShowPilotCarsModal] = useState(false);
  const [recommendedPCs, setRecommendedPCs] = useState<any[]>([]);
  const [jobStatus, setJobStatus] = useState('Draft');
  const [requestedPilotCars, setRequestedPilotCars] = useState<any[]>([]);

  // Load existing requested pilot cars for open jobs
  useEffect(() => {
    if (tripId && tripId.startsWith('JOB-')) {
      // Load existing job data from mock data
      const existingJobData = getExistingJobData(tripId);
      if (existingJobData) {
        setJobStatus(existingJobData.status);
        setRequestedPilotCars(existingJobData.requestedPilotCars || []);
      }
    }
  }, [tripId]);

  // Mock function to get existing job data
  const getExistingJobData = (jobId: string) => {
    // Mock data for existing jobs
    const jobsData: Record<string, any> = {
      'JOB-105': {
        status: 'Open for Bidding',
        requestedPilotCars: [
          { 
            id: 'PC-001', 
            company: 'Elite Escorts LLC', 
            driver: 'John Martinez', 
            type: 'Lead', 
            experience: 15, 
            rating: 5.0, 
            jurisdictions: ['CA', 'NV', 'AZ', 'OR'], 
            certifications: ['DOT', 'P/EVO'], 
            totalTrips: 450,
            requestedDate: '2024-11-28'
          },
          { 
            id: 'PC-007', 
            company: 'Quick Response Pilots', 
            driver: 'Carlos Mendez', 
            type: 'Chase', 
            experience: 9, 
            rating: 4.7, 
            jurisdictions: ['AZ', 'NV', 'UT'], 
            certifications: ['DOT', 'P/EVO'], 
            totalTrips: 275,
            requestedDate: '2024-11-28'
          },
          { 
            id: 'PC-015', 
            company: 'Desert Escorts', 
            driver: 'Amanda Foster', 
            type: 'High Pole', 
            experience: 7, 
            rating: 4.8, 
            jurisdictions: ['AZ', 'NV', 'CA'], 
            certifications: ['DOT'], 
            totalTrips: 180,
            requestedDate: '2024-11-29'
          }
        ]
      },
      'JOB-104': {
        status: 'Open for Bidding',
        requestedPilotCars: [
          { 
            id: 'PC-002', 
            company: 'SafeRoute Escorts', 
            driver: 'Sarah Johnson', 
            type: 'Lead', 
            experience: 12, 
            rating: 4.8, 
            jurisdictions: ['TX', 'OK', 'NM', 'LA'], 
            certifications: ['DOT', 'P/EVO'], 
            totalTrips: 380,
            requestedDate: '2024-12-05'
          },
          { 
            id: 'PC-008', 
            company: 'Southern Safety Escorts', 
            driver: 'Rachel Williams', 
            type: 'Chase', 
            experience: 11, 
            rating: 4.9, 
            jurisdictions: ['TX', 'LA', 'AR', 'OK'], 
            certifications: ['DOT'], 
            totalTrips: 320,
            requestedDate: '2024-12-05'
          }
        ]
      }
    };

    return jobsData[jobId];
  };
  
  // US and Canadian states/provinces with full names
  const stateData: Record<string, string> = {
    // US States
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 
    'WI': 'Wisconsin', 'WY': 'Wyoming',
    // Canadian Provinces
    'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick', 
    'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia', 'NT': 'Northwest Territories', 
    'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec', 
    'SK': 'Saskatchewan', 'YT': 'Yukon'
  };

  const availableStates = Object.keys(stateData);

  // Filter states based on search query
  const filteredStates = availableStates.filter(code => {
    const fullName = stateData[code].toLowerCase();
    const query = searchQuery.toLowerCase();
    return code.toLowerCase().includes(query) || fullName.includes(query);
  });

  // Auto-populate from trip data
  useEffect(() => {
    if (loadInfo) {
      const updates: Partial<PilotCarJobInfo> = {};
      
      // Load Details
      if (loadInfo.type && !data.loadType) updates.loadType = loadInfo.type;
      if (loadInfo.description && !data.loadDescription) updates.loadDescription = loadInfo.description;
      if (loadInfo.commodityType && !data.commodityType) updates.commodityType = loadInfo.commodityType;
      if (loadInfo.specialHandling && !data.specialHandling) updates.specialHandling = loadInfo.specialHandling;
      
      // Dimensions
      if (loadInfo.length && !data.overLength) updates.overLength = loadInfo.length;
      if (loadInfo.width && !data.overWidth) updates.overWidth = loadInfo.width;
      if (loadInfo.height && !data.overHeight) updates.overHeight = loadInfo.height;
      if (loadInfo.trailerLength && !data.trailerLength) updates.trailerLength = loadInfo.trailerLength;
      if (loadInfo.loadLength && !data.loadLength) updates.loadLength = loadInfo.loadLength;
      
      // Weight
      if (loadInfo.weight && !data.grossVehicleWeight) updates.grossVehicleWeight = loadInfo.weight;
      if (loadInfo.loadWeight && !data.loadWeight) updates.loadWeight = loadInfo.loadWeight;
      
      if (Object.keys(updates).length > 0) {
        onChange({ ...data, ...updates });
      }
    }
  }, [loadInfo]);

  useEffect(() => {
    if (routeOrigin && !data.origin) {
      onChange({ ...data, origin: routeOrigin });
    }
  }, [routeOrigin]);

  useEffect(() => {
    if (routeDestination && !data.destination) {
      onChange({ ...data, destination: routeDestination });
    }
  }, [routeDestination]);

  useEffect(() => {
    if (routeStates.length > 0 && data.statesProvinces.length === 0) {
      onChange({ ...data, statesProvinces: routeStates });
    }
  }, [routeStates]);

  // Auto-populate fields when permit is selected
  useEffect(() => {
    if (data.associatedPermit && tripPermits.length > 0) {
      const selectedPermit = tripPermits.find(p => p.id === data.associatedPermit);
      if (selectedPermit && !data.jobTitle) {
        // Auto-populate job title based on permit
        const autoTitle = `${selectedPermit.state} - ${selectedPermit.name}`;
        onChange({ ...data, jobTitle: autoTitle });
      }
    }
  }, [data.associatedPermit, tripPermits]);

  const updateField = (field: keyof PilotCarJobInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSectionErrors = (fields: string[]) => {
    return fields.some(field => errors[field]);
  };

  // Pilot Car Filtering & Sorting Logic
  const filterAndSortPilotCars = () => {
    let filtered = [...ALL_PILOT_CARS];
    
    // Filter by selected pilot car types
    const selectedTypes: string[] = [];
    Object.entries(data.pilotCarTypes || {}).forEach(([key, value]: [string, any]) => {
      if (value.selected) {
        const typeMap: { [key: string]: string } = {
          'lead': 'Lead',
          'chase': 'Chase',
          'pole': 'Pole',
          'highpole': 'High Pole',
          'steer': 'Steer'
        };
        if (typeMap[key]) selectedTypes.push(typeMap[key]);
      }
    });
    
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pc => selectedTypes.includes(pc.type));
    }
    
    // Filter by route states
    if (data.statesProvinces.length > 0) {
      filtered = filtered.filter(pc => {
        return data.statesProvinces.some(state => pc.jurisdictions.includes(state));
      });
    }
    
    // Filter by availability
    filtered = filtered.filter(pc => pc.availability === true);
    
    // Sort: Type Match → Experience → Rating
    filtered.sort((a, b) => {
      // Experience descending
      if (a.experience !== b.experience) {
        return b.experience - a.experience;
      }
      // Rating descending
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return 0;
    });
    
    return filtered;
  };
  
  const handleListPilotCars = () => {
    const qualified = filterAndSortPilotCars();
    setRecommendedPCs(qualified);
    setShowPilotCarsModal(true);
  };
  
  const handleQuoteRequested = (newStatus: string, requestedPCs: any[]) => {
    setJobStatus(newStatus);
    setRequestedPilotCars(requestedPCs);
    toast.success('Job status updated', {
      description: `Job is now "${newStatus}" with ${requestedPCs.length} pilot car${requestedPCs.length !== 1 ? 's' : ''} requested`
    });
  };
  
  const handleModalClose = () => {
    setShowPilotCarsModal(false);
  };

  return (
    <div className="space-y-2 pb-4">
      {/* Section 1: Job Overview */}
      <Collapsible open={openSections.overview} onOpenChange={() => toggleSection("overview")}>
        <div className="mx-4 mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getSectionErrors(['jobTitle', 'jobType', 'startDate', 'endDate', 'associatedPermit']) ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <FileText className={`w-5 h-5 ${getSectionErrors(['jobTitle', 'jobType', 'startDate', 'endDate', 'associatedPermit']) ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Job Overview</h3>
                  <p className="text-xs text-gray-500">Basic job information</p>
                </div>
              </div>
              {openSections.overview ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              <div className="space-y-2 pt-4">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., NYC to Boston Oversize Load Escort"
                  value={data.jobTitle}
                  onChange={(e) => updateField("jobTitle", e.target.value)}
                  className={`h-12 ${errors.jobTitle ? "border-red-500" : ""}`}
                />
                {errors.jobTitle && (
                  <p className="text-xs text-red-500">{errors.jobTitle}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      data.jobType === "survey"
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateField("jobType", "survey")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.jobType === "survey" 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {data.jobType === "survey" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Survey</div>
                      <div className="text-xs text-gray-500">Route survey only</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      data.jobType === "convoy"
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateField("jobType", "convoy")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.jobType === "convoy" 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {data.jobType === "convoy" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Convoy</div>
                      <div className="text-xs text-gray-500">Escort service</div>
                    </div>
                  </label>
                </div>
                {errors.jobType && (
                  <p className="text-xs text-red-500">{errors.jobType}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={data.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className={`h-12 ${errors.startDate ? "border-red-500" : ""}`}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-500">{errors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={data.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                    min={data.startDate}
                    className={`h-12 ${errors.endDate ? "border-red-500" : ""}`}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="associatedPermit" className="text-sm font-medium">
                  Associated Permit <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.associatedPermit}
                  onValueChange={(value) => updateField("associatedPermit", value)}
                >
                  <SelectTrigger id="associatedPermit" className={`h-12 ${errors.associatedPermit ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select permit from trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {tripPermits.length > 0 ? (
                      tripPermits.map((permit) => (
                        <SelectItem key={permit.id} value={permit.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{permit.name}</span>
                            <span className="text-xs text-gray-500">{permit.state}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-permits" disabled>
                        No permits available for this trip
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.associatedPermit && (
                  <p className="text-xs text-red-500">{errors.associatedPermit}</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Section 2: Trip Information (Auto-Populated) */}
      <Collapsible open={openSections.tripDetails} onOpenChange={() => toggleSection("tripDetails")}>
        <div className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Truck className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Trip Information</h3>
                  <p className="text-xs text-gray-500">Auto-populated from trip details</p>
                </div>
              </div>
              {openSections.tripDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t border-gray-100">
              {/* Route Section */}
              <div className="pt-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Route</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="origin" className="text-sm font-medium">
                        Origin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="origin"
                        type="text"
                        placeholder="Starting location"
                        value={data.origin}
                        onChange={(e) => updateField("origin", e.target.value)}
                        className={`h-12 ${errors.origin ? "border-red-500" : ""}`}
                      />
                      {errors.origin && (
                        <p className="text-xs text-red-500">{errors.origin}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-sm font-medium">
                        Destination <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="destination"
                        type="text"
                        placeholder="Ending location"
                        value={data.destination}
                        onChange={(e) => updateField("destination", e.target.value)}
                        className={`h-12 ${errors.destination ? "border-red-500" : ""}`}
                      />
                      {errors.destination && (
                        <p className="text-xs text-red-500">{errors.destination}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      States / Provinces <span className="text-red-500">*</span>
                    </Label>
                    
                    {/* Selected States Display */}
                    <div className={`min-h-[52px] p-3 bg-white rounded-lg border-2 ${errors.statesProvinces ? 'border-red-500' : 'border-gray-200'}`}>
                      {data.statesProvinces.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {data.statesProvinces.map((state) => (
                            <span
                              key={state}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700"
                            >
                              {state}
                              <button
                                type="button"
                                onClick={() => {
                                  updateField("statesProvinces", data.statesProvinces.filter(s => s !== state));
                                }}
                                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No states selected</p>
                      )}
                    </div>

                    {/* State Selector Toggle */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowJurisdictionDrawer(true)}
                      className="w-full h-10"
                    >
                      {data.statesProvinces.length > 0 ? 'Add More States' : 'Select States'}
                    </Button>
                    
                    {errors.statesProvinces && (
                      <p className="text-xs text-red-500">{errors.statesProvinces}</p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Requested Route</p>
                        <p className="text-xs text-blue-700">
                          Route displayed on map (auto-populated from trip)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Load Details Section */}
              <div className="pt-4 pb-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Load Details</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm text-gray-600">Load Type</span>
                    <span className="text-sm font-medium text-gray-900 text-right">{data.loadType || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{data.loadDescription || 'Not specified'}</span>
                  </div>
                  
                  {/* Editable Commodity Type */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <Label htmlFor="commodityType" className="text-sm font-medium">
                      Commodity Type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="commodityType"
                      type="text"
                      placeholder="e.g., Heavy Equipment, Machinery, Steel"
                      value={data.commodityType}
                      onChange={(e) => updateField("commodityType", e.target.value)}
                      className={`h-12 ${errors.commodityType ? "border-red-500" : ""}`}
                    />
                    {errors.commodityType && (
                      <p className="text-xs text-red-500">{errors.commodityType}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Special Handling</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{data.specialHandling || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="pt-4 pb-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Dimensions</h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Height</p>
                      <p className="text-lg font-semibold text-gray-900">{data.overHeight || '0'}'</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Width</p>
                      <p className="text-lg font-semibold text-gray-900">{data.overWidth || '0'}'</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Length</p>
                      <p className="text-lg font-semibold text-gray-900">{data.overLength || '0'}'</p>
                    </div>
                  </div>
                  
                  {(data.trailerLength || data.loadLength) && (
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      {data.trailerLength && (
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm text-gray-600">Trailer Length</span>
                          <span className="text-sm font-medium text-gray-900">{data.trailerLength} ft</span>
                        </div>
                      )}
                      {data.loadLength && (
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm text-gray-600">Load Length</span>
                          <span className="text-sm font-medium text-gray-900">{data.loadLength} ft</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Weight Information Section */}
              <div className="pt-4 pb-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Weight Information</h4>
                
                <div className="space-y-3">
                  {/* Editable Gross Vehicle Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="grossVehicleWeight" className="text-sm font-medium">
                      Gross Vehicle Weight <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="grossVehicleWeight"
                        type="number"
                        placeholder="e.g., 80000"
                        value={data.grossVehicleWeight}
                        onChange={(e) => updateField("grossVehicleWeight", e.target.value)}
                        className={`h-12 pr-12 ${errors.grossVehicleWeight ? "border-red-500" : ""}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">lbs</span>
                    </div>
                    {errors.grossVehicleWeight && (
                      <p className="text-xs text-red-500">{errors.grossVehicleWeight}</p>
                    )}
                  </div>

                  {/* Read-only Load Weight */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Load Weight (Optional)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {data.loadWeight ? parseInt(data.loadWeight).toLocaleString() : 'Not specified'} {data.loadWeight && <span className="text-sm font-normal text-gray-600">lbs</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Load Image Section */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Load Image</h4>
                
                <div className="w-full h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">From trip details</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Section 3: Pilot Car Requirements */}
      <Collapsible open={openSections.pilotCar} onOpenChange={() => toggleSection("pilotCar")}>
        <div className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getSectionErrors(['pilotCarTypes']) ? 'bg-red-100' : 'bg-emerald-100'}`}>
                  <Shield className={`w-5 h-5 ${getSectionErrors(['pilotCarTypes']) ? 'text-red-600' : 'text-emerald-600'}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Pilot Car Requirements</h3>
                  <p className="text-xs text-gray-500">Required pilot car types</p>
                </div>
              </div>
              {openSections.pilotCar ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              <div className="space-y-3 pt-4">
                <Label className="text-sm font-medium">
                  Pilot Car Types <span className="text-red-500">*</span>
                </Label>
                
                {["Lead", "Chase", "Pole", "High-Pole", "Steer"].map((type) => {
                  const typeKey = type.toLowerCase().replace("-", "");
                  const isSelected = data.pilotCarTypes?.[typeKey]?.selected || false;
                  const count = data.pilotCarTypes?.[typeKey]?.count || 1;

                  return (
                    <div key={type} className="space-y-2">
                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            updateField("pilotCarTypes", {
                              ...data.pilotCarTypes,
                              [typeKey]: {
                                selected: checked,
                                count: checked ? count : 0,
                              },
                            });
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{type}</div>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`${typeKey}-count`} className="text-sm whitespace-nowrap">
                              Quantity:
                            </Label>
                            <Input
                              id={`${typeKey}-count`}
                              type="number"
                              min="1"
                              placeholder="1"
                              value={count}
                              onChange={(e) => {
                                updateField("pilotCarTypes", {
                                  ...data.pilotCarTypes,
                                  [typeKey]: {
                                    selected: true,
                                    count: parseInt(e.target.value) || 1,
                                  },
                                });
                              }}
                              className="h-10 w-20"
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
                
                {errors.pilotCarTypes && (
                  <p className="text-xs text-red-500">{errors.pilotCarTypes}</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Section 4: Pilot Car Allocation */}
      <div className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pilot Car Allocation</h3>
                <p className="text-xs text-gray-500">
                  {jobStatus === 'Draft' ? 'Select qualified pilot cars' : `Status: ${jobStatus}`}
                </p>
              </div>
            </div>
            <Button
              onClick={handleListPilotCars}
              size="sm"
              disabled={Object.values(data.pilotCarTypes || {}).every((v: any) => !v.selected)}
              className="bg-[#0066cc] hover:bg-blue-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              List PCs
            </Button>
          </div>
          
          {Object.values(data.pilotCarTypes || {}).every((v: any) => !v.selected) && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Please select at least one Pilot Car Type above to list qualified pilot cars
              </p>
            </div>
          )}
        </div>

        {/* Requested Pilot Cars List */}
        {requestedPilotCars.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Requested Pilot Cars</h4>
              <Badge className="bg-green-500 text-white text-xs">
                {requestedPilotCars.length} Quote{requestedPilotCars.length !== 1 ? 's' : ''} Requested
              </Badge>
            </div>
            
            <div className="space-y-2">
              {requestedPilotCars.map((pc) => (
                <div key={pc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-sm text-gray-900">{pc.driver}</h5>
                        <Badge className="bg-[#0066cc] text-white text-xs">{pc.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{pc.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{pc.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-900">{pc.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{pc.experience} yrs exp</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {pc.jurisdictions.slice(0, 3).join(', ')}
                        {pc.jurisdictions.length > 3 && ` +${pc.jurisdictions.length - 3}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-gray-600">
                        {pc.certifications.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Quote Status:</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending Response
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Pilot Cars Modal */}
      <AvailablePilotCarsModal
        isOpen={showPilotCarsModal}
        onClose={handleModalClose}
        pilotCars={recommendedPCs}
        jobId={tripId || 'JOB-NEW'}
        allocationMode={allotmentPref}
        onQuoteRequested={handleQuoteRequested}
      />

      {/* Jurisdiction Selection Drawer */}
      <Drawer open={showJurisdictionDrawer} onOpenChange={setShowJurisdictionDrawer}>
        <DrawerContent className="h-[90vh] max-h-[90vh]" aria-describedby={undefined}>
          <DrawerTitle className="sr-only">Select Jurisdictions</DrawerTitle>
          <DrawerDescription className="sr-only">
            Choose the states and provinces that your load will pass through during transport
          </DrawerDescription>

          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Select Jurisdictions</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {data.statesProvinces.length} {data.statesProvinces.length === 1 ? 'jurisdiction' : 'jurisdictions'} selected
              </p>
            </div>
            <button
              onClick={() => setShowJurisdictionDrawer(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="p-4 bg-white border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search states or provinces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              {filteredStates.map((code) => {
                const isSelected = data.statesProvinces.includes(code);
                const fullName = stateData[code];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        updateField("statesProvinces", data.statesProvinces.filter(s => s !== code));
                      } else {
                        updateField("statesProvinces", [...data.statesProvinces, code]);
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{code}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{fullName}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
            <Button
              onClick={() => setShowJurisdictionDrawer(false)}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Done ({data.statesProvinces.length})
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}