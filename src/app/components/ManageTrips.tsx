import { useState, useMemo } from 'react';
import Header from './Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose, SheetDescription } from './ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose, DrawerDescription } from './ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Download, 
  FileText, 
  MapPin, 
  Calendar, 
  User, 
  Map,
  Flag,
  ChevronRight,
  ChevronUp,
  Eye,
  ChevronDown,
  ArrowUpDown,
  FileInput,
  Copy,
  ArrowRight,
  AlertCircle,
  Check,
  X,
  Truck,
  Timer,
  Users,
  Box,
  Ruler,
  Info,
  Briefcase,
  Navigation,
  Shield,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Package,
  Star
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import svgPaths from '../imports/svg-wog97i87cz';
import { TimeTrackingSection } from './TimeTrackingSection';

// Permits/Trips Types
interface PermitState {
  code: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired' | 'Not Applied';
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
  status: 'Open' | 'In Transit' | 'Action Required' | 'Completed';
  
  // New detailed fields
  truck?: TruckDetails;
  trailer?: TrailerDetails;
  driverDetails?: DriverDetails;
  load?: LoadDetails;
  routeDetails?: RouteDetails;
  tracking?: TrackingDetails;
  
  // Pilot car assignments
  pilotCarAssignments?: {
    leadPilot?: string;  // Pilot car driver name
    chasePilot?: string; // Pilot car driver name
  };
}

