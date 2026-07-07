import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ChevronRight,
  CircleStop,
  Timer,
  CheckCircle,
  Play,
  ArrowRight,
  DollarSign,
  Receipt,
  Download,
  Eye
} from 'lucide-react';
import { PilotJobState, getStatusDisplay, calculateElapsedTime } from './PilotJobStateMachine';
import { useState, useEffect } from 'react';

export interface AssignedJob {
  id: string;
  requestId: string;
  tripId: string;
  jobTitle: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  distance: string;
  loadType: string;
  vehicleType: string;
  assignedPay: string;
  requestingCompany: string;
  status: PilotJobState;
  assignedDate: string;
  position: 'Lead' | 'Chase' | 'Front' | 'Rear';
  jobType?: 'Route Survey' | 'Convoy';
  loadSummary?: string;
  loadHeight?: string;
  loadWidth?: string;
  loadLength?: string;
  loadWeight?: string;
  commodityType?: string;
  estimatedPriceRange?: string;
  routeSurveyRequired?: boolean;
  routeSurveyStatus?: 'not-started' | 'in-progress' | 'completed';
  specialInstructions?: string;
  policeEscortRequired?: boolean;
  heightPoleRequired?: boolean;
  specialPermitsRequired?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: 'map' | 'permit' | 'photo';
  }[];
  timeTracking?: {
    acceptedAt?: string;
    startedAt?: string;
    endTime?: string;
    breaks: { duration: number; notes?: string; timestamp: string }[];
    waitingTime: { duration: number; reason: string; timestamp: string }[];
    activeBreak?: { startTime: string } | null;
    activeWaiting?: { startTime: string; reason: string } | null;
  };
  jurisdiction?: {
    state: string;
    code: string;
    activatedAt?: string;
    activatedBy?: string;
    completedAt?: string;
  };
  billingActive?: boolean;
  invoice?: {
    status: 'pending' | 'submitted' | 'approved' | 'paid' | 'rejected';
    invoiceNumber?: string;
    totalAmount?: number;
    submittedAt?: string;
    approvedAt?: string;
    paidAt?: string;
  };
  rateType?: 'flat' | 'per-mile' | 'hourly';
  ratePerMile?: number;
  startOdometer?: { reading: number; photoData?: string; capturedAt?: string };
  endOdometer?: { reading: number; photoData?: string; capturedAt?: string };
  driverName?: string; // Name of truck driver
  driverRating?: {
    overall: number; // Average of all categories
    categories: {
      safety: number;
      driving: number;
      communication: number;
      professionalism: number;
      vehicle: number;
      asset: number;
    };
    comments?: string;
    ratedAt: string;
    ratedBy?: string; // Pilot car name
  };
}

interface AssignedJobCardProps {
  job: AssignedJob;
  onViewDetails: (job: AssignedJob) => void;
  onAcceptJob?: (job: AssignedJob) => void;
  onStartJob?: (job: AssignedJob) => void;
  onStartSurvey?: (job: AssignedJob) => void;
  onContinueSurvey?: (job: AssignedJob) => void;
  onViewSurvey?: (job: AssignedJob) => void;
  onAddBreak?: (job: AssignedJob) => void;
  onAddWaitingTime?: (job: AssignedJob) => void;
  onEndJob?: (job: AssignedJob) => void;
}

