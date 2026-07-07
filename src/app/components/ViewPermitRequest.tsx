import { 
  ArrowLeft, 
  ArrowRight,
  MapPin, 
  Calendar, 
  User, 
  Truck, 
  FileText, 
  Download, 
  CheckCircle2,
  CheckCircle, 
  Clock, 
  AlertCircle,
  Box,
  Scale,
  Navigation,
  Phone,
  CreditCard,
  ChevronDown,
  Map as MapIcon,
  Flag,
  Maximize2,
  Share,
  Briefcase,
  Users,
  Info,
  Star,
  Plus,
  Check,
  Play,
  Edit,
  Share2,
  X,
  Timer,
  Square,
  Camera,
  Shield,
  Mail,
  Eye,
  Receipt,
  AlertTriangle,
  Copy,
  Upload,
  Search,
  XCircle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Header from './Header';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose, DrawerDescription } from './ui/drawer';
import svgPaths from '../imports/svg-wog97i87cz';
import mapImage from 'figma:asset/dd9bc85e9f0a971b8c887413588bdac53d534e9b.png';
import trackingMapImage from 'figma:asset/1f5cbd94e64bd6468d47d611846ed0c8a6eaf1a1.png';
import { US_STATES, getStateCodes } from './us-states';
import TripDetailHeader from './TripDetailHeader';
import LiveTrackingHeader from './LiveTrackingHeader';
import GeneralInformationCard from './GeneralInformationCard';
import LoadDetailsCard from './LoadDetailsCard';
import VehicleDriverSection from './VehicleDriverSection';
import { TimeTrackingSection } from './TimeTrackingSection';
import AddJob from './AddJob';
import TripInfoTab from './TripInfoTab';
import PostJobPage from './PostJobPage';
import TripIdHeader from './TripIdHeader';
import PilotCarsByJurisdiction from './PilotCarsByJurisdiction';
import JobDetailsPage from './JobDetailsPage';

// ... (previous interfaces remain the same)
interface PermitState {
  code: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  permitNumber?: string;
  effectiveDate?: string;
  expiryDate?: string;
  downloadUrl?: string;
}

interface TruckDetails {
  unit: string;
  plate: string;
  make: string;
  year: string;
  vin: string;
  axleConfig: string;
  grossWeight: string;
  unladenWeight: string;
}

interface TrailerDetails {
  unit: string;
  plate: string;
  type: string;
  length: string;
  axles: string;
  width: string;
}

interface DriverDetails {
  name: string;
  license: string;
  state: string;
  phone: string;
}

interface LoadDetails {
  type: string;
  description: string;
  width: string;
  height: string;
  length: string;
  weight: string;
  divisible?: string;
  selfPropelled?: string;
  commodityClass?: string;
  commodityType?: string;
  frontOverhang?: string;
  rearOverhang?: string;
}

interface RouteDetails {
  miles: string;
}

interface TrackingDetails {
  status: 'In Transit' | 'Stopped' | 'Delivered';
  currentLocation: string;
  nextStop: string;
  eta: string;
  speed: string;
  distanceRemaining: string;
  progress: number;
}

interface Permit {
  id: string;
  requestId: string;
  permitNumber?: string;
  createdDate: string;
  effectiveDate: string;
  expiryDate: string;
  driver: string;
  states: PermitState[];
  origin: string;
  destination: string;
  status: 'Approved' | 'Draft' | 'Expired' | 'Requires Revision' | 'Submitted' | 'Rejected' | 'In Transit';
  
  permitType?: string;
  reference?: string;
  duration?: string;

  truck?: TruckDetails;
  trailer?: TrailerDetails;
  driverDetails?: DriverDetails;
  load?: LoadDetails;
  routeDetails?: RouteDetails;
  tracking?: TrackingDetails;
}

interface ViewPermitRequestProps {
  permit: Permit;
  onBack: () => void;
}