// Jobs Types
interface Bid {
  id: string;
  companyName: string;
  amount: number;
  rating: number;
  vehicleType: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

interface PilotJob {
  id: string;
  tripId: string;
  origin: string;
  destination: string;
  pickupDate: string;
  vehicleType: string;
  numberOfVehicles: number;
  status: 'Open' | 'Assigned' | 'Completed';
  bids: Bid[];
  postedDate: string;
  // Extended Details
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
}

// Current logged-in pilot car driver
const CURRENT_PILOT_DRIVER = 'John Smith';

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

const MOCK_PERMITS: Permit[] = [
  {
    id: '1',
    requestId: 'REQ-1001',
    permitNumber: 'PER-2024-88A',
    createdDate: '2024-12-01',
    effectiveDate: '2024-12-05',
    expiryDate: '2024-12-15',
    driver: 'John Doe',
    states: [
      { code: 'NY', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'NY-8829' },
      { code: 'NJ', status: 'Pending' },
      { code: 'PA', status: 'Rejected' },
      { code: 'CT', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'CT-2291' },
      { code: 'MA', status: 'Pending' },
      { code: 'MD', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'MD-5591' },
      { code: 'VA', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'VA-1022' },
      { code: 'NC', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'NC-4822' },
      { code: 'SC', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'SC-9912' },
      { code: 'GA', status: 'Approved', effectiveDate: '2024-12-05', expiryDate: '2024-12-10', permitNumber: 'GA-2281' },
      { code: 'FL', status: 'Pending' }
    ],
    origin: 'New York, NY',
    destination: 'Miami, FL',
    status: 'In Transit',
    truck: { unit: 'TRK-2025', plate: 'DEF-5678', make: 'Kenworth', year: '2022', vin: '1M123456789ABC', axleConfig: '3 Axle', grossWeight: '80,000 lbs', unladenWeight: '18,000 lbs' },
    trailer: { unit: 'TRL-5001', plate: 'TLR-9988', type: 'Flatbed', length: '53 ft', axles: '2', width: '102 in' },
    driverDetails: { name: 'John Doe', license: 'D12345678', state: 'NY', phone: '(555) 123-4567' },
    load: { type: 'Excavator', description: 'Heavy machinery transport', width: '8.5 ft', height: '10 ft', length: '20 ft', weight: '45,000 lbs' },
    routeDetails: { miles: '1280' },
    tracking: {
       status: 'In Transit',
       currentLocation: 'Richmond, VA (I-95 South)',
       nextStop: 'Florence, SC',
       eta: '5h 30m',
       speed: '62 mph',
       distanceRemaining: '450 miles',
       progress: 35
    },
    pilotCarAssignments: {
      leadPilot: 'John Smith',
      chasePilot: 'Alice Johnson'
    }
  },
  {
    id: '2',
    requestId: 'REQ-1002',
    permitNumber: 'PER-2024-92B',
    createdDate: '2024-12-03',
    effectiveDate: '2024-12-10',
    expiryDate: '2024-12-20',
    driver: 'Sarah Smith',
    states: [
      { code: 'WA', status: 'Not Applied' },
      { code: 'OR', status: 'Not Applied' },
      { code: 'CA', status: 'Not Applied' }
    ],
    origin: 'Seattle, WA',
    destination: 'Los Angeles, CA',
    status: 'Open',
    truck: { unit: 'TRK-2026', plate: 'WXY-9999', make: 'Freightliner', year: '2023', vin: '3F456789012DEF', axleConfig: '3 Axle', grossWeight: '78,000 lbs', unladenWeight: '17,500 lbs' },
    trailer: { unit: 'TRL-5003', plate: 'TLR-5544', type: 'Step Deck', length: '48 ft', axles: '2', width: '102 in' },
    driverDetails: { name: 'Sarah Smith', license: 'S87654321', state: 'WA', phone: '(555) 987-6543' },
    load: { type: 'Wind Turbine Blade', description: 'Renewable Energy Equipment', width: '12 ft', height: '14 ft', length: '120 ft', weight: '38,000 lbs' },
    routeDetails: { miles: '1135' },
    pilotCarAssignments: {
      leadPilot: 'John Smith'
    }
  },
  {
    id: '2b',
    requestId: 'REQ-1002B',
    permitNumber: 'PER-2024-92C',
    createdDate: '2024-12-04',
    effectiveDate: '2024-12-11',
    expiryDate: '2024-12-21',
    driver: 'Tom Wilson',
    states: [
      { code: 'CA', status: 'Approved', effectiveDate: '2024-12-11', expiryDate: '2024-12-16' }
    ],
    origin: 'Los Angeles, CA',
    destination: 'San Francisco, CA',
    status: 'Open',
    truck: { unit: 'TRK-2027', plate: 'ABC-5678', make: 'Peterbilt', year: '2021', vin: '2P987654321ABC', axleConfig: '4 Axle', grossWeight: '85,000 lbs', unladenWeight: '19,500 lbs' },
    trailer: { unit: 'TRL-5004', plate: 'TLR-8899', type: 'Lowboy', length: '48 ft', axles: '3', width: '102 in' },
    driverDetails: { name: 'Tom Wilson', license: 'T12345678', state: 'CA', phone: '(555) 111-2222' },
    load: { type: 'Bulldozer', description: 'Construction Equipment', width: '9 ft', height: '11 ft', length: '22 ft', weight: '45,000 lbs' },
    routeDetails: { miles: '382' }
  },
  {
    id: '3',
    requestId: 'REQ-1003',
    createdDate: '2024-12-06',
    effectiveDate: '2024-12-12',
    expiryDate: '2024-12-22',
    driver: 'Mike Johnson',
    states: [
      { code: 'TX', status: 'Pending' },
      { code: 'OK', status: 'Pending' },
      { code: 'NM', status: 'Pending' },
      { code: 'AZ', status: 'Pending' }
    ],
    origin: 'Dallas, TX',
    destination: 'Phoenix, AZ',
    status: 'Open'
  },
  {
    id: '4',
    requestId: 'REQ-1004',
    createdDate: '2024-12-07',
    effectiveDate: '2024-12-14',
    expiryDate: '2024-12-24',
    driver: 'Emily Davis',
    states: [
      { code: 'FL', status: 'Pending' },
      { code: 'GA', status: 'Pending' }
    ],
    origin: 'Miami, FL',
    destination: 'Atlanta, GA',
    status: 'Open'
  },
  {
    id: '5',
    requestId: 'PRM-2024-003',
    createdDate: '2024-12-08',
    effectiveDate: '2024-12-16',
    expiryDate: '2024-12-26',
    driver: 'Robert Brown',
    states: [
      { code: 'TX', status: 'Rejected' },
      { code: 'NM', status: 'Pending' }
    ],
    origin: 'Houston, TX',
    destination: 'Santa Fe, NM',
    status: 'Action Required'
  },
  {
    id: '6',
    requestId: 'REQ-1005',
    createdDate: '2024-11-20',
    effectiveDate: '2024-11-25',
    expiryDate: '2024-12-05',
    driver: 'John Doe',
    states: [
      { code: 'NY', status: 'Pending' },
      { code: 'PA', status: 'Pending' }
    ],
    origin: 'Buffalo, NY',
    destination: 'Pittsburgh, PA',
    status: 'Open'
  },
  {
    id: '7',
    requestId: 'REQ-1006',
    createdDate: '2024-10-15',
    effectiveDate: '2024-10-20',
    expiryDate: '2024-10-30',
    driver: 'Sarah Smith',
    states: [
      { code: 'CA', status: 'Rejected' },
      { code: 'NV', status: 'Rejected' }
    ],
    origin: 'Sacramento, CA',
    destination: 'Reno, NV',
    status: 'Completed'
  },
  {
    id: '8',
    requestId: 'REQ-1007',
    createdDate: '2024-09-01',
    effectiveDate: '2024-09-05',
    expiryDate: '2024-09-15',
    driver: 'Mike Johnson',
    states: [
      { code: 'TX', status: 'Expired', effectiveDate: '2024-09-05', expiryDate: '2024-09-10' }
    ],
    origin: 'Austin, TX',
    destination: 'Houston, TX',
    status: 'Completed'
  },
  {
    id: '9',
    requestId: 'REQ-1008',
    permitNumber: 'OR-2024-00456',
    createdDate: '2024-12-07',
    effectiveDate: '2024-12-19',
    expiryDate: '2024-12-29',
    driver: 'Sarah Williams',
    states: [
      { code: 'OR', status: 'Approved', permitNumber: 'OR-2024-00456', effectiveDate: '2024-12-19', expiryDate: '2024-12-29' }
    ],
    origin: 'California-Oregon Border',
    destination: 'Oregon-Nevada Border',
    status: 'Open'
  },
  {
    id: '10',
    requestId: 'REQ-1009',
    createdDate: '2025-01-05',
    effectiveDate: '2025-01-12',
    expiryDate: '2025-01-22',
    driver: 'Michael Anderson',
    states: [
      { code: 'WA', status: 'Not Applied' },
      { code: 'OR', status: 'Not Applied' },
      { code: 'CA', status: 'Not Applied' },
      { code: 'NV', status: 'Not Applied' },
      { code: 'AZ', status: 'Not Applied' },
      { code: 'UT', status: 'Not Applied' },
      { code: 'CO', status: 'Not Applied' },
      { code: 'NM', status: 'Not Applied' }
    ],
    origin: 'Seattle, WA',
    destination: 'Albuquerque, NM',
    status: 'Open',
    truck: { unit: 'TRK-3045', plate: 'XYZ-7890', make: 'Freightliner', year: '2023', vin: '3F567890123DEF', axleConfig: '4 Axle', grossWeight: '88,000 lbs', unladenWeight: '20,000 lbs' },
    trailer: { unit: 'TRL-6010', plate: 'TLR-5544', type: 'Step Deck', length: '53 ft', axles: '3', width: '102 in' },
    driverDetails: { name: 'Michael Anderson', license: 'M98765432', state: 'WA', phone: '(555) 234-5678' },
    load: { type: 'Wind Turbine Blade', description: 'Renewable energy equipment', width: '13 ft', height: '14 ft', length: '150 ft', weight: '72,000 lbs' },
    routeDetails: { miles: '1650' }
  }
];

const MOCK_JOBS: PilotJob[] = [
  {
    id: 'JOB-101',
    tripId: 'REQ-1001',
    origin: 'New York, NY',
    destination: 'Miami, FL',
    pickupDate: '2024-12-05',
    vehicleType: 'High Pole',
    numberOfVehicles: 1,
    status: 'Open',
    postedDate: '2024-12-01',
    freightDesc: 'Industrial HVAC Unit - Oversized height',
    dims: { height: '14\' 6"', width: '10\' 0"', length: '45\' 0"', weight: '45,000 lbs' },
    notes: 'Driver requires high pole for bridge clearance verification along I-95 corridor.',
    price: { type: 'Per Mile', value: '1.85' },
    bids: [
      { id: 'BID-1', companyName: 'SafePilot Escorts', amount: 1200, rating: 4.8, vehicleType: 'Ford F-150', status: 'Pending' },
      { id: 'BID-2', companyName: 'Elite Escort Services', amount: 1450, rating: 5.0, vehicleType: 'Chevy Silverado', status: 'Pending' },
    ]
  },
  {
    id: 'JOB-102',
    tripId: 'REQ-1001',
    origin: 'New York, NY',
    destination: 'Miami, FL',
    pickupDate: '2024-12-05',
    vehicleType: 'Lead',
    numberOfVehicles: 2,
    status: 'In Transit',
    postedDate: '2024-12-01',
    freightDesc: 'Heavy machinery transport - Excavator',
    dims: { height: '10\' 0"', width: '8\' 6"', length: '20\' 0"', weight: '45,000 lbs' },
    notes: 'Two lead cars required for multi-state route.',
    price: { type: 'Flat Rate', value: '2850' },
    jurisdictions: ['NY', 'NJ', 'PA', 'MD', 'VA', 'NC', 'SC', 'GA', 'FL'],
    bids: [
      { 
        id: 'BID-3', 
        companyName: 'East Coast Escorts', 
        amount: 2850, 
        rating: 4.8, 
        vehicleType: 'Ram 1500', 
        status: 'Accepted',
        jobStatus: 'In Progress',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        contactPerson: 'Mike Johnson',
        contactPhone: '(555) 234-5678'
      }
    ]
  },
  {
    id: 'JOB-104',
    tripId: 'REQ-1002',
    origin: 'Los Angeles, CA',
    destination: 'San Francisco, CA',
    pickupDate: '2024-12-12',
    vehicleType: 'Chase',
    numberOfVehicles: 1,
    status: 'Open',
    postedDate: '2024-12-05',
    freightDesc: 'Steel Beams - Wide Load',
    dims: { height: '11\' 0"', width: '14\' 6"', length: '52\' 0"', weight: '58,000 lbs' },
    notes: 'Chase car needed for wide load escort. Must have CB radio and emergency lights.',
    price: { type: 'Per Mile', value: '1.95' },
    bids: [
      { id: 'BID-4', companyName: 'Highway Guardians', amount: 980, rating: 4.7, vehicleType: 'Dodge Ram', status: 'Pending' },
      { id: 'BID-5', companyName: 'Pacific Escorts', amount: 1100, rating: 4.9, vehicleType: 'Ford F-250', status: 'Pending' },
      { id: 'BID-6', companyName: 'Coastal Pilot Services', amount: 950, rating: 4.6, vehicleType: 'Chevy Silverado', status: 'Pending' },
    ]
  },
  {
    id: 'JOB-103',
    tripId: 'REQ-1003',
    origin: 'Houston, TX',
    destination: 'Dallas, TX',
    pickupDate: '2024-12-15',
    vehicleType: 'Chase',
    numberOfVehicles: 1,
    status: 'Open',
    postedDate: '2024-12-04',
    freightDesc: 'Wind Turbine Blade Section',
    dims: { height: '13\' 6"', width: '8\' 6"', length: '120\' 0"', weight: '35,000 lbs' },
    notes: 'Long load, chase car must have extended radio range.',
    price: { type: 'Per Mile', value: '2.00' },
    bids: []
  },
  {
    id: 'JOB-2024-202',
    tripId: 'REQ-1008',
    origin: 'California-Oregon Border',
    destination: 'Oregon-Nevada Border',
    pickupDate: '2024-12-19',
    vehicleType: 'Front, Rear',
    numberOfVehicles: 3,
    status: 'Assigned',
    postedDate: '2024-12-10',
    freightDesc: 'Multi-position escort through Oregon',
    dims: { height: '13\' 6"', width: '12\' 0"', length: '55\' 0"', weight: '48,000 lbs' },
    notes: 'Requires 2 front pilot cars and 1 rear pilot car. Oregon permit OR-2024-00456 covers full route.',
    price: { type: 'Flat Rate', value: '2200' },
    bids: [
      { id: 'BID-202-1', companyName: 'Alice Johnson Pilot Services', amount: 2200, rating: 4.9, vehicleType: 'Multi-position', status: 'Accepted' }
    ]
  }
];

interface ManageTripsProps {
  onToggleSidebar?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
  userRole?: 'dispatcher' | 'pilot-car-driver'; // Add user role prop
}

export default function ManageTrips({ onToggleSidebar, onNavigate, userRole = 'dispatcher' }: ManageTripsProps) {
  // Top-level tab state
  const [mainView, setMainView] = useState<'trips' | 'jobs'>('trips');
  
  // Trips states
  const [activeTab, setActiveTab] = useState<'Open' | 'In Transit' | 'Action Required' | 'Completed'>('In Transit');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  // Filter & Sort States
  const [sortBy, setSortBy] = useState('created_desc');
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [tempFilterStates, setTempFilterStates] = useState<string[]>([]);
  const [tempDateStart, setTempDateStart] = useState('');
  const [tempDateEnd, setTempDateEnd] = useState('');
  
  // UI States
  const [fabOpen, setFabOpen] = useState(false);
  const [showAutofillModal, setShowAutofillModal] = useState(false);
  const [activeActionPermit, setActiveActionPermit] = useState<Permit | null>(null);
  const [downloadingPermit, setDownloadingPermit] = useState<Permit | null>(null);
  const [activeStatePermit, setActiveStatePermit] = useState<{permitId: string, state: PermitState} | null>(null);
  
  // Autofill Modal States
  const [autofillTab, setAutofillTab] = useState('Approved');
  const [autofillSearch, setAutofillSearch] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [filterDriver, setFilterDriver] = useState('all');

  // Jobs states
  const [jobSearch, setJobSearch] = useState('');
  const [activeJob, setActiveJob] = useState<PilotJob | null>(null);
  const [activeJobTab, setActiveJobTab] = useState('details');
  const [jobDetailsSections, setJobDetailsSections] = useState<Record<string, boolean>>({
    overview: true,
    requirements: true,
    schedule: true,
    location: false,
    pricing: false,
    extras: false,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  // Helper function to toggle collapsible sections in job details
  const toggleJobDetailsSection = (section: string) => {
    setJobDetailsSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Time tracking states for active jobs
  const [breakTimeActive, setBreakTimeActive] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [waitingTimeActive, setWaitingTimeActive] = useState(false);
  const [waitingStartTime, setWaitingStartTime] = useState<Date | null>(null);
  const [totalWaitingTime, setTotalWaitingTime] = useState(0);

  // Filter permits based on tab and search query for MAIN LIST
  const filteredPermits = useMemo(() => {
    let result = MOCK_PERMITS.filter(permit => {
      // Filter to only show trips where current pilot car driver is assigned
      const isPilotAssigned = permit.pilotCarAssignments && 
        (permit.pilotCarAssignments.leadPilot === CURRENT_PILOT_DRIVER || 
         permit.pilotCarAssignments.chasePilot === CURRENT_PILOT_DRIVER);
      
      if (!isPilotAssigned) return false;
      
      let matchesTab = false;
      
      if (activeTab === 'Open') {
        matchesTab = permit.status === 'Open';
      } else if (activeTab === 'In Transit') {
        matchesTab = permit.status === 'In Transit';
      } else if (activeTab === 'Action Required') {
        matchesTab = permit.status === 'Action Required';
      } else if (activeTab === 'Completed') {
        matchesTab = permit.status === 'Completed';
      }
      
      const matchesSearch = 
        permit.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permit.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permit.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permit.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (permit.permitNumber && permit.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState = filterStates.length === 0 || permit.states.some(s => filterStates.includes(s.code));

      let matchesDate = true;
      if (filterDateStart) {
        matchesDate = matchesDate && new Date(permit.createdDate) >= new Date(filterDateStart);
      }
      if (filterDateEnd) {
        matchesDate = matchesDate && new Date(permit.createdDate) <= new Date(filterDateEnd);
      }

      return matchesTab && matchesSearch && matchesState && matchesDate;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case 'state':
          return (a.states[0]?.code || '').localeCompare(b.states[0]?.code || '');
        case 'driver':
          return a.driver.localeCompare(b.driver);
        case 'created_desc':
        default:
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });
  }, [activeTab, searchQuery, filterStates, filterDateStart, filterDateEnd, sortBy]);

  // Filter for AUTOFILL LIST
  const filteredAutofillPermits = useMemo(() => {
    return MOCK_PERMITS.filter(permit => {
      // Filter to only show trips where current pilot car driver is assigned
      const isPilotAssigned = permit.pilotCarAssignments && 
        (permit.pilotCarAssignments.leadPilot === CURRENT_PILOT_DRIVER || 
         permit.pilotCarAssignments.chasePilot === CURRENT_PILOT_DRIVER);
      
      if (!isPilotAssigned) return false;
      
      let matchesTab = false;
      if (autofillTab === 'Open') matchesTab = permit.status === 'Open';
      else if (autofillTab === 'In Transit') matchesTab = permit.status === 'In Transit';
      else if (autofillTab === 'Action Required') matchesTab = permit.status === 'Action Required';
      else if (autofillTab === 'Completed') matchesTab = permit.status === 'Completed';
      else matchesTab = false;

      const matchesSearch = 
        permit.requestId.toLowerCase().includes(autofillSearch.toLowerCase()) ||
        permit.driver.toLowerCase().includes(autofillSearch.toLowerCase()) ||
        (permit.permitNumber && permit.permitNumber.toLowerCase().includes(autofillSearch.toLowerCase())) ||
        permit.origin.toLowerCase().includes(autofillSearch.toLowerCase());

      const matchesDriver = filterDriver === 'all' || permit.driver === filterDriver;

      return matchesTab && matchesSearch && matchesDriver;
    });
  }, [autofillTab, autofillSearch, filterDriver]);

  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter(job => {
     const matchesSearch = 
        job.id.toLowerCase().includes(jobSearch.toLowerCase()) || 
        job.origin.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.destination.toLowerCase().includes(jobSearch.toLowerCase());
     
     const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
     const matchesVehicle = vehicleFilter === 'all' || job.vehicleType.toLowerCase().replace(' ', '-') === vehicleFilter;

     return matchesSearch && matchesStatus && matchesVehicle;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (vehicleFilter !== 'all' ? 1 : 0);

  const toggleTempState = (state: string) => {
    setTempFilterStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handleApplyFilters = () => {
    setFilterStates(tempFilterStates);
    setFilterDateStart(tempDateStart);
    setFilterDateEnd(tempDateEnd);
  };

  const clearFilters = () => {
    setTempFilterStates([]);
    setTempDateStart('');
    setTempDateEnd('');
    setFilterStates([]);
    setFilterDateStart('');
    setFilterDateEnd('');
  };

  const resetJobFilters = () => {
    setStatusFilter('all');
    setVehicleFilter('all');
  };

  const toggleStateExpansion = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCreateNew = () => {
    setFabOpen(false);
    if (onNavigate) {
      onNavigate('new-permit-application');
    }
  };

  const handleOpenAutofill = () => {
    setFabOpen(false);
    setShowAutofillModal(true);
  };
  
  const handleUseTemplate = () => {
    if (!selectedTemplateId) return;
    
    const template = MOCK_PERMITS.find(p => p.id === selectedTemplateId);
    
    setShowAutofillModal(false);
    if (onNavigate) {
      onNavigate('new-permit-application', { 
        mode: 'autofill', 
        sourcePermitId: selectedTemplateId,
        sourceData: template 
      });
    }
  };

  const handlePermitClick = (permit: Permit) => {
    if (permit.status === 'Action Required' && onNavigate) {
       onNavigate('new-permit-application', { mode: 'revision' }); 
    } else if (onNavigate) {
       onNavigate('view-permit-request', permit);
    }
  };

  const handleOpenJob = (job: PilotJob, tab: 'details' | 'bids' = 'details') => {
    setActiveJob(job);
    setActiveJobTab(tab);
  };

  const PermitItem = ({ permit }: { permit: Permit }) => {
    const isExpanded = expandedStates[permit.id] || false;
    const showStatesCount = 5;
    const remainingStates = permit.states.length - showStatesCount;

    // Find related jobs for this trip
    const relatedJobs = MOCK_JOBS.filter(job => job.tripId === permit.requestId);

    const getStateBadgeStyle = (status: string) => {
      switch (status) {
        case 'Approved': return { bg: '#ecfdf3', text: '#067647', border: '#abefc6' };
        case 'Pending': return { bg: '#eff8ff', text: '#2563eb', border: '#bfdbfe' };
        case 'Rejected': return { bg: '#fef3f2', text: '#b42318', border: '#fecdca' };
        case 'Expired': return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' };
        case 'Not Applied': return { bg: '#fef9f5', text: '#92400e', border: '#fde68a' };
        default: return { bg: '#f9fafb', text: '#374151', border: '#e5e7eb' };
      }
    };

    const getJobStatusColor = (status: string) => {
      switch (status) {
        case 'Open': return 'bg-green-100 text-green-700 border-green-200';
        case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'In Transit': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-[#e6e3df] shadow-[0px_2px_8px_0px_rgba(95,95,95,0.2)] mb-4 overflow-hidden relative">
        {/* Status Header - only for In Transit */}
        {permit.status === 'In Transit' && (
          <div className="bg-[#0b1215] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <div className="absolute inline-flex h-full w-full rounded-full bg-[rgba(0,201,80,0.23)]" />
                <div className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#00c950] top-[2.01px] left-[2.01px]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">In Transit</span>
            </div>
          </div>
        )}

        {/* Trip ID and Status Badge */}
        <div className="bg-[#f7faff] border-t border-[#eff0f3] px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs"><span className="text-[#9a9faa]">TRIP ID:</span> <span className="font-medium text-[#5f6269]">{permit.requestId}</span></p>
            {permit.pilotCarAssignments && (
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#0066cc]" />
                <span className="text-xs font-medium text-[#0066cc]">
                  {permit.pilotCarAssignments.leadPilot === CURRENT_PILOT_DRIVER ? 'Lead Pilot' : 'Chase Pilot'}
                </span>
              </div>
            )}
          </div>
          <div>
            {permit.status === 'In Transit' ? (
              <div className="bg-[#dbeafe] flex gap-1 items-center px-3 py-1 rounded-lg">
                <Navigation className="w-3 h-3 text-[#2383f8]" />
                <span className="text-xs font-medium text-[#2383f8]">In Transit</span>
              </div>
            ) : permit.status === 'Open' ? (
              <div className="bg-[#ecfdf3] border border-[#abefc6] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#067647]">Open</span>
              </div>
            ) : permit.status === 'Action Required' ? (
              <div className="bg-[#FEF3F2] border border-[#FECDCA] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#B42318]">Action Required</span>
              </div>
            ) : permit.status === 'Completed' ? (
              <div className="bg-[#f3f4f6] border border-[#d1d5db] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#6b7280]">Completed</span>
              </div>
            ) : (
              <Badge variant="outline">{permit.status}</Badge>
            )}
          </div>
        </div>

        {/* Route Information */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-start justify-between w-full">
            {/* Origin */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-normal text-[#4a5565] uppercase">Origin</p>
              <p className="text-sm font-medium text-[#0a0a0a]">{permit.origin}</p>
              <p className="text-xs font-medium text-[#4a5565]">{permit.effectiveDate}</p>
            </div>

            {/* Current Location (for In Transit only) */}
            {permit.tracking && (
              <div className="flex-shrink-0 px-2">
                <p className="text-xs font-semibold text-[#06c] text-center">{permit.tracking.currentLocation}</p>
              </div>
            )}

            {/* Destination */}
            <div className="flex flex-col gap-1 items-end">
              <p className="text-xs font-normal text-[#4a5565] uppercase">Destination</p>
              <p className="text-sm font-medium text-[#0a0a0a] text-right">{permit.destination}</p>
              <p className="text-xs font-medium text-[#4a5565] text-right">{permit.expiryDate}</p>
            </div>
          </div>

          {/* Progress Bar (for In Transit only) */}
          {permit.tracking && (
            <div className="w-full">
              <div className="bg-[#d6dbe6] h-[6px] rounded-full overflow-hidden w-full">
                <div 
                  className="bg-[#00a63e] h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${permit.tracking.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Permits */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-medium text-[#4a5565] uppercase tracking-wider">Permit(s):</p>
            <div className="flex gap-2 flex-wrap">
              {permit.states.slice(0, 6).map((state, idx) => {
                const style = getStateBadgeStyle(state.status);
                return (
                  <div 
                    key={idx} 
                    className="px-3 py-1.5 rounded-[5px] border"
                    style={{ 
                      backgroundColor: style.bg, 
                      borderColor: style.border 
                    }}
                  >
                    <span className="text-xs font-medium" style={{ color: style.text }}>
                      {state.code}
                    </span>
                  </div>
                );
              })}
              {permit.states.length > 6 && (
                <div className="bg-[#f9fafb] border border-[#e5e7eb] px-3 py-1.5 rounded-[5px]">
                  <span className="text-xs font-medium text-[#374151]">+{permit.states.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-[#e6e3df]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0066cc]" />
                <span className="text-xs font-semibold text-gray-700">Pilot Car Jobs</span>
              </div>
              <span className="text-sm font-bold text-[#0066cc]">{relatedJobs.length}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-4 py-4 bg-white border-t border-[#e6e3df]">
          {permit.status === 'Open' && (() => {
            // Check if permits have been applied (any state has a status other than 'Not Applied')
            const permitsApplied = permit.states.some(state => 
              state.status !== 'Not Applied'
            );

            if (permitsApplied) {
              return (
                <Button 
                  variant="outline"
                  className="flex-1 h-11 text-[#2383f8] border-[#2383f8] hover:bg-blue-50 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDownloadingPermit(permit);
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download All Permits
                </Button>
              );
            } else {
              // Pilot car drivers cannot apply for permits
              if (userRole === 'pilot-car-driver') {
                return null;
              }
              return (
                <Button 
                  className="flex-1 h-11 bg-[#16a34a] hover:bg-green-700 text-white font-semibold shadow-md gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Apply all permits - change all state statuses to 'Pending'
                    const updatedPermit = MOCK_PERMITS.find(p => p.id === permit.id);
                    if (updatedPermit) {
                      updatedPermit.states = updatedPermit.states.map(state => ({
                        ...state,
                        status: 'Pending'
                      }));
                      // Force re-render
                      setExpandedStates({ ...expandedStates });
                    }
                  }}
                >
                  <Check className="w-4 h-4" />
                  Apply for All Permits
                </Button>
              );
            }
          })()}
          {permit.status === 'Action Required' && (
            <Button 
              className="flex-1 h-11 bg-[#dc2626] hover:bg-red-700 text-white font-semibold gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handlePermitClick(permit);
              }}
            >
              Fix Issues
            </Button>
          )}
          {(permit.status === 'In Transit' || permit.status === 'Completed') && (
            <Button 
              variant="outline"
              className="flex-1 h-11 text-[#2383f8] border-[#2383f8] hover:bg-blue-50 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setDownloadingPermit(permit);
              }}
            >
              <Download className="w-4 h-4" />
              Download Permit(s)
            </Button>
          )}
          <Button 
            variant="outline" 
            className="h-11 px-6 text-[#344054] border-[#D0D5DD] hover:bg-gray-50 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handlePermitClick(permit);
            }}
          >
            Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] w-full">
      <Header 
        showMenuButton={true} 
        onMenuClick={onToggleSidebar} 
        title="Manage Trips" 
        notificationCount={2}
        onNotificationClick={() => onNavigate?.('notifications')}
      />
      
      {/* Top-level Tabs */}
      <div className="px-4 pt-3 bg-white border-b border-[#e6e3df] hidden">
        <Tabs value={mainView} onValueChange={(v: any) => setMainView(v)} className="w-full">
          <TabsList className="bg-transparent p-0 gap-3 justify-start w-full border-b-0 mb-0">
            <TabsTrigger 
              value="trips" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0066cc] data-[state=active]:bg-transparent bg-transparent px-3 pb-2 data-[state=active]:text-[#0066cc] text-gray-600 data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4 mr-2" />
              Trips
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0066cc] data-[state=active]:bg-transparent bg-transparent px-3 pb-2 data-[state=active]:text-[#0066cc] text-gray-600 data-[state=active]:shadow-none"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Trips View */}
      {mainView === 'trips' && (
        <>
          <div className="px-4 py-3 bg-white border-b border-[#e6e3df]">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
                 <Input 
                   placeholder="Search by ID, driver, or location" 
                   className="pl-9 bg-white border-[#D0D5DD] rounded-lg h-10 text-[14px]"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-[#D0D5DD]">
                       <Filter className="w-4 h-4 text-[#344054]" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="bottom" className="rounded-t-xl h-[80vh]" aria-describedby={undefined}>
                    <SheetHeader className="text-left mb-4">
                       <SheetTitle>Filter Trips</SheetTitle>
                       <SheetDescription>
                          Narrow down the trip list by applying filters.
                       </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 overflow-y-auto pb-20">
                       <div className="space-y-3">
                          <Label className="text-base">States</Label>
                          <div className="grid grid-cols-4 gap-2">
                             {['NY', 'NJ', 'PA', 'CT', 'MA', 'MD', 'VA', 'NC', 'SC', 'GA', 'FL', 'CA', 'TX'].map(state => (
                                <div 
                                   key={state}
                                   onClick={() => toggleTempState(state)}
                                   className={`
                                      flex items-center justify-center h-10 rounded-lg border cursor-pointer text-sm font-medium transition-colors
                                      ${tempFilterStates.includes(state) 
                                         ? 'bg-blue-50 border-blue-600 text-blue-700' 
                                         : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                                >
                                   {state}
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-base">Date Range</Label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label className="text-xs text-gray-500">From</Label>
                                <Input type="date" value={tempDateStart} onChange={(e) => setTempDateStart(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs text-gray-500">To</Label>
                                <Input type="date" value={tempDateEnd} onChange={(e) => setTempDateEnd(e.target.value)} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-base">Sort By</Label>
                          <RadioGroup value={sortBy} onValueChange={setSortBy}>
                             <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-lg">
                                <RadioGroupItem value="created_desc" id="r1" />
                                <Label htmlFor="r1" className="flex-1 cursor-pointer">Newest First</Label>
                             </div>
                             <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-lg">
                                <RadioGroupItem value="created_asc" id="r2" />
                                <Label htmlFor="r2" className="flex-1 cursor-pointer">Oldest First</Label>
                             </div>
                             <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-lg">
                                <RadioGroupItem value="state" id="r3" />
                                <Label htmlFor="r3" className="flex-1 cursor-pointer">State (A-Z)</Label>
                             </div>
                          </RadioGroup>
                       </div>
                    </div>

                    <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex flex-row gap-3 sm:justify-between">
                       <Button variant="outline" className="flex-1" onClick={clearFilters}>Reset</Button>
                       <SheetClose asChild>
                          <Button className="flex-1 bg-[#0066cc]" onClick={handleApplyFilters}>Apply Filters</Button>
                       </SheetClose>
                    </SheetFooter>
                 </SheetContent>
              </Sheet>
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="bg-transparent p-0 gap-2 justify-start w-full">
                  <TabsTrigger value="Open" className="rounded-full border border-gray-200 bg-white data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 px-4">
                    Open
                  </TabsTrigger>
                  <TabsTrigger value="In Transit" className="rounded-full border border-gray-200 bg-white data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 px-4">
                    In Transit
                  </TabsTrigger>
                  <TabsTrigger value="Action Required" className="rounded-full border border-gray-200 bg-white data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 px-4">
                    Action Required
                  </TabsTrigger>
                  <TabsTrigger value="Completed" className="rounded-full border border-gray-200 bg-white data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 px-4">
                    Completed
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </Tabs>
          </div>

          <div className="px-4 py-4 pb-24">
            {filteredPermits.length > 0 ? (
              filteredPermits.map(permit => (
                <PermitItem key={permit.id} permit={permit} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FileInput className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No trips found</h3>
                <p className="text-sm text-gray-500 max-w-[200px] mb-6">
                  There are no {activeTab.toLowerCase()} trips matching your criteria.
                </p>
                {userRole !== 'pilot-car-driver' && (
                  <Button onClick={() => setFabOpen(true)} variant="outline" className="border-dashed border-gray-300 text-gray-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Trip
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* FAB button - only for dispatchers */}
          {userRole !== 'pilot-car-driver' && !fabOpen && (
            <Button 
              className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-[#0066cc] shadow-lg hover:bg-blue-700 z-50 flex items-center justify-center"
              onClick={() => setFabOpen(true)}
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          )}

          {userRole !== 'pilot-car-driver' && fabOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setFabOpen(false)}>
              <div className="absolute bottom-24 right-4 flex flex-col gap-3 items-end">
                <div className="flex items-center gap-3">
                  <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md">Autofill from Previous</span>
                  <Button 
                    size="icon" 
                    className="h-12 w-12 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                    onClick={(e) => { e.stopPropagation(); handleOpenAutofill(); }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md">New Trip Application</span>
                  <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-[#0066cc] text-white hover:bg-blue-700 shadow-lg"
                    onClick={(e) => { e.stopPropagation(); handleCreateNew(); }}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Download Drawer */}
          <Drawer open={!!downloadingPermit} onOpenChange={(open) => !open && setDownloadingPermit(null)}>
            <DrawerContent aria-describedby={undefined}>
              <DrawerHeader>
                <DrawerTitle>Download Permits</DrawerTitle>
                <DrawerDescription>
                  Select the state permits you wish to download for Trip {downloadingPermit?.requestId}.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                 {downloadingPermit?.states
                   .filter(s => s.status === 'Approved' && s.permitNumber)
                   .map(state => (
                     <div key={state.code} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center gap-3">
                           <div className="bg-blue-50 p-2 rounded text-blue-600 font-bold w-10 text-center">
                              {state.code}
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-900">{STATE_NAMES[state.code] || state.code} Permit #{state.permitNumber}</p>
                              <p className="text-xs text-gray-500">Expires: {state.expiryDate}</p>
                           </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                           <Download className="w-4 h-4" />
                        </Button>
                     </div>
                   ))
                 }
                 {downloadingPermit?.states.filter(s => s.status === 'Approved').length === 0 && (
                    <p className="text-center text-gray-500 py-4">No approved permits available for download yet.</p>
                 )}
              </div>
              <DrawerFooter>
                 <Button className="w-full bg-[#0066cc]">Download All Available</Button>
                 <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                 </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Autofill Modal */}
          <Drawer open={showAutofillModal} onOpenChange={setShowAutofillModal}>
             <DrawerContent className="h-[90vh]" aria-describedby={undefined}>
                <DrawerHeader className="text-left border-b pb-4">
                   <DrawerTitle>Select Trip Template</DrawerTitle>
                   <DrawerDescription>
                      Choose a previous trip to copy details from.
                   </DrawerDescription>
                </DrawerHeader>
                
                <div className="p-4 space-y-4">
                   <div className="flex gap-2">
                      <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                         <Input 
                            placeholder="Search..." 
                            className="pl-9"
                            value={autofillSearch}
                            onChange={(e) => setAutofillSearch(e.target.value)}
                         />
                      </div>
                   </div>

                   <Tabs value={autofillTab} onValueChange={setAutofillTab}>
                      <TabsList className="grid w-full grid-cols-4">
                         <TabsTrigger value="Approved">Approved</TabsTrigger>
                         <TabsTrigger value="Submitted">Pending</TabsTrigger>
                         <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                         <TabsTrigger value="Expired">Expired</TabsTrigger>
                      </TabsList>
                   </Tabs>

                   <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                      {filteredAutofillPermits.map(permit => (
                         <div 
                            key={permit.id}
                            onClick={() => setSelectedTemplateId(permit.id)}
                            className={`
                               p-3 rounded-lg border cursor-pointer transition-all
                               ${selectedTemplateId === permit.id 
                                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                  : 'border-gray-200 bg-white hover:border-blue-300'}`}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <span className="font-bold text-gray-900">{permit.requestId}</span>
                               <span className="text-xs text-gray-500">{permit.createdDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                               <MapPin className="h-3.5 w-3.5 text-gray-400" />
                               <span className="truncate max-w-[200px]">{permit.origin}</span>
                               <ArrowRight className="h-3 w-3" />
                               <span className="truncate max-w-[200px]">{permit.destination}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                               <Truck className="h-3.5 w-3.5 text-gray-400" />
                               <span>{permit.truck?.unit || 'N/A'}</span>
                            </div>
                         </div>
                      ))}
                      
                      {filteredAutofillPermits.length === 0 && (
                         <div className="text-center py-8 text-gray-500">
                            No trips found matching criteria.
                         </div>
                      )}
                   </div>
                </div>

                <DrawerFooter className="border-t pt-4">
                   <Button 
                      className="w-full bg-[#0066cc]" 
                      disabled={!selectedTemplateId}
                      onClick={handleUseTemplate}
                   >
                      Use Selected Template
                   </Button>
                   <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                   </DrawerClose>
                </DrawerFooter>
             </DrawerContent>
          </Drawer>
        </>
      )}

      {/* Jobs View */}
      {mainView === 'jobs' && (
        <>
          <div className="relative z-20 bg-[#f6f6f6] pt-6 px-4 pb-24">
            <div className="max-w-3xl mx-auto space-y-5">
              
              {/* Search and Filter */}
              <div className="flex gap-3">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search job ID, origin, destination..." 
                      className="pl-9 bg-white border-gray-200 h-11 shadow-sm"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                    />
                 </div>
                 
                 <Drawer>
                   <DrawerTrigger asChild>
                     <Button 
                       variant="outline"
                       className={`bg-white border-gray-200 h-11 px-3 shadow-sm relative ${activeFiltersCount > 0 ? 'text-[#0066cc] border-blue-200 bg-blue-50' : ''}`}
                     >
                        <Filter className="h-4 w-4 text-gray-500 mr-2" />
                        Filter
                        {activeFiltersCount > 0 && (
                          <span className="ml-2 bg-[#0066cc] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                     </Button>
                   </DrawerTrigger>
                   <DrawerContent aria-describedby={undefined}>
                     <div className="max-w-3xl mx-auto w-full">
                       <DrawerHeader>
                         <DrawerTitle>Filter Jobs</DrawerTitle>
                         <DrawerDescription>
                           Narrow down the list of pilot car jobs.
                         </DrawerDescription>
                       </DrawerHeader>
                       
                       <div className="p-4 space-y-6">
                         <div className="space-y-3">
                           <Label className="text-sm font-bold text-gray-900">Job Status</Label>
                           <RadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="all" id="status-all" />
                               <Label htmlFor="status-all" className="font-normal">All Statuses</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="open" id="status-open" />
                               <Label htmlFor="status-open" className="font-normal">Open</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="assigned" id="status-assigned" />
                               <Label htmlFor="status-assigned" className="font-normal">Assigned</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="completed" id="status-completed" />
                               <Label htmlFor="status-completed" className="font-normal">Completed</Label>
                             </div>
                           </RadioGroup>
                         </div>

                         <div className="h-px bg-gray-100" />

                         <div className="space-y-3">
                           <Label className="text-sm font-bold text-gray-900">Vehicle Type</Label>
                           <RadioGroup value={vehicleFilter} onValueChange={setVehicleFilter}>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="all" id="vehicle-all" />
                               <Label htmlFor="vehicle-all" className="font-normal">All Vehicles</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="high-pole" id="vehicle-hp" />
                               <Label htmlFor="vehicle-hp" className="font-normal">High Pole</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="lead" id="vehicle-lead" />
                               <Label htmlFor="vehicle-lead" className="font-normal">Lead</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="chase" id="vehicle-chase" />
                               <Label htmlFor="vehicle-chase" className="font-normal">Chase</Label>
                             </div>
                           </RadioGroup>
                         </div>
                       </div>

                       <DrawerFooter className="flex-col sm:flex-col gap-2">
                         <DrawerClose asChild>
                           <Button className="w-full bg-[#0066cc] hover:bg-blue-700">Show {filteredJobs.length} Jobs</Button>
                         </DrawerClose>
                         <Button variant="ghost" onClick={resetJobFilters} className="w-full">
                           Reset Filters
                         </Button>
                       </DrawerFooter>
                     </div>
                   </DrawerContent>
                 </Drawer>
              </div>

              {/* Job List */}
              <div className="space-y-4">
                 {filteredJobs.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
                       <p className="text-gray-500">No jobs found matching your filters.</p>
                       <Button variant="link" onClick={resetJobFilters} className="text-[#0066cc]">
                         Clear all filters
                       </Button>
                    </div>
                 ) : (
                    filteredJobs.map(job => (
                       <div 
                         key={job.id} 
                         className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                         onClick={() => handleOpenJob(job, 'details')}
                       >
                          <div className="p-5">
                             <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                   <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{job.id}</span>
                                      <span>•</span>
                                      <span>Posted {job.postedDate}</span>
                                   </div>
                                   <h3 className="text-lg font-bold text-gray-900 flex items-center flex-wrap gap-2 group-hover:text-[#0066cc] transition-colors">
                                      {job.origin} 
                                      <ArrowRight className="h-4 w-4 text-gray-400" /> 
                                      {job.destination}
                                   </h3>
                                </div>
                                <Badge variant="secondary" className={`${
                                   job.status === 'Open' ? 'bg-green-100 text-green-700' : 
                                   job.status === 'Assigned' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                } border-0 px-3 py-1`}>
                                   {job.status}
                                </Badge>
                             </div>

                             <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                                <div className="space-y-1">
                                   <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pickup Date</span>
                                   <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                      <Calendar className="h-4 w-4 text-[#0066cc]" />
                                      {job.pickupDate}
                                   </div>
                                </div>
                                <div className="space-y-1">
                                   <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Required Vehicle</span>
                                   <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                      <Truck className="h-4 w-4 text-[#0066cc]" />
                                      {job.numberOfVehicles}x {job.vehicleType}
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <div className="bg-blue-50 p-1.5 rounded-full">
                                      <Users className="h-4 w-4 text-[#0066cc]" />
                                   </div>
                                   <span className="text-sm font-medium text-gray-700">
                                      {job.bids.length} {job.bids.length === 1 ? 'Bid' : 'Bids'} Received
                                   </span>
                                </div>
                                <Button 
                                   variant="outline" 
                                   size="sm" 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleOpenJob(job, 'bids');
                                   }}
                                   className="border-[#0066cc] text-[#0066cc] hover:bg-blue-50"
                                >
                                   View Bids
                                </Button>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
            </div>
          </div>

          {/* Job FAB */}
          <Button 
            className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-[#0066cc] shadow-lg hover:bg-blue-700 z-50 flex items-center justify-center"
            onClick={() => onNavigate?.('add-job')}
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>

          {/* Job Details Drawer */}
          <Drawer open={!!activeJob} onOpenChange={(open) => !open && setActiveJob(null)}>
             <DrawerContent aria-describedby={undefined}>
                <div className="max-w-3xl mx-auto w-full max-h-[85vh] flex flex-col">
                  <DrawerHeader className="text-left flex-none">
                     <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                           {activeJob?.id}
                        </Badge>
                        <Badge variant="secondary" className={`${
                           activeJob?.status === 'Open' ? 'bg-green-100 text-green-700' : 
                           activeJob?.status === 'Assigned' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                        }`}>
                           {activeJob?.status}
                        </Badge>
                     </div>
                     <DrawerTitle className="text-xl">
                        {activeJob?.origin} to {activeJob?.destination}
                     </DrawerTitle>
                     <DrawerDescription>
                        {activeJob?.numberOfVehicles}x {activeJob?.vehicleType} required for {activeJob?.pickupDate}
                     </DrawerDescription>
                  </DrawerHeader>

                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                     <Tabs value={activeJobTab} onValueChange={setActiveJobTab} className="w-full">
                        <TabsList className="w-full grid grid-cols-2 mb-6">
                           <TabsTrigger value="details">Job Details</TabsTrigger>
                           <TabsTrigger value="bids">
                              Bids ({activeJob?.bids.length})
                           </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                           
                           {/* Route Information Banner */}
                           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-3">
                                 <MapPin className="w-5 h-5 text-blue-600" />
                                 <h3 className="font-semibold text-blue-900">Route Information</h3>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-2 flex-1">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
                                    <div className="min-w-0">
                                       <p className="text-xs text-blue-700">From</p>
                                       <p className="font-semibold text-sm text-blue-900 truncate">
                                          {activeJob?.origin || "N/A"}
                                       </p>
                                    </div>
                                 </div>
                                 <Navigation className="w-4 h-4 text-blue-600 rotate-90 flex-shrink-0" />
                                 <div className="flex items-center gap-2 flex-1">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0" />
                                    <div className="min-w-0">
                                       <p className="text-xs text-blue-700">To</p>
                                       <p className="font-semibold text-sm text-blue-900 truncate">
                                          {activeJob?.destination || "N/A"}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Job Overview */}
                           <Collapsible open={jobDetailsSections.overview} onOpenChange={() => toggleJobDetailsSection("overview")}>
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                 <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                       <div className="flex items-center gap-3">
                                          <div className="p-2 rounded-lg bg-blue-100">
                                             <FileText className="w-5 h-5 text-blue-600" />
                                          </div>
                                          <div className="text-left">
                                             <h3 className="font-semibold text-gray-900">Job Overview</h3>
                                             <p className="text-xs text-gray-500">Basic job information</p>
                                          </div>
                                       </div>
                                       {jobDetailsSections.overview ? (
                                          <ChevronUp className="w-5 h-5 text-gray-400" />
                                       ) : (
                                          <ChevronDown className="w-5 h-5 text-gray-400" />
                                       )}
                                    </div>
                                 </CollapsibleTrigger>
                                 
                                 <CollapsibleContent>
                                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                                       <div className="grid grid-cols-2 gap-3 pt-4">
                                          <div>
                                             <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                                             <p className="font-medium text-sm text-gray-900">
                                                {activeJob?.vehicleType || "N/A"}
                                             </p>
                                          </div>
                                          <div>
                                             <p className="text-xs text-gray-500 mb-1">Number Required</p>
                                             <div className="flex items-center gap-1.5">
                                                <Truck className="w-4 h-4 text-gray-400" />
                                                <p className="font-medium text-sm text-gray-900">
                                                   {activeJob?.numberOfVehicles || "N/A"}
                                                </p>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-2 gap-3">
                                          <div>
                                             <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
                                             <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="font-medium text-sm text-gray-900">
                                                   {activeJob?.pickupDate || "N/A"}
                                                </p>
                                             </div>
                                          </div>
                                          {activeJob?.deliveryDate && (
                                             <div>
                                                <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                                                <div className="flex items-center gap-1.5">
                                                   <Calendar className="w-4 h-4 text-gray-400" />
                                                   <p className="font-medium text-sm text-gray-900">
                                                      {activeJob.deliveryDate}
                                                   </p>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </CollapsibleContent>
                              </div>
                           </Collapsible>

                           {/* Load Information */}
                           {(activeJob?.freightDesc || activeJob?.dims) && (
                              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                 <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-600" />
                                    Load Information
                                 </h3>
                                 {activeJob?.freightDesc && (
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                                       <p className="text-xs text-gray-500 mb-1">Description</p>
                                       <p className="text-sm">{activeJob.freightDesc}</p>
                                    </div>
                                 )}
                                 {activeJob?.dims && (
                                    <div className="grid grid-cols-2 gap-3">
                                       {activeJob.dims.height && (
                                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                                             <p className="text-xs text-gray-500 mb-1">Height</p>
                                             <p className="font-medium text-sm">{activeJob.dims.height}</p>
                                          </div>
                                       )}
                                       {activeJob.dims.width && (
                                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                                             <p className="text-xs text-gray-500 mb-1">Width</p>
                                             <p className="font-medium text-sm">{activeJob.dims.width}</p>
                                          </div>
                                       )}
                                       {activeJob.dims.length && (
                                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                                             <p className="text-xs text-gray-500 mb-1">Length</p>
                                             <p className="font-medium text-sm">{activeJob.dims.length}</p>
                                          </div>
                                       )}
                                       {activeJob.dims.weight && (
                                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                                             <p className="text-xs text-gray-500 mb-1">Weight</p>
                                             <p className="font-medium text-sm">{activeJob.dims.weight}</p>
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           )}

                           {/* Break and Waiting Time Tracking (for In Transit jobs) */}
                           {activeJob?.status === 'In Transit' && (() => {
                              const acceptedBid = activeJob.bids.find((bid: any) => bid.status === 'Accepted');
                              const isJobActive = acceptedBid?.jobStatus === 'In Progress';
                              
                              if (!isJobActive) return null;
                              
                              return (
                                 <TimeTrackingSection
                                    breakTimeActive={breakTimeActive}
                                    setBreakTimeActive={setBreakTimeActive}
                                    breakStartTime={breakStartTime}
                                    setBreakStartTime={setBreakStartTime}
                                    totalBreakTime={totalBreakTime}
                                    setTotalBreakTime={setTotalBreakTime}
                                    waitingTimeActive={waitingTimeActive}
                                    setWaitingTimeActive={setWaitingTimeActive}
                                    waitingStartTime={waitingStartTime}
                                    setWaitingStartTime={setWaitingStartTime}
                                    totalWaitingTime={totalWaitingTime}
                                    setTotalWaitingTime={setTotalWaitingTime}
                                 />
                              );
                           })()}

                           {/* Time Tracking for accepted jobs */}
                           {(() => {
                              const acceptedBid = activeJob?.bids.find((bid: any) => bid.status === 'Accepted');
                              if (!acceptedBid || !acceptedBid.jobStatus) return null;
                              
                              const calculateElapsedTime = () => {
                                 if (!acceptedBid.startTime) return null;
                                 const start = new Date(acceptedBid.startTime);
                                 const end = acceptedBid.endTime ? new Date(acceptedBid.endTime) : new Date();
                                 const diffMs = end.getTime() - start.getTime();
                                 const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                 const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                 return { hours, minutes };
                              };

                              const elapsed = calculateElapsedTime();
                              
                              const getStatusColor = (status: string) => {
                                 switch(status) {
                                    case 'Not Started': return 'bg-gray-100 text-gray-700 border-gray-200';
                                    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
                                    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
                                    default: return 'bg-gray-100 text-gray-700 border-gray-200';
                                 }
                              };

                              return (
                                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                             <div className="p-1.5 rounded-lg bg-indigo-600">
                                                <Clock className="w-4 h-4 text-white" />
                                             </div>
                                             <h3 className="font-semibold text-gray-900">Time Tracking</h3>
                                          </div>
                                          <Badge variant="outline" className={`${getStatusColor(acceptedBid.jobStatus)} text-xs font-semibold`}>
                                             {acceptedBid.jobStatus}
                                          </Badge>
                                       </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                       <div className="grid grid-cols-2 gap-4">
                                          {acceptedBid.startTime && (
                                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Start Time</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                   {new Date(acceptedBid.startTime).toLocaleString('en-US', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      hour: 'numeric',
                                                      minute: '2-digit',
                                                      hour12: true
                                                   })}
                                                </p>
                                             </div>
                                          )}
                                          
                                          {acceptedBid.endTime && (
                                             <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">End Time</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                   {new Date(acceptedBid.endTime).toLocaleString('en-US', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      hour: 'numeric',
                                                      minute: '2-digit',
                                                      hour12: true
                                                   })}
                                                </p>
                                             </div>
                                          )}
                                          
                                          {acceptedBid.jobStatus === 'In Progress' && !acceptedBid.endTime && (
                                             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Status</p>
                                                <div className="flex items-center gap-2">
                                                   <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                   <p className="text-sm font-bold text-blue-700">Active Now</p>
                                                </div>
                                             </div>
                                          )}
                                       </div>

                                       {elapsed && (
                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                             <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 font-medium">
                                                   {acceptedBid.jobStatus === 'Completed' ? 'Total Duration' : 'Elapsed Time'}
                                                </span>
                                                <span className="text-lg font-bold text-gray-900">
                                                   {elapsed.hours}h {elapsed.minutes}m
                                                </span>
                                             </div>
                                          </div>
                                       )}

                                       {acceptedBid.jobStatus === 'Not Started' && (
                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                             <p className="text-sm text-gray-600">Job has not started yet</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })()}

                           {/* Pricing */}
                           {activeJob?.price && (
                              <Collapsible open={jobDetailsSections.pricing} onOpenChange={() => toggleJobDetailsSection("pricing")}>
                                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <CollapsibleTrigger className="w-full">
                                       <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                          <div className="flex items-center gap-3">
                                             <div className="p-2 rounded-lg bg-emerald-100">
                                                <span className="text-lg font-semibold text-emerald-600">$</span>
                                             </div>
                                             <div className="text-left">
                                                <h3 className="font-semibold text-gray-900">Pricing</h3>
                                                <p className="text-xs text-gray-500">Rate and payment info</p>
                                             </div>
                                          </div>
                                          {jobDetailsSections.pricing ? (
                                             <ChevronUp className="w-5 h-5 text-gray-400" />
                                          ) : (
                                             <ChevronDown className="w-5 h-5 text-gray-400" />
                                          )}
                                       </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                       <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
                                          <div>
                                             <p className="text-xs text-gray-500 mb-2">Pricing Type</p>
                                             <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <p className="font-semibold text-sm text-emerald-900">
                                                   {activeJob.price.type || "N/A"}
                                                </p>
                                             </div>
                                          </div>
                                          <div>
                                             <p className="text-xs text-gray-500 mb-1">Amount</p>
                                             <div className="flex items-center gap-2">
                                                <p className="font-semibold text-base text-gray-900">
                                                   ${activeJob.price.value}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    </CollapsibleContent>
                                 </div>
                              </Collapsible>
                           )}

                           {/* Notes */}
                           {activeJob?.notes && (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                 <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold text-amber-900">Notes</h3>
                                 </div>
                                 <p className="text-sm text-amber-900">{activeJob.notes}</p>
                              </div>
                           )}

                        </TabsContent>

                        <TabsContent value="bids" className="space-y-3 animate-in slide-in-from-right-2 duration-300">
                           {activeJob?.bids && activeJob.bids.length > 0 ? (
                              <>
                                 {/* Bids header with count and sort */}
                                 <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-600">
                                       {activeJob.bids.length} active {activeJob.bids.length === 1 ? "bid" : "bids"}
                                    </p>
                                 </div>

                                 {/* Bids list - Accepted bids shown first */}
                                 {[...activeJob.bids]
                                    .sort((a, b) => {
                                       if (a.status === "Accepted") return -1;
                                       if (b.status === "Accepted") return 1;
                                       return 0;
                                    })
                                    .map((bid) => (
                                       <div
                                          key={bid.id}
                                          className={`rounded-xl transition-all relative overflow-hidden ${
                                             bid.status === "Accepted"
                                                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 shadow-lg pt-12 px-4 pb-4"
                                                : "bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md p-4"
                                          }`}
                                       >
                                          {/* Accepted banner */}
                                          {bid.status === "Accepted" && (
                                             <div className="absolute top-0 left-0 right-0">
                                                <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-md">
                                                   <CheckCircle className="w-4 h-4" />
                                                   <span className="font-semibold text-xs uppercase tracking-wide">
                                                      Accepted Winner
                                                   </span>
                                                </div>
                                             </div>
                                          )}

                                          {/* Bid header with company info */}
                                          <div className="flex items-start justify-between mb-3">
                                             <div className="flex items-start gap-3">
                                                <div
                                                   className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                      bid.status === "Accepted" ? "bg-green-600" : "bg-blue-100"
                                                   }`}
                                                >
                                                   <User
                                                      className={`w-5 h-5 ${
                                                         bid.status === "Accepted" ? "text-white" : "text-blue-600"
                                                      }`}
                                                   />
                                                </div>
                                                <div>
                                                   <h4
                                                      className={`font-semibold text-base ${
                                                         bid.status === "Accepted" ? "text-green-800" : "text-gray-900"
                                                      }`}
                                                   >
                                                      {bid.companyName}
                                                   </h4>
                                                   {bid.driverName && (
                                                      <p
                                                         className={`font-medium text-sm ${
                                                            bid.status === "Accepted" ? "text-green-700" : "text-gray-600"
                                                         }`}
                                                      >
                                                         Driver: {bid.driverName}
                                                      </p>
                                                   )}
                                                   <div className="flex items-center gap-2 mt-1">
                                                      {bid.rating && (
                                                         <>
                                                            <div className="flex items-center gap-1">
                                                               <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                               <span className="font-medium text-sm text-gray-900">
                                                                  {bid.rating}
                                                               </span>
                                                            </div>
                                                            <span className="text-gray-300 text-xs">•</span>
                                                         </>
                                                      )}
                                                      {bid.vehicleType && (
                                                         <span className="text-sm text-gray-600">
                                                            {bid.vehicleType}
                                                         </span>
                                                      )}
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="text-right">
                                                <p className="font-semibold text-xl text-blue-600">
                                                   ${typeof bid.amount === 'number' ? bid.amount.toLocaleString() : bid.amount}
                                                </p>
                                                <p className="text-xs text-gray-500">Total Bid</p>
                                             </div>
                                          </div>

                                          {/* Contact Information for Accepted Bids */}
                                          {bid.status === 'Accepted' && (bid.contactPerson || bid.contactPhone || bid.contactEmail) && (
                                             <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Contact Information</p>
                                                <div className="space-y-2">
                                                   {bid.contactPerson && (
                                                      <div className="flex items-center gap-2 text-sm">
                                                         <User className="w-4 h-4 text-gray-500" />
                                                         <span className="font-medium text-gray-900">{bid.contactPerson}</span>
                                                      </div>
                                                   )}
                                                   {bid.contactPhone && (
                                                      <div className="flex items-center gap-2 text-sm">
                                                         <Phone className="w-4 h-4 text-gray-500" />
                                                         <a href={`tel:${bid.contactPhone}`} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                                            {bid.contactPhone}
                                                         </a>
                                                      </div>
                                                   )}
                                                   {bid.contactEmail && (
                                                      <div className="flex items-center gap-2 text-sm">
                                                         <Mail className="w-4 h-4 text-gray-500" />
                                                         <a href={`mailto:${bid.contactEmail}`} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                                            {bid.contactEmail}
                                                         </a>
                                                      </div>
                                                   )}
                                                </div>
                                             </div>
                                          )}

                                          {/* Time Tracking for Accepted Bids */}
                                          {bid.status === 'Accepted' && bid.jobStatus && (
                                             <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                   <p className="text-xs font-semibold text-gray-700 uppercase">Time Tracking</p>
                                                   <Badge variant="outline" className={`text-xs font-semibold ${
                                                      bid.jobStatus === 'Not Started' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                                      bid.jobStatus === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                      'bg-green-100 text-green-700 border-green-200'
                                                   }`}>
                                                      {bid.jobStatus}
                                                   </Badge>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2">
                                                   {bid.startTime && (
                                                      <div className="bg-white border border-indigo-200 rounded-lg p-2">
                                                         <p className="text-xs text-gray-500 mb-0.5">Start Time</p>
                                                         <p className="text-xs font-bold text-gray-900">
                                                            {new Date(bid.startTime).toLocaleString('en-US', {
                                                               month: 'short',
                                                               day: 'numeric',
                                                               hour: 'numeric',
                                                               minute: '2-digit',
                                                               hour12: true
                                                            })}
                                                         </p>
                                                      </div>
                                                   )}
                                                   {bid.endTime && (
                                                      <div className="bg-white border border-green-200 rounded-lg p-2">
                                                         <p className="text-xs text-gray-500 mb-0.5">End Time</p>
                                                         <p className="text-xs font-bold text-gray-900">
                                                            {new Date(bid.endTime).toLocaleString('en-US', {
                                                               month: 'short',
                                                               day: 'numeric',
                                                               hour: 'numeric',
                                                               minute: '2-digit',
                                                               hour12: true
                                                            })}
                                                         </p>
                                                      </div>
                                                   )}
                                                </div>

                                                {bid.startTime && (() => {
                                                   const start = new Date(bid.startTime);
                                                   const end = bid.endTime ? new Date(bid.endTime) : new Date();
                                                   const diffMs = end.getTime() - start.getTime();
                                                   const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                                   const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                                   return (
                                                      <div className="bg-white border border-gray-200 rounded-lg p-2 flex justify-between items-center mt-2">
                                                         <span className="text-xs text-gray-600">
                                                            {bid.jobStatus === 'Completed' ? 'Duration' : 'Elapsed'}
                                                         </span>
                                                         <span className="text-sm font-bold text-gray-900">
                                                            {hours}h {minutes}m
                                                         </span>
                                                      </div>
                                                   );
                                                })()}
                                                
                                                {bid.jobStatus === 'In Progress' && (
                                                   <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg p-2 mt-2">
                                                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                      <span className="text-xs font-semibold">Active Now</span>
                                                   </div>
                                                )}
                                             </div>
                                          )}

                                          {/* Action buttons */}
                                          {activeJob.status === "Open" && bid.status === "Pending" && (
                                             <div className="flex items-center gap-2 mt-4">
                                                <button className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 active:scale-98 transition-all">
                                                   Accept Bid
                                                </button>
                                                <button className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 active:scale-98 transition-all">
                                                   Message
                                                </button>
                                             </div>
                                          )}
                                          {(activeJob.status !== "Open" || bid.status !== "Pending") && (
                                             <div className="flex items-center justify-end mt-4">
                                                <button className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 active:scale-98 transition-all">
                                                   Message
                                                </button>
                                             </div>
                                          )}
                                       </div>
                                    ))
                                 }
                              </>
                           ) : (
                              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                                 <FileText className="w-16 h-16 text-gray-300 mb-4" />
                                 <h3 className="font-semibold text-lg text-gray-600 mb-2">
                                    No bids yet
                                 </h3>
                                 <p className="text-sm text-gray-500 text-center max-w-sm">
                                    Pilot car companies will submit their bids for this job soon.
                                 </p>
                              </div>
                           )}
                        </TabsContent>
                     </Tabs>
                  </div>
                  
                  <DrawerFooter className="flex-none pt-2">
                     <DrawerClose asChild>
                        <Button variant="ghost" className="w-full">Close</Button>
                     </DrawerClose>
                  </DrawerFooter>
                </div>
             </DrawerContent>
          </Drawer>
        </>
      )}
    </div>
  );
}
