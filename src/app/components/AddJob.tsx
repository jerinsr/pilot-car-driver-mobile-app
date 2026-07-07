import { useState, useEffect } from 'react';
import { ChevronDown, Upload, MapPin, Calendar, Plus, X, Search, Flag, Truck, Info, CheckCircle2, Star, Phone, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import Header from './Header';
import { Badge } from './ui/badge';
import AvailablePilotCarsModal from './AvailablePilotCarsModal';
import { toast } from 'sonner';

interface AddJobProps {
  onBack: () => void;
  onSave?: (data: any) => void;
  showHeader?: boolean;
  tripId?: string;
  tripData?: {
    origin: string;
    destination: string;
    states: string[];
    load?: {
      type: string;
      description: string;
      width: string;
      height: string;
      length: string;
      weight: string;
    };
  };
  tripPermits?: any[];
}

// Mock permits data for import
const MOCK_PERMITS = [
  {
    id: '1',
    requestId: 'REQ-1001',
    permitNumber: 'PER-2024-91A',
    origin: 'New York, NY',
    destination: 'Miami, FL',
    effectiveDate: '2024-12-05',
    expiryDate: '2024-12-15',
    load: { 
      type: 'Excavator', 
      description: 'Heavy machinery transport', 
      width: '8.5', 
      height: '10', 
      length: '20', 
      weight: '45,000' 
    }
  },
  {
    id: '2',
    requestId: 'REQ-1002',
    permitNumber: 'PER-2024-92B',
    origin: 'Los Angeles, CA',
    destination: 'San Francisco, CA',
    effectiveDate: '2024-12-10',
    expiryDate: '2024-12-20',
    load: { 
      type: 'Bulldozer', 
      description: 'Construction Equipment', 
      width: '9', 
      height: '11', 
      length: '22', 
      weight: '45,000' 
    }
  },
  {
    id: '3',
    requestId: 'REQ-1003',
    origin: 'Dallas, TX',
    destination: 'Phoenix, AZ',
    effectiveDate: '2024-12-12',
    expiryDate: '2024-12-22',
    load: { 
      type: 'Industrial Equipment', 
      description: 'Oversized industrial machinery', 
      width: '10.5', 
      height: '12', 
      length: '25', 
      weight: '52,000' 
    }
  }
];

// Mock pilot car groups data
const PILOT_CAR_GROUPS = [
  {
    id: 'group-a',
    name: 'Priority Escorts (Group A)',
    companyCount: 12,
    vehicleCount: 45,
    rating: 4.8,
    responseTime: '2-4 hours',
    coverage: 'Multi-state (NY, NJ, PA, MD, VA, NC, SC, GA, FL)',
    specialization: 'Heavy haul, oversized loads',
    certifications: ['DOT Certified', 'P/EVO Certified', 'Hazmat Endorsed'],
    contactName: 'Regional Coordinator',
    contactPhone: '(555) 123-4567',
    vehicleTypes: ['High Pole', 'Lead', 'Chase']
  },
  {
    id: 'group-b',
    name: 'Secondary Fleet (Group B)',
    companyCount: 8,
    vehicleCount: 28,
    rating: 4.5,
    responseTime: '4-8 hours',
    coverage: 'Regional (TX, OK, NM, AZ)',
    specialization: 'Standard escort, wind turbine transport',
    certifications: ['DOT Certified', 'P/EVO Certified'],
    contactName: 'Fleet Manager',
    contactPhone: '(555) 987-6543',
    vehicleTypes: ['Lead', 'Chase']
  },
  {
    id: 'group-c',
    name: 'Western Corridor Escorts (Group C)',
    companyCount: 15,
    vehicleCount: 52,
    rating: 4.9,
    responseTime: '1-3 hours',
    coverage: 'West Coast (CA, OR, WA, NV)',
    specialization: 'All types, 24/7 availability',
    certifications: ['DOT Certified', 'P/EVO Certified', 'Hazmat Endorsed', 'TWIC Card'],
    contactName: 'Operations Director',
    contactPhone: '(555) 456-7890',
    vehicleTypes: ['High Pole', 'Lead', 'Chase', 'Police Escort']
  }
];

// Mock individual pilot cars data for recommendation system
const ALL_PILOT_CARS = [
  // Lead Pilot Cars
  { id: 'PC-001', company: 'Elite Escorts LLC', driver: 'John Martinez', type: 'Lead', experience: 15, rating: 5.0, jurisdictions: ['CA', 'NV', 'AZ', 'OR'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 450 },
  { id: 'PC-002', company: 'SafeRoute Escorts', driver: 'Sarah Johnson', type: 'Lead', experience: 12, rating: 4.8, jurisdictions: ['TX', 'OK', 'NM', 'LA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 380 },
  { id: 'PC-003', company: 'Priority Pilot Services', driver: 'Mike Thompson', type: 'Lead', experience: 8, rating: 4.9, jurisdictions: ['CA', 'OR', 'WA'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 250 },
  { id: 'PC-004', company: 'Western Escorts Inc', driver: 'Lisa Chen', type: 'Lead', experience: 15, rating: 4.7, jurisdictions: ['CA', 'NV', 'AZ'], availability: false, certifications: ['DOT'], totalTrips: 420 },
  { id: 'PC-005', company: 'Nationwide Pilot Cars', driver: 'David Rodriguez', type: 'Lead', experience: 10, rating: 4.6, jurisdictions: ['FL', 'GA', 'SC', 'NC'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 310 },
  
  // Chase Pilot Cars
  { id: 'PC-006', company: 'Elite Escorts LLC', driver: 'Tom Anderson', type: 'Chase', experience: 15, rating: 5.0, jurisdictions: ['CA', 'NV', 'AZ', 'OR'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 445 },
  { id: 'PC-007', company: 'SafeRoute Escorts', driver: 'Emily Davis', type: 'Chase', experience: 10, rating: 4.9, jurisdictions: ['TX', 'OK', 'NM'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 330 },
  { id: 'PC-008', company: 'Western Escorts Inc', driver: 'Robert Wilson', type: 'Chase', experience: 12, rating: 4.7, jurisdictions: ['CA', 'OR', 'WA'], availability: true, certifications: ['DOT'], totalTrips: 360 },
  { id: 'PC-009', company: 'Priority Pilot Services', driver: 'Jessica Brown', type: 'Chase', experience: 7, rating: 4.8, jurisdictions: ['CA', 'NV'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 210 },
  
  // High Pole Pilot Cars
  { id: 'PC-010', company: 'High-Rise Escorts', driver: 'Chris Miller', type: 'High Pole', experience: 18, rating: 5.0, jurisdictions: ['CA', 'OR', 'WA', 'NV'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 520 },
  { id: 'PC-011', company: 'Elite Escorts LLC', driver: 'Amanda Garcia', type: 'High Pole', experience: 14, rating: 4.9, jurisdictions: ['CA', 'AZ', 'NV'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 410 },
  { id: 'PC-012', company: 'Western Escorts Inc', driver: 'Mark Taylor', type: 'High Pole', experience: 10, rating: 4.7, jurisdictions: ['TX', 'OK', 'NM'], availability: false, certifications: ['DOT'], totalTrips: 295 },
  
  // Pole Pilot Cars
  { id: 'PC-013', company: 'Pole Masters LLC', driver: 'Jennifer White', type: 'Pole', experience: 12, rating: 4.8, jurisdictions: ['CA', 'NV', 'AZ'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 350 },
  { id: 'PC-014', company: 'SafeRoute Escorts', driver: 'Kevin Harris', type: 'Pole', experience: 9, rating: 4.6, jurisdictions: ['FL', 'GA', 'AL'], availability: true, certifications: ['DOT'], totalTrips: 270 },
  
  // Steer Pilot Cars
  { id: 'PC-015', company: 'Steer Specialists Co', driver: 'Rachel Martinez', type: 'Steer', experience: 16, rating: 5.0, jurisdictions: ['CA', 'OR', 'WA', 'NV', 'AZ'], availability: true, certifications: ['DOT', 'P/EVO', 'Hazmat'], totalTrips: 480 },
  { id: 'PC-016', company: 'Elite Escorts LLC', driver: 'Brian Lee', type: 'Steer', experience: 11, rating: 4.8, jurisdictions: ['TX', 'OK', 'LA'], availability: true, certifications: ['DOT', 'P/EVO'], totalTrips: 340 },
];

// Helper function to extract state codes from route
const extractStatesFromRoute = (from: string, to: string): string[] => {
  const statePattern = /[A-Z]{2}$/;
  const states: string[] = [];
  
  const fromMatch = from.match(statePattern);
  const toMatch = to.match(statePattern);
  
  if (fromMatch) states.push(fromMatch[0]);
  if (toMatch && toMatch[0] !== fromMatch?.[0]) states.push(toMatch[0]);
  
  return states;
};

export default function AddJob({ onBack, onSave, showHeader = true, tripId, tripData, tripPermits }: AddJobProps) {
  const [selectedPermit, setSelectedPermit] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [requiredVehicleType, setRequiredVehicleType] = useState('');
  const [numberOfVehicles, setNumberOfVehicles] = useState('1');
  const [jobNature, setJobNature] = useState('');
  const [freightDesc, setFreightDesc] = useState('');
  const [commodityClass, setCommodityClass] = useState('');
  const [commodityType, setCommodityType] = useState('');
  
  // Load Details
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Route
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isPrespecifiedRoute, setIsPrespecifiedRoute] = useState('no');
  const [isRouteSurveyRequired, setIsRouteSurveyRequired] = useState('no');
  
  // Dates
  const [dateType, setDateType] = useState('date-range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pricing
  const [priceType, setPriceType] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [layoverCost, setLayoverCost] = useState('');
  const [surveyFlat, setSurveyFlat] = useState('');
  const [surveyMileage, setSurveyMileage] = useState('');

  // Allocation
  const [allotmentPref, setAllotmentPref] = useState('pc-group');
  const [pcGroup, setPcGroup] = useState('');
  const [additionalConditions, setAdditionalConditions] = useState('');

  // Pilot Car Recommendation System
  const [showRecommendedPCs, setShowRecommendedPCs] = useState(false);
  const [recommendedPCs, setRecommendedPCs] = useState<any[]>([]);
  const [selectedPCs, setSelectedPCs] = useState<string[]>([]);

  // Job Status & Modal State
  const [jobStatus, setJobStatus] = useState<string>('Draft');
  const [showPilotCarsModal, setShowPilotCarsModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string>('JOB-NEW');

  // Handle permit selection and auto-populate
  const handlePermitSelect = (permitId: string) => {
    setSelectedPermit(permitId);
    
    const permit = MOCK_PERMITS.find(p => p.id === permitId);
    if (permit) {
      // Auto-populate Job Overview
      setJobTitle(`Pilot Car for ${permit.requestId}`);
      
      // Auto-populate Freight Details
      if (permit.load) {
        setFreightDesc(permit.load.description);
        setHeight(permit.load.height);
        setWidth(permit.load.width);
        setLength(permit.load.length);
        setWeight(permit.load.weight);
      }
      
      // Auto-populate Route
      setFromLocation(permit.origin);
      setToLocation(permit.destination);
      
      // Auto-populate Dates
      setStartDate(permit.effectiveDate);
      setEndDate(permit.expiryDate);
    }
  };

  // Auto-populate from trip data on mount
  useEffect(() => {
    if (tripData) {
      // Auto-populate Route Information from trip
      if (tripData.origin) setFromLocation(tripData.origin);
      if (tripData.destination) setToLocation(tripData.destination);
      
      // Auto-populate Load Details from trip
      if (tripData.load) {
        if (tripData.load.type) setFreightDesc(tripData.load.type);
        if (tripData.load.description) setFreightDesc(tripData.load.description);
        if (tripData.load.height) setHeight(tripData.load.height);
        if (tripData.load.width) setWidth(tripData.load.width);
        if (tripData.load.length) setLength(tripData.load.length);
        if (tripData.load.weight) setWeight(tripData.load.weight);
      }
    }
  }, [tripData]);

  // Filter permits to show only those associated with the trip
  const availablePermits = tripPermits && tripPermits.length > 0 
    ? tripPermits 
    : MOCK_PERMITS;

  // ========================================
  // INTELLIGENT PILOT CAR RECOMMENDATION SYSTEM
  // ========================================
  
  /**
   * Step 1: Qualification Filtering
   * - Filters based on Required Pilot Car Type(s)
   * - Route & State/Province coverage
   * - Job dimensions and load constraints
   * - Pilot car availability
   */
  const filterQualifiedPilotCars = () => {
    let filtered = [...ALL_PILOT_CARS];
    
    // Filter by Required Vehicle Type
    if (requiredVehicleType) {
      const typeMap: { [key: string]: string } = {
        'high-pole': 'High Pole',
        'chase': 'Chase',
        'lead': 'Lead',
        'pole': 'Pole',
        'steer': 'Steer'
      };
      const matchType = typeMap[requiredVehicleType];
      filtered = filtered.filter(pc => pc.type === matchType);
    }
    
    // Filter by Route Coverage (State/Province jurisdictions)
    if (fromLocation || toLocation) {
      const requiredStates = extractStatesFromRoute(fromLocation, toLocation);
      if (requiredStates.length > 0) {
        filtered = filtered.filter(pc => {
          return requiredStates.some(state => pc.jurisdictions.includes(state));
        });
      }
    }
    
    // Filter by Availability
    filtered = filtered.filter(pc => pc.availability === true);
    
    return filtered;
  };
  
  /**
   * Step 2-4: Hierarchical Sorting
   * Primary: Pilot Car Type match (requested type first)
   * Secondary: Years of Experience (descending)
   * Tertiary: Rating (descending)
   */
  const sortPilotCars = (pilotCars: any[]) => {
    const typeMap: { [key: string]: string } = {
      'high-pole': 'High Pole',
      'chase': 'Chase',
      'lead': 'Lead',
      'pole': 'Pole',
      'steer': 'Steer'
    };
    const requestedType = requiredVehicleType ? typeMap[requiredVehicleType] : '';
    
    return pilotCars.sort((a, b) => {
      // Priority 1: Pilot Car Type Match (requested type first)
      const aTypeMatch = a.type === requestedType ? 1 : 0;
      const bTypeMatch = b.type === requestedType ? 1 : 0;
      if (aTypeMatch !== bTypeMatch) {
        return bTypeMatch - aTypeMatch; // Requested type first
      }
      
      // Priority 2: Years of Experience (highest first)
      if (a.experience !== b.experience) {
        return b.experience - a.experience;
      }
      
      // Priority 3: Rating (highest first)
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      
      return 0;
    });
  };
  
  /**
   * Trigger Recommendation Logic
   * Only when "All Qualified Pilot Cars" is selected and user clicks "List PCs"
   */
  const handleListPilotCars = () => {
    // Step 1: Filter qualified pilot cars
    const qualified = filterQualifiedPilotCars();
    
    // Step 2-4: Apply hierarchical sorting
    const sorted = sortPilotCars(qualified);
    
    // Set results and open modal
    setRecommendedPCs(sorted);
    setShowPilotCarsModal(true);
  };
  
  // Handle quote request callback
  const handleQuoteRequested = (newStatus: string) => {
    setJobStatus(newStatus);
    toast.success('Job status updated', {
      description: `Job is now "${newStatus}"`
    });
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setShowPilotCarsModal(false);
    
    // If job status changed to "Open for Bidding", navigate back
    if (jobStatus === 'Open for Bidding') {
      toast.success('Job posted successfully', {
        description: 'Pilot cars have been notified and bidding is now open'
      });
      
      // Navigate back to job list after a short delay
      setTimeout(() => {
        onBack();
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] w-full">
      {showHeader && (
        <div className="flex-none">
          <Header 
            title="Add Job" 
            showBackButton={true} 
            onBack={onBack}
          />
        </div>
      )}

      <ScrollArea className="flex-1 -mt-[20px] relative z-20 rounded-t-[20px] bg-[#f6f6f6] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="p-4 pb-32 space-y-5 max-w-3xl mx-auto">
          
          {/* Import Section */}
          <Card className="p-4 border border-blue-100 bg-blue-50/50 shadow-sm">
            <div className="flex items-start gap-3">
               <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                  <Search className="w-5 h-5" />
               </div>
               <div className="flex-1 space-y-2">
                  <Label className="text-base font-bold text-gray-900">Import from Existing Permit</Label>
                  <p className="text-sm text-gray-500 mb-2">Auto-fill details from an active permit request.</p>
                  <Select value={selectedPermit} onValueChange={handlePermitSelect}>
                     <SelectTrigger className="w-full bg-white border-blue-200 focus:ring-blue-500 h-11">
                        <SelectValue placeholder="Select permit to import..." />
                     </SelectTrigger>
                     <SelectContent>
                        {availablePermits.map(permit => (
                          <SelectItem key={permit.id} value={permit.id}>
                            {permit.requestId} ({permit.origin} → {permit.destination})
                          </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  {selectedPermit && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Form auto-populated with permit data</span>
                    </div>
                  )}
               </div>
            </div>
          </Card>

          {/* Job Overview */}
          <Card className="p-5 shadow-sm border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <span className="w-1 h-5 bg-[#0066cc] rounded-full"></span>
               Job Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label>Job Title</Label>
                <Input 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  placeholder="e.g. Heavy Haul to Dallas"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Required Vehicle Type</Label>
                <Select value={requiredVehicleType} onValueChange={setRequiredVehicleType}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-pole">High Pole</SelectItem>
                    <SelectItem value="chase">Chase</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Vehicles</Label>
                <Select value={numberOfVehicles} onValueChange={setNumberOfVehicles}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Nature</Label>
                <Select value={jobNature} onValueChange={setJobNature}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select nature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way">One Way</SelectItem>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label className="flex items-center gap-2">
                   Disclaimer 
                   <Info className="w-3 h-3 text-gray-400" />
                </Label>
                <div className="text-xs text-gray-600 border border-amber-100 bg-amber-50 p-3 rounded-lg flex gap-2">
                  <span className="font-bold text-amber-600">Note:</span>
                  State the location for which Pilot Cars are not going to receive any payment.
                </div>
              </div>
            </div>
          </Card>

          {/* Freight Details */}
          <Card className="p-5 shadow-sm border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <span className="w-1 h-5 bg-[#0066cc] rounded-full"></span>
               Freight & Load
            </h2>
            
            <div className="mb-6">
               <Label className="mb-2 block">Freight Image</Label>
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                     <Upload className="w-6 h-6 text-[#0066cc]" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
               </div>
            </div>

            <div className="space-y-5">
               <div className="space-y-2">
                  <Label>Freight Description</Label>
                  <Textarea 
                     value={freightDesc} 
                     onChange={(e) => setFreightDesc(e.target.value)} 
                     placeholder="Describe the load..."
                     className="min-h-[80px] bg-gray-50 border-gray-200"
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Class</Label>
                     <Select value={commodityClass} onValueChange={setCommodityClass}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                           <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="class-a">Class A</SelectItem>
                           <SelectItem value="class-b">Class B</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>Type</Label>
                     <Select value={commodityType} onValueChange={setCommodityType}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                           <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="machinery">Machinery</SelectItem>
                           <SelectItem value="construction">Construction</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Height</Label>
                     <Input value={height} onChange={(e) => setHeight(e.target.value)} className="bg-gray-50 border-gray-200" placeholder="0 ft" />
                  </div>
                  <div className="space-y-2">
                     <Label>Width</Label>
                     <Input value={width} onChange={(e) => setWidth(e.target.value)} className="bg-gray-50 border-gray-200" placeholder="0 ft" />
                  </div>
                  <div className="space-y-2">
                     <Label>Length</Label>
                     <Input value={length} onChange={(e) => setLength(e.target.value)} className="bg-gray-50 border-gray-200" placeholder="0 ft" />
                  </div>
                  <div className="space-y-2">
                     <Label>Weight</Label>
                     <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-gray-50 border-gray-200" placeholder="0 lbs" />
                  </div>
               </div>
            </div>
          </Card>

          {/* Route Information */}
          <Card className="p-5 shadow-sm border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <span className="w-1 h-5 bg-[#0066cc] rounded-full"></span>
               Route & Schedule
            </h2>
            
            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 mb-6">
               <div className="relative">
                  <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  <Label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Origin</Label>
                  <div className="relative">
                     <Input value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="bg-gray-50 border-gray-200 pr-9" placeholder="Enter pickup location" />
                     <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
               </div>
               
               <div className="relative">
                  <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                  <Label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Destination</Label>
                  <div className="relative">
                     <Input value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="bg-gray-50 border-gray-200 pr-9" placeholder="Enter dropoff location" />
                     <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center transition-all hover:bg-gray-100/80">
                  <div className="space-y-0.5">
                     <Label className="text-sm font-semibold text-gray-900">Pre-specified Route</Label>
                     <p className="text-xs text-gray-500">Do you have a specific path required?</p>
                  </div>
                  <Switch 
                     checked={isPrespecifiedRoute === 'yes'}
                     onCheckedChange={(checked) => setIsPrespecifiedRoute(checked ? 'yes' : 'no')}
                  />
               </div>

               {isPrespecifiedRoute === 'yes' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
                     <div className="flex justify-between items-center">
                        <Label>Driving Directions</Label>
                        <Button variant="link" size="sm" className="text-[#0066cc] h-auto p-0">View Map</Button>
                     </div>
                     <div className="border border-gray-200 rounded-lg p-4 text-sm bg-white space-y-3 max-h-[140px] overflow-y-auto shadow-sm">
                        <div className="flex gap-3">
                           <div className="mt-1 min-w-[16px]"><Flag className="w-4 h-4 text-green-600" /></div>
                           <p className="text-gray-600">Begin traveling on Road due North</p>
                        </div>
                        <div className="flex gap-3">
                           <div className="mt-1 min-w-[16px] w-4 h-4 rounded-full border-2 border-gray-300" />
                           <p className="text-gray-600">After 0.355 km turn right onto 92 Avenue due East</p>
                        </div>
                        <div className="flex gap-3">
                           <div className="mt-1 min-w-[16px] w-4 h-4 rounded-full border-2 border-gray-300" />
                           <p className="text-gray-600">After 230.9 km continue on 44 Street</p>
                        </div>
                     </div>
                  </div>
               )}

               <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center transition-all hover:bg-gray-100/80">
                  <div className="space-y-0.5">
                     <Label className="text-sm font-semibold text-gray-900">Route Survey Required</Label>
                     <p className="text-xs text-gray-500">Is a route survey mandatory?</p>
                  </div>
                  <Switch 
                     checked={isRouteSurveyRequired === 'yes'}
                     onCheckedChange={(checked) => setIsRouteSurveyRequired(checked ? 'yes' : 'no')}
                  />
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Start Date</Label>
                     <div className="relative">
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-50 border-gray-200" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>End Date</Label>
                     <div className="relative">
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-gray-50 border-gray-200" />
                     </div>
                  </div>
               </div>
            </div>
          </Card>

          {/* Pricing & Allocation */}
          <Card className="p-5 shadow-sm border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <span className="w-1 h-5 bg-[#0066cc] rounded-full"></span>
               Pricing & Allocation
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={priceType} onValueChange={setPriceType}>
                     <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="per-mile">Per Mile</SelectItem>
                        <SelectItem value="flat-rate">Flat Rate</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label>Rate</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                     <Input value={priceValue} onChange={(e) => setPriceValue(e.target.value)} className="pl-7 bg-gray-50 border-gray-200" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">Allocation Settings</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center transition-all hover:bg-gray-100/80">
                     <div className="space-y-0.5">
                        <Label className="text-sm font-semibold text-gray-900">Restrict to Specific Group</Label>
                        <p className="text-xs text-gray-500">Only allow selected pilot car groups to see this job</p>
                     </div>
                     <Switch 
                        checked={allotmentPref === 'pc-group'}
                        onCheckedChange={(checked) => setAllotmentPref(checked ? 'pc-group' : 'all')}
                     />
                  </div>
               </div>

               {allotmentPref === 'pc-group' && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-1 space-y-4">
                     <Label className="mb-2 block">Select Group</Label>
                     <Select value={pcGroup} onValueChange={setPcGroup}>
                        <SelectTrigger className="bg-white border-gray-300">
                           <SelectValue placeholder="Select pilot car group..." />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="group-a">Priority Escorts (Group A)</SelectItem>
                           <SelectItem value="group-b">Secondary Fleet (Group B)</SelectItem>
                           <SelectItem value="group-c">Western Corridor Escorts (Group C)</SelectItem>
                        </SelectContent>
                     </Select>
                     
                     {/* Group Details */}
                     {pcGroup && (() => {
                       const selectedGroup = PILOT_CAR_GROUPS.find(g => g.id === pcGroup);
                       if (!selectedGroup) return null;
                       
                       return (
                         <Card className="border border-[#0066cc] bg-blue-50/30 shadow-sm animate-in fade-in slide-in-from-top-2">
                           <div className="p-4 space-y-4">
                             {/* Header */}
                             <div className="flex items-start justify-between">
                               <div className="flex-1">
                                 <h4 className="font-bold text-gray-900 text-base mb-1">{selectedGroup.name}</h4>
                                 <div className="flex items-center gap-3 text-sm">
                                   <div className="flex items-center gap-1 text-amber-600">
                                     <Star className="w-4 h-4 fill-amber-500" />
                                     <span className="font-medium">{selectedGroup.rating}</span>
                                   </div>
                                   <div className="flex items-center gap-1 text-gray-600">
                                     <Clock className="w-4 h-4" />
                                     <span>{selectedGroup.responseTime}</span>
                                   </div>
                                 </div>
                               </div>
                             </div>
                             
                             {/* Stats Grid */}
                             <div className="grid grid-cols-2 gap-3">
                               <div className="bg-white p-3 rounded-lg border border-gray-200">
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Companies</p>
                                 <p className="text-xl font-bold text-gray-900">{selectedGroup.companyCount}</p>
                               </div>
                               <div className="bg-white p-3 rounded-lg border border-gray-200">
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Vehicles</p>
                                 <p className="text-xl font-bold text-gray-900">{selectedGroup.vehicleCount}</p>
                               </div>
                             </div>
                             
                             {/* Details */}
                             <div className="space-y-3">
                               <div>
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Coverage Area</p>
                                 <p className="text-sm text-gray-900">{selectedGroup.coverage}</p>
                               </div>
                               
                               <div>
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Specialization</p>
                                 <p className="text-sm text-gray-900">{selectedGroup.specialization}</p>
                               </div>
                               
                               <div>
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Vehicle Types</p>
                                 <div className="flex flex-wrap gap-1.5 mt-1">
                                   {selectedGroup.vehicleTypes.map((vehicle, idx) => (
                                     <Badge key={idx} variant="secondary" className="bg-white text-gray-700 border-gray-200 text-xs">
                                       <Truck className="w-3 h-3 mr-1" />
                                       {vehicle}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                               
                               <div>
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-1">Certifications</p>
                                 <div className="flex flex-wrap gap-1.5 mt-1">
                                   {selectedGroup.certifications.map((cert, idx) => (
                                     <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                       <Shield className="w-3 h-3 mr-1" />
                                       {cert}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                               
                               {/* Contact */}
                               <div className="pt-3 border-t border-gray-200">
                                 <p className="text-xs text-gray-500 font-medium uppercase mb-2">Primary Contact</p>
                                 <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1.5">
                                   <div className="flex items-center justify-between">
                                     <span className="text-sm text-gray-600">Contact Person</span>
                                     <span className="text-sm font-medium text-gray-900">{selectedGroup.contactName}</span>
                                   </div>
                                   <div className="flex items-center justify-between">
                                     <span className="text-sm text-gray-600">Phone</span>
                                     <div className="flex items-center gap-1.5 text-sm font-medium text-[#0066cc]">
                                       <Phone className="w-3.5 h-3.5" />
                                       {selectedGroup.contactPhone}
                                     </div>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </Card>
                       );
                     })()}
                  </div>
               )}
               
               {/* All Qualified Pilot Cars Section */}
               {allotmentPref === 'all' && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-1 space-y-4">
                     <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Open to All Qualified Pilot Cars</Label>
                        <Button 
                           onClick={handleListPilotCars}
                           variant="outline"
                           size="sm"
                           className="border-[#0066cc] text-[#0066cc] hover:bg-blue-50"
                        >
                           <Search className="w-4 h-4 mr-2" />
                           List PCs
                        </Button>
                     </div>
                     
                     {/* Recommended Pilot Cars Results */}
                     {showRecommendedPCs && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                           <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                 <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                 <div>
                                    <p className="text-sm font-bold text-blue-900">
                                       {recommendedPCs.length} Qualified Pilot Car{recommendedPCs.length !== 1 ? 's' : ''} Found
                                    </p>
                                    <p className="text-xs text-blue-700">
                                       Sorted by Type Match → Experience → Rating
                                    </p>
                                 </div>
                              </div>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => setShowRecommendedPCs(false)}
                                 className="h-auto p-1 hover:bg-blue-100"
                              >
                                 <X className="w-4 h-4 text-blue-600" />
                              </Button>
                           </div>
                           
                           {recommendedPCs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                 <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                 <p className="text-sm font-medium">No qualified pilot cars found</p>
                                 <p className="text-xs mt-1">Try adjusting your requirements or route</p>
                              </div>
                           ) : (
                              <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                                 {recommendedPCs.map((pc, index) => {
                                    const isSelected = selectedPCs.includes(pc.id);
                                    const isTopMatch = index === 0;
                                    
                                    return (
                                       <Card 
                                          key={pc.id} 
                                          className={`p-4 cursor-pointer transition-all border-2 ${isSelected ? 'border-[#0066cc] bg-blue-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'} ${isTopMatch ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                          onClick={() => togglePCSelection(pc.id)}
                                       >
                                          {isTopMatch && (
                                             <div className="absolute -top-2 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                                BEST MATCH
                                             </div>
                                          )}
                                          
                                          <div className="flex items-start justify-between gap-3">
                                             <div className="flex-1 space-y-2">
                                                {/* Header */}
                                                <div className="flex items-center gap-2">
                                                   <Badge variant="secondary" className="bg-[#0066cc] text-white text-xs font-bold">
                                                      {pc.type}
                                                   </Badge>
                                                   <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                                                   {isSelected && (
                                                      <Badge className="bg-green-500 text-white text-xs">
                                                         <CheckCircle2 className="w-3 h-3 mr-1" />
                                                         Selected
                                                      </Badge>
                                                   )}
                                                </div>
                                                
                                                {/* Company & Driver */}
                                                <div>
                                                   <h4 className="font-bold text-gray-900 text-sm">{pc.company}</h4>
                                                   <p className="text-xs text-gray-600">{pc.driver}</p>
                                                </div>
                                                
                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-3 gap-2 pt-2">
                                                   <div className="bg-white p-2 rounded border border-gray-200">
                                                      <p className="text-[10px] text-gray-500 uppercase font-bold">Experience</p>
                                                      <p className="text-sm font-bold text-gray-900">{pc.experience} yrs</p>
                                                   </div>
                                                   <div className="bg-white p-2 rounded border border-gray-200">
                                                      <p className="text-[10px] text-gray-500 uppercase font-bold">Rating</p>
                                                      <div className="flex items-center gap-1">
                                                         <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                         <p className="text-sm font-bold text-gray-900">{pc.rating.toFixed(1)}</p>
                                                      </div>
                                                   </div>
                                                   <div className="bg-white p-2 rounded border border-gray-200">
                                                      <p className="text-[10px] text-gray-500 uppercase font-bold">Trips</p>
                                                      <p className="text-sm font-bold text-gray-900">{pc.totalTrips}</p>
                                                   </div>
                                                </div>
                                                
                                                {/* Jurisdictions */}
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                   {pc.jurisdictions.map((state: string) => (
                                                      <Badge key={state} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 text-[10px] px-1.5 py-0">
                                                         {state}
                                                      </Badge>
                                                   ))}
                                                </div>
                                                
                                                {/* Certifications */}
                                                <div className="flex flex-wrap gap-1">
                                                   {pc.certifications.map((cert: string) => (
                                                      <Badge key={cert} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0">
                                                         <Shield className="w-2.5 h-2.5 mr-0.5" />
                                                         {cert}
                                                      </Badge>
                                                   ))}
                                                </div>
                                             </div>
                                             
                                             {/* Selection Indicator */}
                                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#0066cc] border-[#0066cc]' : 'border-gray-300'}`}>
                                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                             </div>
                                          </div>
                                       </Card>
                                    );
                                 })}
                              </div>
                           )}
                           
                           {/* Selection Summary */}
                           {selectedPCs.length > 0 && (
                              <div className="sticky bottom-0 p-3 bg-[#0066cc] text-white rounded-lg shadow-lg">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <p className="text-sm font-bold">{selectedPCs.length} Pilot Car{selectedPCs.length !== 1 ? 's' : ''} Selected</p>
                                       <p className="text-xs opacity-90">These will be notified about your job posting</p>
                                    </div>
                                    <Button 
                                       variant="secondary" 
                                       size="sm"
                                       className="bg-white text-[#0066cc] hover:bg-gray-100"
                                       onClick={() => setSelectedPCs([])}
                                    >
                                       Clear All
                                    </Button>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               )}
            </div>
          </Card>

        </div>
      </ScrollArea>

      {/* Bottom Actions - Fixed */}
      <div className="flex-none p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
         <div className="flex gap-3 max-w-3xl mx-auto">
            <Button variant="outline" className="flex-1 h-12 text-base font-medium border-gray-300" onClick={onBack}>
               Cancel
            </Button>
            <Button className="flex-1 h-12 text-base font-medium bg-[#0066cc] hover:bg-blue-700 text-white shadow-lg shadow-blue-200" onClick={() => onSave && onSave({})}>
               Post Job
            </Button>
         </div>
      </div>

      {/* Available Pilot Cars Modal */}
      <AvailablePilotCarsModal
        isOpen={showPilotCarsModal}
        onClose={handleModalClose}
        pilotCars={recommendedPCs}
        jobId={currentJobId}
        allocationMode={allotmentPref}
        groupName={pcGroup ? PILOT_CAR_GROUPS.find(g => g.id === pcGroup)?.name : undefined}
        onQuoteRequested={handleQuoteRequested}
      />
    </div>
  );
}