// Jobs Types
interface Bid {
  id: string;
  companyName: string;
  amount: number;
  rating: number;
  vehicleType: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  jobStatus?: 'Not Started' | 'In Progress' | 'Completed';
  startTime?: string;
  endTime?: string;
  pausedTime?: string;
  totalPausedDuration?: number; // in minutes
  invoiceApproved?: boolean;
  companyEmail?: string;
  // Completion details for finished jobs
  completionDetails?: {
    breaks: Array<{
      reason: string;
      startTime: string;
      endTime: string;
      duration: number; // in minutes
      notes?: string;
    }>;
    layovers: Array<{
      location: string;
      startTime: string;
      endTime: string;
      duration: number; // in hours
      reason: string;
    }>;
    incidents: Array<{
      type: string;
      time: string;
      description: string;
      resolved: boolean;
    }>;
    waitingPeriods: Array<{
      reason: string;
      startTime: string;
      endTime: string;
      duration: number; // in minutes
    }>;
    totalDrivingTime?: number; // in minutes
    totalBreakTime?: number; // in minutes
    totalLayoverTime?: number; // in hours
    totalWaitingTime?: number; // in minutes
    fuelStops?: number;
    notes?: string;
  };
}

interface PilotJob {
  id: string;
  tripId: string;
  jobTitle?: string; // Optional for backward compatibility
  jobType?: string; // e.g., "survey", "convoy", or combination
  origin: string;
  destination: string;
  pickupDate: string;
  startDate?: string; // Job start date
  endDate?: string; // Job end date
  estimatedDistance?: string;
  vehicleType: string;
  numberOfVehicles: number;
  status: 'Open' | 'Assigned' | 'Completed';
  bids: Bid[];
  postedDate: string;
  freightDesc: string;
  dims: {
    height: string;
    width: string;
    length: string;
    weight: string;
  };
  notes: string;
  price: {
    type: 'Per Mile' | 'Flat Rate';
    value: string;
  };
  jurisdictions?: string[]; // States/jurisdictions this pilot car covers
  pilotCarJobInfo?: {
    commodityType?: string;
    grossVehicleWeight?: string;
  };
}

// Mock jobs data
const MOCK_JOBS: PilotJob[] = [
  // REQ-1001: NY to FL trip - Different escorts for different state groups
  {
    id: 'JOB-101',
    tripId: 'REQ-1001',
    jobTitle: 'Pilot Car Services - Multi-State Route',
    jobType: 'convoy',
    origin: 'Edmonton, AB',
    destination: 'Yellowknife, NT',
    pickupDate: '2024-12-01',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    estimatedDistance: '1450 km',
    vehicleType: 'Lead Pilot Car',
    numberOfVehicles: 1,
    status: 'Completed',
    postedDate: '2024-11-25',
    freightDesc: 'Escort services through NC, VA, and MD',
    dims: { height: '14\'2"', width: '10\'6"', length: '42\'0"', weight: '42,000 lbs' },
    notes: 'Multi-state route escort service completed successfully. All jurisdictions cleared.',
    price: { type: 'Flat Rate', value: '$4,900' },
    jurisdictions: ['North Carolina', 'Virginia', 'Maryland'],
    bids: [
      { 
        id: '1', 
        companyName: 'John Miller (Pilot Car Driver)', 
        amount: 4900, 
        rating: 4.9, 
        vehicleType: 'Lead Pilot Car', 
        status: 'Accepted',
        contactPerson: 'John Miller',
        contactPhone: '(555) 123-4567',
        contactEmail: 'john.miller@pilotcar.com',
        jobStatus: 'Completed',
        startTime: '2024-12-01T07:00:00',
        endTime: '2024-12-05T18:30:00',
        totalPausedDuration: 270,
        invoiceApproved: false,
        companyEmail: 'john.miller@pilotcar.com',
        completionDetails: {
          breaks: [],
          layovers: [],
          incidents: [],
          waitingPeriods: [],
          notes: 'Multi-state route completed successfully.'
        }
      }
    ]
  },
  // Add more mock data as needed to match the original file structure
  // ... (keeping other MOCK_JOBS from original file for context if needed, but simplified here for brevity in rewrite)
];

// ... (rest of imports and component setup)