export function AssignedJobCard({ 
  job, 
  onViewDetails, 
  onAcceptJob,
  onStartJob,
  onStartSurvey, 
  onContinueSurvey, 
  onViewSurvey,
  onAddBreak,
  onAddWaitingTime,
  onEndJob
}: AssignedJobCardProps) {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  
  useEffect(() => {
    if (job.status === 'in-progress' && job.timeTracking?.startedAt) {
      const interval = setInterval(() => {
        setElapsedTime(calculateElapsedTime(job.timeTracking!.startedAt!));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [job.status, job.timeTracking?.startedAt]);
  
  const statusDisplay = getStatusDisplay(job.status);

  // Status-driven card styling
  const getCardStyle = () => {
    switch (job.status) {
      case 'awaiting-acceptance':
        return 'border-[#E1BEE7] bg-[#FDFAFF]';
      case 'in-progress':
        return 'border-[#FFE0B2] bg-[#FFFCF8]';
      case 'completed':
        return 'border-gray-200 bg-white'; // Removed opacity
      default:
        return 'border-gray-200 bg-white';
    }
  };
  
  // Get payment status for completed jobs
  const getPaymentStatus = (): { label: string; color: string; bgColor: string; borderColor: string } => {
    if (job.status !== 'completed') {
      return { label: '', color: '', bgColor: '', borderColor: '' };
    }
    
    if (!job.invoice) {
      return {
        label: 'Invoice Pending',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
    
    switch (job.invoice.status) {
      case 'pending':
      case 'submitted':
        return {
          label: 'Invoice Submitted',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'approved':
        return {
          label: 'Awaiting Review',
          color: 'text-[#f89823]',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'paid':
        return {
          label: 'Paid',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      default:
        return {
          label: 'Invoice Pending',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  // "Next Step" label based on status
  const getNextStepLabel = (): { text: string; color: string } | null => {
    switch (job.status) {
      case 'awaiting-acceptance':
        return { text: 'Action Required', color: 'text-[#6A1B9A]' };
      case 'upcoming':
        if (job.routeSurveyRequired && job.routeSurveyStatus === 'not-started') {
          return { text: 'Next: Start Survey', color: 'text-[#1E88E5]' };
        }
        return { text: 'Awaiting Activation', color: 'text-gray-500' };
      case 'accepted':
        return { text: 'Next: Start Job', color: 'text-[#C2410C]' };
      case 'in-progress':
        return { text: 'Next: Continue Job', color: 'text-[#C2410C]' };
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  // Compact load summary line
  const getLoadLine = () => {
    const parts: string[] = [];
    if (job.loadType) parts.push(job.loadType);
    if (job.loadWeight) parts.push(job.loadWeight);
    return parts.join(' · ') || 'Load details unavailable';
  };

  // Primary action button based on status
  const getPrimaryActionButton = () => {
    // Survey takes priority if required and status is appropriate
    if (job.routeSurveyRequired && job.status !== 'completed') {
      if (job.routeSurveyStatus === 'not-started' && onStartSurvey) {
        return (
          <Button
            variant="default"
            className="flex-1 bg-blue-600 hover:bg-blue-700 h-[40px] rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onStartSurvey(job);
            }}
          >
            Start Survey
          </Button>
        );
      }
      if (job.routeSurveyStatus === 'in-progress' && onContinueSurvey) {
        return (
          <Button
            variant="default"
            className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-[40px] rounded-lg active:scale-[0.98] transition-all duration-150"
            onClick={(e) => {
              e.stopPropagation();
              onContinueSurvey(job);
            }}
          >
            Continue Survey
          </Button>
        );
      }
    }
    
    switch (job.status) {
      case 'upcoming':
        return (
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg h-[40px] flex items-center justify-center">
            <p className="text-xs text-gray-500">Waiting for activation</p>
          </div>
        );
        
      case 'awaiting-acceptance':
        return onAcceptJob ? (
          <Button
            variant="default"
            className="flex-1 bg-[#6A1B9A] hover:bg-[#5C168A] text-white h-[40px] rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onAcceptJob(job);
            }}
          >
            Accept Job
          </Button>
        ) : null;
        
      case 'accepted':
        return onStartJob ? (
          <Button
            variant="default"
            className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-[40px] rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onStartJob(job);
            }}
          >
            <Play className="w-4 h-4 mr-1.5" />
            Start Job
          </Button>
        ) : null;
        
      case 'in-progress':
        return onEndJob ? (
          <Button
            variant="default"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white h-[40px] rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onEndJob(job);
            }}
          >
            <CircleStop className="w-4 h-4 mr-1.5" />
            Complete Job
          </Button>
        ) : null;
        
      case 'completed':
        // Payment status-based CTAs
        if (!job.invoice) {
          // Invoice Pending - Submit Invoice
          return (
            <Button
              variant="default"
              className="flex-1 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-[40px] rounded-lg font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(job);
              }}
            >
              <Receipt className="w-4 h-4 mr-1.5" />
              Submit Invoice
            </Button>
          );
        }
        
        switch (job.invoice.status) {
          case 'pending':
          case 'submitted':
            // Payment Requested - View Request
            return (
              <Button
                variant="outline"
                className="flex-1 bg-orange-50 border-orange-300 text-[#f89823] hover:bg-orange-100 h-[40px] rounded-lg font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View Request
              </Button>
            );
            
          case 'approved':
            // Payment Processing - View Details
            return (
              <Button
                variant="outline"
                className="flex-1 bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 h-[40px] rounded-lg font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
              >
                <Receipt className="w-4 h-4 mr-1.5" />
                View Details
              </Button>
            );
            
          case 'paid':
            // Paid - View Receipt
            return (
              <Button
                variant="outline"
                className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100 h-[40px] rounded-lg font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
              >
                <Receipt className="w-4 h-4 mr-1.5" />
                View Receipt
              </Button>
            );
            
          default:
            return (
              <Button
                variant="outline"
                className="flex-1 h-[40px] rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
              >
                View Payment
              </Button>
            );
        }
        
      default:
        return null;
    }
  };

  const nextStep = getNextStepLabel();
  
  return (
    <Card 
      className={`transition-all cursor-pointer overflow-hidden ${getCardStyle()} shadow-none hover:shadow-sm`}
      onClick={() => onViewDetails(job)}
    >
      <CardContent className="p-0">
        {/* Header: Job ID, Title, Status */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[11px] text-gray-400">JOB-{job.id}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-500">{job.position} Pilot</span>
              </div>
              <h3 className="text-sm text-gray-900 truncate leading-snug">
                {job.jobTitle}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color} border ${statusDisplay.borderColor} text-[10px] px-2 h-5 shrink-0 shadow-none`}>
                {statusDisplay.label}
              </Badge>
              {job.status === 'completed' && (() => {
                const paymentStatus = getPaymentStatus();
                return (
                  <Badge className={`${paymentStatus.bgColor} ${paymentStatus.color} border ${paymentStatus.borderColor} text-[10px] px-2 h-5 shrink-0 shadow-none`}>
                    <DollarSign className="w-3 h-3 mr-0.5" />
                    {paymentStatus.label}
                  </Badge>
                );
              })()}
            </div>
          </div>
        </div>

        {/* In-Progress Banner — Per Mile */}
        {job.status === 'in-progress' && job.rateType === 'per-mile' && (
          <div className="mx-4 mb-2 rounded-xl overflow-hidden border border-[#f89823]/30">
            <div className="bg-[#f89823] px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="text-[11px] font-semibold text-white">Escort In Progress · Per Mile</span>
              </div>
              <span className="font-mono text-xs text-white">{elapsedTime}</span>
            </div>
            <div className="bg-[#fff7ed] px-3 py-2 grid grid-cols-3 divide-x divide-[#f89823]/20">
              <div className="text-center pr-2">
                <p className="text-[10px] text-[#f89823] font-medium">Rate</p>
                <p className="text-xs font-bold text-gray-900">${job.ratePerMile}/mi</p>
              </div>
              <div className="text-center px-2">
                <p className="text-[10px] text-[#f89823] font-medium">Start Odo</p>
                <p className="text-xs font-bold font-mono text-gray-900">
                  {job.startOdometer ? job.startOdometer.reading.toLocaleString() : '—'}
                </p>
              </div>
              <div className="text-center pl-2">
                <p className="text-[10px] text-[#f89823] font-medium">Started</p>
                <p className="text-xs font-bold text-gray-900">
                  {job.timeTracking?.startedAt
                    ? new Date(job.timeTracking.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Timer for In-Progress Jobs (flat rate) */}
        {job.status === 'in-progress' && job.billingActive && job.rateType !== 'per-mile' && (
          <div className="mx-4 mb-2 bg-[#FFF3E0] border border-[#FFE0B2] rounded-lg px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#C2410C] animate-pulse" />
              <span className="text-[11px] text-[#C2410C]">Billing Active</span>
            </div>
            <span className="font-mono text-sm text-[#C2410C]">
              {elapsedTime}
            </span>
          </div>
        )}

        <div className="px-4 pb-3 space-y-2.5">
          {/* Route: Origin → Destination + Date & Distance */}
          <div>
            <div className="flex items-center gap-1.5 text-sm text-gray-900">
              <span className="truncate">{job.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{job.destination}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                {new Date(job.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs text-gray-500">{job.distance}</span>
            </div>
          </div>

          {/* Load Summary: Single compact line */}
          <p className="text-xs text-gray-500">
            {getLoadLine()}
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Next Step Label + Actions */}
          <div className="space-y-2">
            {nextStep && (
              <p className={`text-[11px] ${nextStep.color}`}>
                {nextStep.text}
              </p>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="h-[40px] rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
              >
                View Details
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
              
              {getPrimaryActionButton()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}