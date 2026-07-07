import { 
  ArrowLeft,
  ArrowRight,
  MapPin, 
  Calendar, 
  User, 
  Truck, 
  FileText, 
  CheckCircle2,
  Clock, 
  AlertCircle,
  Box,
  Scale,
  Phone,
  Map as MapIcon,
  Flag,
  Users,
  Star,
  Share2,
  Timer,
  Shield,
  Mail,
  Eye,
  Receipt,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Header from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PilotJob {
  id: string;
  tripId: string;
  status: 'Open' | 'Assigned' | 'In Transit' | 'Completed';
  jobTitle?: string;
  title?: string;
  description?: string;
  origin: string;
  destination: string;
  pickupDate: string;
  endDate?: string;
  vehicleType: string;
  numberOfVehicles?: number;
  route?: string;
  distance?: string;
  startDate?: string;
  jobType?: string;
  requestedPilotCars?: any[];
  bids: Array<{
    id: string;
    companyName: string;
    rating: number;
    amount: number;
    vehicleType: string;
    status: 'Pending' | 'Accepted' | 'Declined';
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    jobStatus?: 'Not Started' | 'In Progress' | 'Completed';
    startTime?: string;
    endTime?: string;
    invoiceApproved?: boolean;
  }>;
  acceptedBid?: {
    id: string;
    companyName: string;
    rating: number;
    amount: number;
    vehicleType: string;
    status: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    jobStatus?: 'Not Started' | 'In Progress' | 'Completed';
    startTime?: string;
    endTime?: string;
    invoiceApproved?: boolean;
  };
}

interface JobDetailsPageProps {
  job: PilotJob;
  onBack: () => void;
  initialTab?: 'details' | 'bids' | 'invoice';
}

export default function JobDetailsPage({ job, onBack, initialTab = 'details' }: JobDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'bids' | 'invoice'>(initialTab);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [breakHistory, setBreakHistory] = useState<Array<{ start: Date; end: Date; duration: number }>>([]);

  const acceptedBid = job.bids.find((bid: any) => bid.status === 'Accepted');
  const isActive = acceptedBid?.jobStatus === 'In Progress';
  const isCompleted = job.status === 'Completed' || acceptedBid?.jobStatus === 'Completed';

  const handleStartJob = () => {
    const confirmStart = window.confirm('Start this job now?');
    if (confirmStart) {
      alert('Job started! Timer is now running.');
    }
  };

  const handleStopJob = () => {
    const confirmStop = window.confirm('End this job? This will stop the timer and mark the job as completed.');
    if (confirmStop) {
      alert('Job ended and marked as completed!');
      // In a real app, this would update the job status to 'Completed'
    }
  };

  const handleStartBreak = () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
  };

  const handleEndBreak = () => {
    if (breakStartTime) {
      const endTime = new Date();
      const breakDuration = Math.floor((endTime.getTime() - breakStartTime.getTime()) / (1000 * 60));
      setTotalBreakTime(prev => prev + breakDuration);
      
      // Add to break history
      setBreakHistory(prev => [...prev, {
        start: breakStartTime,
        end: endTime,
        duration: breakDuration
      }]);
    }
    setIsOnBreak(false);
    setBreakStartTime(null);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-none">
        <Header 
          title="Job Details"
          showBackButton={true}
          onBack={onBack}
          jobNumber={job.id}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Job Details Header */}
        <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Job Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {job.jobTitle || job.title || `${job.origin} to ${job.destination}`}
              </h1>
              
              {/* Status Badges Row */}
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <Badge variant="secondary" className={`text-xs font-semibold px-3 py-1 ${
                  job.status === 'Open' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  job.status === 'Assigned' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                  job.status === 'In Transit' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 
                  'bg-gray-100 border border-gray-200'
                }`}>
                  {job.status}
                </Badge>
                {job.jobType && (
                  <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs font-semibold px-3 py-1">
                    {job.jobType === 'survey' ? 'Survey' : job.jobType === 'convoy' ? 'Convoy' : job.jobType.split(',').map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                  </Badge>
                )}
                {isActive && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    Active Now
                  </Badge>
                )}
              </div>
              
              {/* Quick Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Truck className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium">{job.numberOfVehicles}x {job.vehicleType}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium">{job.pickupDate}</span>
                </div>
                {job.route && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <MapIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{job.route}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Timer Banner for Active Jobs */}
      {isActive && acceptedBid?.startTime && (() => {
        const LiveTimer = () => {
          const [elapsedTime, setElapsedTime] = useState('');
          
          useEffect(() => {
            const updateTimer = () => {
              const start = new Date(acceptedBid.startTime!);
              const now = new Date();
              const diffMs = now.getTime() - start.getTime();
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
              setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
            };
            
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            
            return () => clearInterval(interval);
          }, []);
          
          return (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <div className="max-w-5xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-sm font-bold tabular-nums">{elapsedTime}</span>
                    {acceptedBid.contactPerson && (
                      <span className="text-xs font-medium opacity-90">• {acceptedBid.contactPerson}</span>
                    )}
                  </div>
                  {acceptedBid.contactPhone && (
                    <a 
                      href={`tel:${acceptedBid.contactPhone}`} 
                      className="flex items-center gap-1.5 text-xs font-medium hover:underline bg-white/20 px-3 py-1.5 rounded-full"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        };
        
        return <LiveTimer />;
      })()}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <TabsList className={`w-full ${isCompleted ? 'grid-cols-2' : 'grid-cols-3'} grid mb-6`}>
              {isCompleted ? (
                <>
                  <TabsTrigger value="invoice">
                    Invoice {acceptedBid?.invoiceApproved ? '✓' : ''}
                  </TabsTrigger>
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="bids" data-value="bids">
                    Bids ({job.bids.length})
                  </TabsTrigger>
                  <TabsTrigger value="invoice">
                    Invoice {acceptedBid?.invoiceApproved ? '✓' : ''}
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="details" className="space-y-4 animate-in slide-in-from-left-2 duration-300">
              {/* Job Information */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-white px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Job Information</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Job ID</p>
                      <p className="text-sm font-semibold text-gray-900">{job.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <Badge variant="secondary" className={`text-xs ${
                        job.status === 'Open' ? 'bg-green-100 text-green-700' : 
                        job.status === 'Assigned' ? 'bg-blue-100 text-blue-700' : 
                        'bg-gray-100'
                      }`}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {job.description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700">{job.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                      <p className="text-sm font-semibold text-gray-900">{job.vehicleType}</p>
                    </div>
                    {job.numberOfVehicles && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Number of Vehicles</p>
                        <p className="text-sm font-semibold text-gray-900">{job.numberOfVehicles}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-white px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Route Details</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Route</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <Flag className="w-3 h-3 text-green-700" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{job.origin}</p>
                            <p className="text-xs text-gray-500">Origin</p>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-red-100 rounded-full">
                            <MapPin className="w-3 h-3 text-red-700" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{job.destination}</p>
                            <p className="text-xs text-gray-500">Destination</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {job.route && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Distance</p>
                      <p className="text-sm font-semibold text-gray-900">{job.route}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
                      <p className="text-sm font-semibold text-gray-900">{job.pickupDate}</p>
                    </div>
                    {job.endDate && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                        <p className="text-sm font-semibold text-gray-900">{job.endDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Requested Quotes Summary - for Open for Bidding jobs */}
              {job.status === 'Open' && job.id === 'JOB-105' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-green-100">
                          <Users className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Requested Quotes</h3>
                          <p className="text-xs text-gray-600">3 pilot cars invited • 1 response received</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-white hover:bg-green-50 border-green-300"
                        onClick={() => setActiveTab('bids')}
                      >
                        View in Bids Tab →
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information (for assigned jobs) */}
              {job.status === 'Assigned' && (() => {
                const assignedBid = job.bids.find(bid => bid.status === 'Accepted');
                return assignedBid && (assignedBid.contactPerson || assignedBid.contactPhone || assignedBid.contactEmail) ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-white px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-50">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Pilot Car Contact</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{assignedBid.companyName}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-semibold text-gray-900">{assignedBid.rating}</span>
                        </div>
                      </div>
                      
                      {assignedBid.contactPerson && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{assignedBid.contactPerson}</span>
                        </div>
                      )}
                      {assignedBid.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${assignedBid.contactPhone}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            {assignedBid.contactPhone}
                          </a>
                        </div>
                      )}
                      {assignedBid.contactEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${assignedBid.contactEmail}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            {assignedBid.contactEmail}
                          </a>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {assignedBid.contactPhone && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                            <a href={`tel:${assignedBid.contactPhone}`}>
                              <Phone className="w-3.5 h-3.5 mr-1.5" />
                              Call
                            </a>
                          </Button>
                        )}
                        {assignedBid.contactEmail && (
                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" asChild>
                            <a href={`mailto:${assignedBid.contactEmail}`}>
                              <Mail className="w-3.5 h-3.5 mr-1.5" />
                              Email
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Job Control - Start/Stop Tracking for Assigned Jobs */}
              {job.status === 'Assigned' && (() => {
                const assignedBid = job.bids.find(bid => bid.status === 'Accepted');
                if (!assignedBid) return null;

                const JobTrackingComponent = () => {
                  return (
                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Timer className="w-5 h-5 text-white" />
                          <h3 className="font-bold text-white">Job Tracking</h3>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        {/* Current Status */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Current Status</span>
                            <Badge variant="outline" className={`text-sm font-bold px-3 py-1 ${
                              assignedBid.jobStatus === 'Not Started' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                              assignedBid.jobStatus === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              'bg-green-100 text-green-700 border-green-300'
                            }`}>
                              {assignedBid.jobStatus || 'Not Started'}
                            </Badge>
                          </div>

                          {/* On Break Indicator */}
                          {isOnBreak && assignedBid.jobStatus === 'In Progress' && (
                            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-amber-900">On Break</span>
                              </div>
                            </div>
                          )}

                          {/* Time Information */}
                          {assignedBid.startTime && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                <span className="text-sm text-gray-600">Started</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {new Date(assignedBid.startTime).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              {assignedBid.endTime && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-sm text-gray-600">Ended</span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {new Date(assignedBid.endTime).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </div>
                              )}
                              {totalBreakTime > 0 && (
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-sm text-gray-600">Total Break Time</span>
                                  <span className="text-sm font-bold text-amber-700">
                                    {Math.floor(totalBreakTime / 60)}h {totalBreakTime % 60}m
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Break History */}
                        {breakHistory.length > 0 && (
                          <div className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden">
                            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-700" />
                                <h4 className="font-bold text-amber-900 text-sm">Break History</h4>
                              </div>
                            </div>
                            <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                              {breakHistory.map((breakRecord, index) => (
                                <div 
                                  key={index} 
                                  className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-amber-900">
                                      Break #{breakHistory.length - index}
                                    </span>
                                    <span className="text-xs font-bold text-amber-700">
                                      {breakRecord.duration}m
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">Started:</span>
                                      <div className="font-semibold text-gray-900">
                                        {breakRecord.start.toLocaleString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Ended:</span>
                                      <div className="font-semibold text-gray-900">
                                        {breakRecord.end.toLocaleString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Tips for Active Jobs */}
                        {assignedBid.jobStatus === 'In Progress' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-xs text-blue-900">
                                <p className="font-semibold mb-1">Tips:</p>
                                <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                                  <li>Use "Start Break" for meal or rest breaks</li>
                                  <li>Break time is tracked separately from work time</li>
                                  <li>Complete the job when you reach the destination</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                };

                return <JobTrackingComponent />;
              })()}

              {/* Pilot Car Information - for completed jobs */}
              {isCompleted && acceptedBid && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Pilot Car Information
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {/* Pilot Car Details */}
                      <div>
                        <p className="text-lg font-bold text-gray-900">{acceptedBid.companyName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                            <Star className="w-3 h-3 mr-1 fill-amber-500" /> {acceptedBid.rating}
                          </span>
                          <span>•</span>
                          <span className="text-gray-600">{acceptedBid.vehicleType}</span>
                        </div>
                      </div>

                      {/* Contact Information */}
                      {(acceptedBid.contactPerson || acceptedBid.contactPhone || acceptedBid.contactEmail) && (
                        <div className="border-t border-gray-200 pt-4 space-y-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase">Contact Information</p>
                          <div className="space-y-2">
                            {acceptedBid.contactPerson && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-900">{acceptedBid.contactPerson}</span>
                              </div>
                            )}
                            {acceptedBid.contactPhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a href={`tel:${acceptedBid.contactPhone}`} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                  {acceptedBid.contactPhone}
                                </a>
                              </div>
                            )}
                            {acceptedBid.contactEmail && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <a href={`mailto:${acceptedBid.contactEmail}`} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                  {acceptedBid.contactEmail}
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {acceptedBid.contactPhone && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                <a href={`tel:${acceptedBid.contactPhone}`}>
                                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                                  Call
                                </a>
                              </Button>
                            )}
                            {acceptedBid.contactEmail && (
                              <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" asChild>
                                <a href={`mailto:${acceptedBid.contactEmail}`}>
                                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                                  Email
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bids" className="space-y-3 animate-in slide-in-from-right-2 duration-300">
              {/* Requested Pilot Cars Section - for Open for Bidding jobs */}
              {job.status === 'Open' && job.id === 'JOB-105' && (() => {
                const requestedPilotCars = [
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
                    requestedDate: '2024-11-28',
                    quoteStatus: 'pending',
                    quoteAmount: null,
                    quoteSubmittedDate: null
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
                    requestedDate: '2024-11-28',
                    quoteStatus: 'submitted',
                    quoteAmount: 1250,
                    quoteSubmittedDate: '2024-12-02',
                    notes: 'Available immediately. Can provide both lead and chase services if needed.'
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
                    requestedDate: '2024-11-29',
                    quoteStatus: 'pending',
                    quoteAmount: null,
                    quoteSubmittedDate: null
                  }
                ];
                
                const respondedCount = requestedPilotCars.filter((pc: any) => pc.quoteStatus === 'submitted').length;

                return (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-4 border-b-2 border-green-300 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-600 shadow-sm">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-base">Requested Quotes</h3>
                              <p className="text-xs text-gray-700 font-medium mt-1">Direct invitations sent to specific pilot cars</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {respondedCount > 0 && (
                              <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 shadow-sm">
                                {respondedCount} Response{respondedCount !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            <Badge className="bg-green-700 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 shadow-sm">
                              {requestedPilotCars.length} Requested
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        {requestedPilotCars.map((pc: any) => (
                          <div 
                            key={pc.id} 
                            className={`bg-white rounded-lg border-2 p-3 ${
                              pc.quoteStatus === 'submitted' 
                                ? 'border-blue-500 bg-blue-50/30' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-semibold text-sm text-gray-900">{pc.driver}</h5>
                                  <Badge className="bg-[#0066cc] text-white text-xs">{pc.type}</Badge>
                                  {pc.quoteStatus === 'submitted' && (
                                    <Badge className="bg-blue-500 text-white text-xs">
                                      ✓ Quote Received
                                    </Badge>
                                  )}
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
                                <MapIcon className="w-3 h-3 text-gray-400" />
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

                            {/* Quote Information */}
                            {pc.quoteStatus === 'submitted' ? (
                              <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-900">Quote Amount</span>
                                    <span className="text-lg font-bold text-blue-900">${pc.quoteAmount?.toLocaleString()}</span>
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    Submitted on {pc.quoteSubmittedDate}
                                  </div>
                                </div>
                                {pc.notes && (
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Notes from Provider</p>
                                    <p className="text-xs text-gray-700">{pc.notes}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                    Accept Quote
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Quote Status:</span>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Pending Response
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Separator between Requested and Other Bids */}
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-gray-100 px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide rounded-full border border-gray-300">
                          Other Bids
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Regular Bids */}
              {job.bids.map(bid => (
                <div key={bid.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{bid.companyName}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                          <Star className="w-3 h-3 mr-1 fill-amber-500" /> {bid.rating}
                        </span>
                        <span>•</span>
                        <span className="text-gray-600">{bid.vehicleType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-xl font-bold text-gray-900">${bid.amount}</span>
                      {bid.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Decline</Button>
                          <Button size="sm" className="h-8 bg-[#0066cc] text-white hover:bg-blue-700 shadow-sm">Accept Offer</Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{bid.status}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information for Accepted Bids */}
                  {bid.status === 'Accepted' && (bid.contactPerson || bid.contactPhone || bid.contactEmail) && (
                    <div className="border-t border-gray-200 bg-blue-50 p-4 space-y-3">
                      <p className="text-xs font-semibold text-gray-700 uppercase">Contact Information</p>
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
                      
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {bid.contactPhone && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                            <a href={`tel:${bid.contactPhone}`}>
                              <Phone className="w-3.5 h-3.5 mr-1.5" />
                              Call
                            </a>
                          </Button>
                        )}
                        {bid.contactEmail && (
                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" asChild>
                            <a href={`mailto:${bid.contactEmail}`}>
                              <Mail className="w-3.5 h-3.5 mr-1.5" />
                              Email
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Time Tracking for Accepted Bids */}
                  {bid.status === 'Accepted' && bid.jobStatus && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
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
                          <div className="bg-white border border-gray-200 rounded-lg p-2">
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
                          <div className="bg-white border border-gray-200 rounded-lg p-2">
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
                          <div className="bg-white border border-gray-200 rounded-lg p-2 flex justify-between items-center">
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
                        <div className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 rounded-lg p-2">
                          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                          <span className="text-xs font-semibold">Active Now</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="invoice" className="space-y-4 animate-in slide-in-from-right-2 duration-300">
              {acceptedBid?.jobStatus === 'Completed' ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Invoice Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Route</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{job.origin} → {job.destination}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{job.route || '1450 km'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trip Dates</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{job.pickupDate}{job.endDate ? ` - ${job.endDate}` : ''}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Job Type</p>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-xs sm:text-sm">
                          {job.vehicleType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Invoice Line Items Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <h3 className="font-semibold text-gray-900">Invoice Line Items</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs w-fit">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Auto-Calculated
                      </Badge>
                    </div>

                    {/* Invoice Table - Desktop */}
                    <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden mb-4">
                      {/* Table Header */}
                      <div className="bg-gray-50 grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-200">
                        <div className="col-span-5">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Description</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Qty</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Rate</span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Amount</span>
                        </div>
                      </div>

                      {/* Table Rows */}
                      <div className="divide-y divide-gray-200">
                        {/* Base Mileage */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50">
                          <div className="col-span-5">
                            <p className="text-sm font-medium text-gray-900">Base Mileage Charge</p>
                            <p className="text-xs text-gray-500">1450 km</p>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">1,450</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">$2.50</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">$3,625.00</span>
                          </div>
                        </div>

                        {/* Waiting Time */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50">
                          <div className="col-span-5">
                            <p className="text-sm font-medium text-gray-900">Waiting Time</p>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">4.5</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">$50.00</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">$225.00</span>
                          </div>
                        </div>

                        {/* Layover Days */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50">
                          <div className="col-span-5">
                            <p className="text-sm font-medium text-gray-900">Layover Days</p>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">3</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">$200.00</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">$600.00</span>
                          </div>
                        </div>

                        {/* Overtime Hours */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50">
                          <div className="col-span-5">
                            <p className="text-sm font-medium text-gray-900">Overtime Hours</p>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">6.0</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-900">$75.00</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">$450.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Row */}
                      <div className="bg-gray-50 grid grid-cols-12 gap-2 px-4 py-3 border-t-2 border-gray-300">
                        <div className="col-span-9 text-right">
                          <span className="text-base font-semibold text-gray-900">Total Amount</span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="text-xl font-bold text-blue-600">$4,900.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Cards - Mobile */}
                    <div className="sm:hidden space-y-3 mb-4">
                      {/* Base Mileage */}
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Base Mileage Charge</p>
                            <p className="text-xs text-gray-500">1450 km</p>
                          </div>
                          <span className="text-base font-bold text-gray-900">$3,625.00</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span>Qty: 1,450 × Rate: $2.50</span>
                        </div>
                      </div>

                      {/* Waiting Time */}
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Waiting Time</p>
                          </div>
                          <span className="text-base font-bold text-gray-900">$225.00</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span>Qty: 4.5 × Rate: $50.00</span>
                        </div>
                      </div>

                      {/* Layover Days */}
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Layover Days</p>
                          </div>
                          <span className="text-base font-bold text-gray-900">$600.00</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span>Qty: 3 × Rate: $200.00</span>
                        </div>
                      </div>

                      {/* Overtime Hours */}
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Overtime Hours</p>
                          </div>
                          <span className="text-base font-bold text-gray-900">$450.00</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span>Qty: 6.0 × Rate: $75.00</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold text-blue-600">$4,900.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Original Bid vs Invoice Comparison */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-300 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Receipt className="w-4 h-4 text-gray-700" />
                        <h4 className="text-sm font-semibold text-gray-900">Bid Amount Comparison</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Original Bid Amount</p>
                          <p className="text-lg font-bold text-gray-900">${acceptedBid.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Invoice Total</p>
                          <p className="text-lg font-bold text-blue-600">$4,900.00</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Difference</p>
                          <p className={`text-lg font-bold ${4900 - acceptedBid.amount === 0 ? 'text-green-600' : 4900 - acceptedBid.amount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {4900 - acceptedBid.amount === 0 ? '$0.00' : (4900 - acceptedBid.amount > 0 ? '+' : '') + '$' + Math.abs(4900 - acceptedBid.amount).toLocaleString()}
                          </p>
                          {4900 - acceptedBid.amount === 0 && (
                            <p className="text-xs text-green-600 mt-0.5">Matches bid</p>
                          )}
                          {4900 - acceptedBid.amount > 0 && (
                            <p className="text-xs text-amber-600 mt-0.5">Above bid</p>
                          )}
                          {4900 - acceptedBid.amount < 0 && (
                            <p className="text-xs text-green-600 mt-0.5">Below bid</p>
                          )}
                        </div>
                      </div>
                      {4900 - acceptedBid.amount !== 0 && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-800">
                            Invoice amount differs from original bid. Review line items for details on additional charges or credits.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Grace Period Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Grace Period Applied</p>
                          <p className="text-xs text-blue-700 mt-0.5">First 30 minutes of waiting time excluded per policy</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!acceptedBid.invoiceApproved && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="text-gray-700 w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-1.5" />
                          <span className="hidden sm:inline">View Full Invoice</span>
                          <span className="sm:hidden">View Full</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto">
                          <AlertTriangle className="w-4 h-4 mr-1.5" />
                          <span className="hidden sm:inline">Raise Dispute</span>
                          <span className="sm:hidden">Dispute</span>
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Accept Invoice
                        </Button>
                      </div>
                    )}

                    {acceptedBid.invoiceApproved && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900">Invoice Approved</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-1.5" />
                          View Full Invoice
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">No Invoice Available</h3>
                  <p className="text-sm text-gray-600">Invoice will be available once the job is completed</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sticky Floating Action Bar for Job Control - Mobile Optimized */}
      {job.status === 'Assigned' && acceptedBid && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl z-50">
          <div className="max-w-5xl mx-auto px-4 py-3">
            {/* Not Started State */}
            {acceptedBid.jobStatus === 'Not Started' && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-xl font-bold rounded-2xl shadow-lg active:scale-98 transition-transform"
                onClick={handleStartJob}
              >
                <Timer className="w-7 h-7 mr-3" />
                Start Job
              </Button>
            )}

            {/* In Progress State - Two Buttons */}
            {acceptedBid.jobStatus === 'In Progress' && (
              <div className="space-y-2">
                {/* Break Status Info */}
                {isOnBreak && (
                  <div className="bg-amber-100 border-2 border-amber-400 rounded-xl px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-amber-900">On Break</span>
                    </div>
                    {totalBreakTime > 0 && (
                      <span className="text-xs font-semibold text-amber-800">
                        Total: {Math.floor(totalBreakTime / 60)}h {totalBreakTime % 60}m
                      </span>
                    )}
                  </div>
                )}
                
                {/* Action Buttons Row */}
                <div className="flex gap-3">
                  {/* Break Button */}
                  {!isOnBreak ? (
                    <Button 
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white h-14 text-base font-bold rounded-xl shadow-md active:scale-98 transition-transform"
                      onClick={handleStartBreak}
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Start Break
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-base font-bold rounded-xl shadow-md active:scale-98 transition-transform"
                      onClick={handleEndBreak}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      End Break
                    </Button>
                  )}
                  
                  {/* End Job Button */}
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white h-14 text-base font-bold rounded-xl shadow-md active:scale-98 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleStopJob}
                    disabled={isOnBreak}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    End Job
                  </Button>
                </div>
              </div>
            )}

            {/* Completed State */}
            {acceptedBid.jobStatus === 'Completed' && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="text-base font-bold text-green-900">Job Completed!</span>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}