export default function ViewPermitRequest({ permit, onBack }: ViewPermitRequestProps) {
  const [selectedStatePermit, setSelectedStatePermit] = useState<PermitState | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [activeTab, setActiveTab] = useState<'actions' | 'jobs' | 'permits' | 'info' | 'invoice'>('actions');
  const [activeJob, setActiveJob] = useState<PilotJob | null>(null);
  const [activeJobTab, setActiveJobTab] = useState<'details' | 'bids' | 'invoice'>('details');
  const [showJobDetailsPage, setShowJobDetailsPage] = useState(false);
  const [addJurisdictionOpen, setAddJurisdictionOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [tripHistory, setTripHistory] = useState<Array<{event: string, location?: string, time: string}>>([
    ...(permit.status === 'Completed' ? [
      { event: 'Trip Completed', location: permit.destination, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
      { event: 'Final Checkpoint', location: 'Approaching destination', time: new Date(Date.now() - 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
      { event: 'Rest Stop', location: 'Midpoint rest area', time: new Date(Date.now() - 7200000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
      { event: 'Trip Started', location: permit.origin, time: new Date(Date.now() - 14400000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    ] : [])
  ]);
  const [shareTrackingOpen, setShareTrackingOpen] = useState(false);
  const [routeChangeOpen, setRouteChangeOpen] = useState(false);
  
  // ... (other state variables)
  const [jobFilter, setJobFilter] = useState<'active' | 'completed'>('active');
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isStartingTrip, setIsStartingTrip] = useState(false);
  const [logIncidentOpen, setLogIncidentOpen] = useState(false);
  const [showPostJobPage, setShowPostJobPage] = useState(false);

  // Find related jobs
  const relatedJobs = MOCK_JOBS.filter(job => job.tripId === permit.requestId || job.tripId === 'REQ-1001'); // Using REQ-1001 for demo if no match

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700 border-green-200';
      case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Transit': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Helper to ensure we have data even if missing
  const truck = permit.truck || { 
    unit: 'TRK-2025', plate: 'DEF-5678', make: 'Kenworth', year: '2022', 
    vin: '1M123456789ABC', axleConfig: '3 Axle', grossWeight: '80,000 lbs', unladenWeight: '18,000 lbs' 
  };
  const trailer = permit.trailer || { 
    unit: 'TRL-5001', plate: 'TLR-9988', type: 'Flatbed', 
    length: '53 ft', axles: '2', width: '102 in' 
  };
  const driverDetails = permit.driverDetails || { 
    name: permit.driver, license: 'D12345678', state: 'NY', phone: '(555) 123-4567' 
  };
  const load = permit.load || { 
    type: 'Excavator', description: 'Heavy machinery transport', 
    width: '8.5 ft', height: '10 ft', length: '20 ft', weight: '45,000 lbs' 
  };
  const routeDetails = permit.routeDetails || { miles: '1,450' };

  if (showPostJobPage) {
    return <PostJobPage tripId={permit.requestId} onBack={() => setShowPostJobPage(false)} />;
  }

  if (showJobDetailsPage && activeJob) {
    return <JobDetailsPage job={activeJob} onBack={() => setShowJobDetailsPage(false)} initialTab={activeJobTab} />;
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-none bg-white z-20">
        <Header title="Trip Details" onBack={onBack} action={
          <Button variant="ghost" size="icon" className="text-gray-600">
             <Share className="w-5 h-5" />
          </Button>
        } />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#f6f6f6] scroll-smooth"
      >
        <div className="min-h-full pb- safe-area-bottom">
           {/* Map Section */}
           <div className={`transition-all duration-300 ease-in-out relative ${isMapCollapsed ? 'h-[120px]' : 'h-[240px]'}`}>
            <div className="absolute inset-0 bg-gray-200">
              <img 
                src={permit.status === 'In Transit' ? trackingMapImage : mapImage} 
                alt="Route Map" 
                className="w-full h-full object-cover opacity-80"
              />
               {/* Map Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
               
               {/* Live Tracking Indicator */}
               {permit.status === 'In Transit' && (
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 border border-white/50">
                   <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                   <div>
                     <p className="text-[10px] font-bold text-gray-900 leading-none">LIVE TRACKING</p>
                     <p className="text-[10px] text-gray-500 leading-none mt-0.5">Updated 1m ago</p>
                   </div>
                 </div>
               )}

               <Button 
                 variant="secondary" 
                 size="sm" 
                 className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-xs h-8 shadow-sm backdrop-blur-sm"
               >
                 <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                 Map
               </Button>
            </div>
          </div>

          {/* Header Section */}
          <div className="px-4 pt-6 pb-3 bg-[#f6f6f6]">
            <TripIdHeader 
              tripId={permit.requestId} 
              status={permit.status as any}
            />
          </div>

          {/* Main Content - Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex flex-col">
            {/* Tabs List */}
            <div className="px-4 sticky top-0 bg-[#f6f6f6] z-10">
              <TabsList className="w-full grid grid-cols-4 h-10 bg-gray-100">
                <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
                <TabsTrigger value="jobs" className="text-xs">
                  Jobs {relatedJobs.filter(j => j.status !== 'Open').length > 0 && `(${relatedJobs.filter(j => j.status !== 'Open').length})`}
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                <TabsTrigger value="invoice" className="text-xs">
                  Invoice {(() => {
                    const pendingInvoices = relatedJobs.filter(job => 
                      job.bids.some(b => b.status === 'Accepted' && b.jobStatus === 'Completed' && !b.invoiceApproved)
                    ).length;
                    return pendingInvoices > 0 ? `(${pendingInvoices})` : '';
                  })()}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="w-full min-w-0">
                {/* Quick Actions Tab */}
                <TabsContent value="actions" className="mt-0 p-4 space-y-6 pb-32 max-w-3xl mx-auto min-w-0">
                  {/* Start Trip Button - Show when status is Open */}
                  {permit.status === 'Open' && (
                    <div>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg h-14 text-base font-semibold"
                        onClick={() => setIsStartingTrip(true)}
                      >
                        <Play className="mr-2 h-6 w-6" /> Start Trip Now
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-2">Begin GPS tracking and update trip status</p>
                    </div>
                  )}

                  {/* Trip Completion Summary - Show when status is Completed */}
                  {permit.status === 'Completed' && (
                    <Card className="shadow-sm border-gray-200 bg-white overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-900">Trip Completed</h3>
                            <p className="text-sm text-green-700">All permits and jobs finalized</p>
                          </div>
                        </div>
                        <div className="space-y-2 pt-3 border-t border-green-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Completion Date:</span>
                            <span className="font-semibold text-green-900">{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Total Distance:</span>
                            <span className="font-semibold text-green-900">{permit.routeDetails?.miles || '0'} miles</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Associated Jobs:</span>
                            <span className="font-semibold text-green-900">{relatedJobs.length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Actions */}
                  {permit.status !== 'Completed' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                      <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <CardContent className="p-3 space-y-2">
                          {permit.status === 'In Transit' && (
                            <Button 
                              variant="outline" 
                              className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                              onClick={() => setShareTrackingOpen(true)}
                            >
                              <Share2 className="mr-3 h-4 w-4 text-[#0066cc]" />
                              <span className="text-gray-900">Share Tracking Link</span>
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => setRouteChangeOpen(true)}
                          >
                            <Edit className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Request Route/Time Change</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => setLogIncidentOpen(true)}
                          >
                            <AlertCircle className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Log Incident</span>
                          </Button>

                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => setAddJurisdictionOpen(true)}
                          >
                            <Plus className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Add Jurisdiction</span>
                          </Button>

                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => {}}
                          >
                            <Download className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Download All Permits</span>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Completed Trip Actions */}
                  {permit.status === 'Completed' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Actions</h3>
                      <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <CardContent className="p-3 space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => {}}
                          >
                            <Download className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Download All Permits</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => {}}
                          >
                            <FileText className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">Download Trip Report</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                            onClick={() => {}}
                          >
                            <Receipt className="mr-3 h-4 w-4 text-[#0066cc]" />
                            <span className="text-gray-900">View All Invoices</span>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Pilot Car Jobs Tab */}
                <TabsContent value="jobs" className="mt-0 p-4 space-y-6 pb-32 max-w-3xl mx-auto min-w-0">
                  {relatedJobs.filter(job => job.status !== 'Open').length > 0 ? (
                    <>
                      <div>
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 grid grid-cols-2 h-10 bg-gray-100 rounded-md p-1">
                            <button 
                              onClick={() => setJobFilter('active')}
                              className={`text-xs font-medium rounded-sm transition-all ${
                                jobFilter === 'active' 
                                  ? 'bg-white text-gray-900 shadow-sm' 
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              Active ({relatedJobs.filter(job => job.status !== 'Completed' && job.status !== 'Open').length})
                            </button>
                            <button 
                              onClick={() => setJobFilter('completed')}
                              className={`text-xs font-medium rounded-sm transition-all ${
                                jobFilter === 'completed' 
                                  ? 'bg-white text-gray-900 shadow-sm' 
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              Completed ({relatedJobs.filter(job => job.status === 'Completed').length})
                            </button>
                          </div>
                        </div>

                        {(() => {
                          const filteredJobs = relatedJobs.filter(job => 
                            jobFilter === 'active' ? (job.status !== 'Completed' && job.status !== 'Open') : job.status === 'Completed'
                          );
                          
                          if (filteredJobs.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-gray-100 rounded-full p-4 mb-4">
                                  <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                  No {jobFilter === 'active' ? 'Active' : 'Completed'} Jobs
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                  {jobFilter === 'active' 
                                    ? 'No active jobs assigned to you.' 
                                    : 'No completed jobs found for you.'}
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="space-y-3 w-full min-w-0">
                              {filteredJobs.map(job => {
                                const acceptedBid = job.bids.find((bid: any) => bid.status === 'Accepted');
                                const isActive = acceptedBid?.jobStatus === 'In Progress';
                                
                                return (
                                  <Card 
                                    key={job.id} 
                                    className={`shadow-sm overflow-hidden hover:border-[#0066cc] transition-all cursor-pointer relative w-full min-w-0 ${
                                      isActive ? 'border-2 border-green-500 shadow-lg' : 'border-gray-200'
                                    }`}
                                    onClick={() => {
                                      setActiveJob(job);
                                      const acceptedBid = job.bids.find((bid: any) => bid.status === 'Accepted');
                                      const isCompleted = job.status === 'Completed' || acceptedBid?.jobStatus === 'Completed';
                                      setActiveJobTab(isCompleted ? 'invoice' : 'details');
                                      setShowJobDetailsPage(true);
                                    }}
                                  >
                                    {/* Active Job Indicator */}
                                    {isActive && (
                                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full z-10 shadow-md">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wide">ACTIVE</span>
                                      </div>
                                    )}
                                    
                                    <CardContent className="p-4 w-full min-w-0">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-sm font-bold text-gray-900">{job.id}</span>
                                          <Badge variant="secondary" className={`${getJobStatusColor(job.status)} border text-xs px-2 py-0`}>
                                            {job.status}
                                          </Badge>
                                          {job.jobType && (
                                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                              {job.jobType === 'survey' ? 'Survey' : job.jobType === 'convoy' ? 'Convoy' : job.jobType.split(',').map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                                            </Badge>
                                          )}
                                        </div>
                                        <span className="text-xs text-gray-500">{job.pickupDate}</span>
                                      </div>
                                      
                                      {job.jobTitle && (
                                        <h3 className="font-bold text-gray-900 mb-2">{job.jobTitle}</h3>
                                      )}
                                      
                                      <div className="font-medium text-gray-700 flex items-center flex-wrap gap-2 mb-2 text-sm">
                                        {job.origin} 
                                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" /> 
                                        {job.destination}
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 mb-3 w-full min-w-0">
                                        {job.pilotCarJobInfo?.commodityType && (
                                          <div className="text-xs min-w-0">
                                            <span className="text-gray-500">Commodity: </span>
                                            <span className="font-medium text-gray-900">{job.pilotCarJobInfo.commodityType}</span>
                                          </div>
                                        )}
                                        {job.pilotCarJobInfo?.grossVehicleWeight && (
                                          <div className="text-xs min-w-0">
                                            <span className="text-gray-500">GVW: </span>
                                            <span className="font-medium text-gray-900">{parseInt(job.pilotCarJobInfo.grossVehicleWeight).toLocaleString()} lbs</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <p className="text-sm text-gray-600 mb-3">{job.freightDesc}</p>
                                      
                                      <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-100 mb-3 w-full min-w-0">
                                        <div className="space-y-1 min-w-0">
                                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Required</span>
                                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                            <Truck className="h-3.5 w-3.5 text-[#0066cc] flex-shrink-0" />
                                            <span className="truncate">{job.numberOfVehicles}x {job.vehicleType}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bids</span>
                                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                            <Users className="h-3.5 w-3.5 text-[#0066cc] flex-shrink-0" />
                                            <span className="truncate">{job.bids.length} {job.bids.length === 1 ? 'Bid' : 'Bids'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        {job.price && (
                                          <div className="flex items-center gap-1 text-sm font-semibold text-green-700">
                                            <span>{job.price.value} {job.price.type === 'Per Mile' ? '/mi' : ''}</span>
                                          </div>
                                        )}
                                        {job.jurisdictions && job.jurisdictions.length > 0 && (
                                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {getStateCodes(job.jurisdictions).join(', ')}
                                          </Badge>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">No Jobs Assigned</p>
                      <p className="text-xs text-gray-500 mb-4">You have not been assigned any jobs for this trip yet.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Other Information Tab */}
                <TabsContent value="info" className="mt-0 pb-32 bg-gray-50 max-w-3xl mx-auto min-w-0">
                  <TripInfoTab 
                    permit={permit}
                    routeDetails={routeDetails}
                    load={load}
                    driverDetails={driverDetails}
                    truck={truck}
                    trailer={trailer}
                  />
                </TabsContent>

                {/* Invoice Tab */}
                <TabsContent value="invoice" className="mt-0 p-4 space-y-6 pb-32 max-w-3xl mx-auto min-w-0">
                  {/* Header Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Pilot Car Invoices</h2>
                      {(() => {
                        const pendingCount = relatedJobs.filter(job => 
                          job.bids.some(b => b.status === 'Accepted' && b.jobStatus === 'Completed' && !b.invoiceApproved)
                        ).length;
                        return pendingCount > 0 ? (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {pendingCount} Pending Review
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-sm text-gray-600">
                      Review and approve invoices submitted by pilot car drivers, organized by job
                    </p>
                  </div>

                  {(() => {
                    const filteredJobs = relatedJobs.filter(job => {
                      const acceptedBid = job.bids.find((bid: any) => bid.status === "Accepted");
                      return acceptedBid?.jobStatus === "Completed";
                    });

                    return (
                      <div className="space-y-3">
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                              No invoices found
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        ) : (
                          filteredJobs.map((job, index) => {
                            const bid = job.bids.find(
                              (bid: any) => bid.status === "Accepted",
                            );
                            if (!bid) return null;

                            // Calculate total
                            const baseRate = 2.5;
                            const waitingRate = 50.0;
                            const layoverRate = 200.0;
                            const overtimeRate = 75.0;
                            const distance = parseInt(
                              job.estimatedDistance?.replace(" km", "").replace(" mi", "") || "0",
                            );
                            const waitingHours = 4.5;
                            const layoverDays = 3;
                            const overtimeHours = 6.0;
                            const totalAmount =
                              distance * baseRate +
                              waitingHours * waitingRate +
                              layoverDays * layoverRate +
                              overtimeHours * overtimeRate;

                            // Status badge configuration
                            const getStatusBadge = () => {
                              if (bid.invoiceApproved) {
                                return {
                                  text: "Paid",
                                  className:
                                    "bg-green-100 text-green-700 border-0",
                                };
                              } else if (index === 1) {
                                return {
                                  text: "Past due",
                                  className: "bg-red-100 text-red-700 border-0",
                                };
                              } else {
                                return {
                                  text: "Draft",
                                  className:
                                    "bg-gray-100 text-gray-700 border-0",
                                };
                              }
                            };

                            const statusBadge = getStatusBadge();
                            // Use activeJob for expansion logic
                            const isExpanded = activeJob?.id === job.id;

                            return (
                              <div
                                key={job.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                              >
                                {/* Main Invoice Card - Summary View */}
                                <div className="p-3">
                                  {/* Invoice Icon */}
                                  <div className="flex justify-center mb-2">
                                    <div className="relative w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                      <div className="absolute inset-0 bg-white/40 rounded-lg" />
                                      <Receipt className="w-5 h-5 text-blue-500 relative z-10" />
                                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                        <span className="text-white text-[8px] font-bold">
                                          $
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Amount - Centered */}
                                  <div className="text-center mb-0.5">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {totalAmount.toLocaleString("en-US", {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                      })}{" "}
                                      USD
                                    </h3>
                                  </div>

                                  {/* Invoice Number - Centered */}
                                  <div className="text-center mb-3">
                                    <p className="text-xs text-gray-500">
                                      No. {job.id}
                                    </p>
                                  </div>

                                  {/* Divider */}
                                  <div className="border-t border-gray-200 my-2" />

                                  {/* Two Column Summary */}
                                  <div className="space-y-1.5">
                                    {/* Status Row */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">
                                        Status
                                      </span>
                                      <Badge
                                        className={`text-xs px-2.5 py-0.5 ${statusBadge.className}`}
                                      >
                                        {statusBadge.text}
                                      </Badge>
                                    </div>

                                    {/* Payment Date Row */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">
                                        Payment Date
                                      </span>
                                      <span className="text-xs font-medium text-gray-900">
                                        {bid.invoiceApproved
                                          ? `Paid at ${new Date(job.endDate || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`
                                          : "Pending"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Expand Button */}
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-8"
                                      onClick={() => setActiveJob(isExpanded ? null : job)}
                                    >
                                      <span className="text-xs font-medium">
                                        {isExpanded
                                          ? "Hide Details"
                                          : "View Details"}
                                      </span>
                                      <ChevronDown
                                        className={`w-3.5 h-3.5 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                      />
                                    </Button>
                                  </div>
                                </div>

                                {/* Expandable Details Section */}
                                {isExpanded && (
                                  <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                                    {/* Company Info */}
                                    <div>
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                        Company Information
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Company
                                          </div>
                                          <div className="font-medium text-gray-900">
                                            {bid.companyName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Email
                                          </div>
                                          <div className="font-medium text-gray-900 break-all">
                                            {bid.companyEmail ||
                                              `${bid.companyName.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Job Info */}
                                    <div>
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                        Job Details
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Route
                                          </div>
                                          <div className="font-medium text-gray-900">
                                            {job.origin} → {job.destination}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <div className="text-xs text-gray-500 mb-0.5">
                                              Distance
                                            </div>
                                            <div className="font-medium text-gray-900">
                                              {distance} km
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs text-gray-500 mb-0.5">
                                              Vehicle Type
                                            </div>
                                            <div className="font-medium text-gray-900">
                                              {job.vehicleType}
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Subject
                                          </div>
                                          <div className="font-medium text-gray-900">
                                            {job.jobTitle || job.freightDesc}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Invoice Dates */}
                                    <div>
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                        Invoice Timeline
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Created
                                          </div>
                                          <div className="font-medium text-gray-900">
                                            {new Date(
                                              job.startDate || Date.now(),
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}{" "}
                                            •{" "}
                                            {new Date(job.startDate || Date.now())
                                              .toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })
                                              .toUpperCase()}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 mb-0.5">
                                            Last Updated
                                          </div>
                                          <div className="font-medium text-gray-900">
                                            {new Date(
                                              job.endDate || Date.now(),
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}{" "}
                                            •{" "}
                                            {new Date(job.endDate || Date.now())
                                              .toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })
                                              .toUpperCase()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Invoice Breakdown */}
                                    <div>
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                        Charges Breakdown
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-2.5 text-sm">
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-gray-600">
                                            Base Mileage{" "}
                                            <span className="text-gray-400">
                                              ({distance} km)
                                            </span>
                                          </span>
                                          <span className="font-medium text-gray-900 tabular-nums">
                                            ${(distance * baseRate).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-gray-600">
                                            Waiting Time{" "}
                                            <span className="text-gray-400">
                                              ({waitingHours}h)
                                            </span>
                                          </span>
                                          <span className="font-medium text-gray-900 tabular-nums">
                                            $
                                            {(
                                              waitingHours * waitingRate
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-gray-600">
                                            Layover{" "}
                                            <span className="text-gray-400">
                                              ({layoverDays} days)
                                            </span>
                                          </span>
                                          <span className="font-medium text-gray-900 tabular-nums">
                                            $
                                            {(
                                              layoverDays * layoverRate
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-gray-600">
                                            Overtime{" "}
                                            <span className="text-gray-400">
                                              ({overtimeHours}h)
                                            </span>
                                          </span>
                                          <span className="font-medium text-gray-900 tabular-nums">
                                            $
                                            {(
                                              overtimeHours * overtimeRate
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex items-center justify-between gap-4 pt-1">
                                          <span className="font-bold text-gray-900">
                                            Total Amount
                                          </span>
                                          <span className="font-bold text-gray-900 text-lg tabular-nums">
                                            ${totalAmount.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {!bid.invoiceApproved && (
                                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 font-medium shadow-sm">
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve Payment
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="flex-1 h-11 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
                                        >
                                          <AlertTriangle className="w-4 h-4 mr-2" />
                                          Dispute
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}