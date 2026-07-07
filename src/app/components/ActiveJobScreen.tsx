import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  ArrowLeft,
  Navigation,
  AlertTriangle,
  MapPin,
  Flag,
  Clock,
  Gauge,
  ChevronRight,
  Timer,
  CircleStop,
  Maximize2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Layers,
  Briefcase
} from 'lucide-react';
import { AssignedJob } from './AssignedJobCard';
import { calculateElapsedTime } from './PilotJobStateMachine';
import { EndJobModal } from './EndJobModal';
import { CompleteJobModal } from './CompleteJobModal';
import {
  InvoiceSubmissionModal,
  InvoiceData,
} from './InvoiceSubmissionModal';
import { OdometerCaptureModal, OdometerReading } from './OdometerCaptureModal';
import { PerMileInvoiceModal, PerMileInvoiceData } from './PerMileInvoiceModal';
import { TimerState } from './ActiveTimerIndicator';

interface ActiveJobScreenProps {
  job: AssignedJob;
  onBack: () => void;
  onJobComplete: (job: AssignedJob) => void;
  onJobUpdate: (job: AssignedJob) => void;
  activeTimer?: TimerState | null;
  onStartTimer?: (timer: TimerState) => void;
  onStopTimer?: () => void;
}

interface RouteStep {
  id: string;
  instruction: string;
  distance: string;
  duration: string;
  icon: 'straight' | 'right' | 'left' | 'slight-right' | 'slight-left';
}

export default function ActiveJobScreen({
  job,
  onBack,
  onJobComplete,
  onJobUpdate,
  activeTimer,
  onStartTimer,
  onStopTimer,
}: ActiveJobScreenProps) {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [showSteps, setShowSteps] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mapMode, setMapMode] = useState<'day' | 'night'>('day');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Modal states
  const [showEndJobModal, setShowEndJobModal] = useState(false);
  const [showCompleteJobModal, setShowCompleteJobModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Per-mile specific state
  const [showOdometerEndModal, setShowOdometerEndModal] = useState(false);
  const [showPerMileInvoiceModal, setShowPerMileInvoiceModal] = useState(false);
  const [capturedEndOdometer, setCapturedEndOdometer] = useState<OdometerReading | null>(null);

  // Update elapsed time
  useEffect(() => {
    if (job.timeTracking?.startedAt) {
      const interval = setInterval(() => {
        setElapsedTime(calculateElapsedTime(job.timeTracking!.startedAt!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [job.timeTracking?.startedAt]);

  // Mock route steps
  const routeSteps: RouteStep[] = [
    { id: '1', instruction: 'Head east on Main Street', distance: '0.5 mi', duration: '2 min', icon: 'straight' },
    { id: '2', instruction: `Turn right onto Highway 65`, distance: '15 mi', duration: '18 min', icon: 'right' },
    { id: '3', instruction: 'Slight right to stay on Highway 65', distance: '45 mi', duration: '52 min', icon: 'slight-right' },
    { id: '4', instruction: 'Turn left onto State Route 12', distance: '8 mi', duration: '12 min', icon: 'left' },
    { id: '5', instruction: 'Destination on the right', distance: '0.2 mi', duration: '1 min', icon: 'straight' },
  ];

  const currentStep = routeSteps[currentStepIndex];
  const remainingSteps = routeSteps.length - currentStepIndex;

  const getDirectionIcon = (icon: string) => {
    switch (icon) {
      case 'right': return '\u21B1';
      case 'left': return '\u21B0';
      case 'slight-right': return '\u2197';
      case 'slight-left': return '\u2196';
      default: return '\u2191';
    }
  };

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < routeSteps.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleEndJob = () => {
    if (job.rateType === 'per-mile') {
      setShowOdometerEndModal(true);
    } else {
      setShowCompleteJobModal(true);
    }
  };

  const handlePerMileOdometerEnd = (reading: OdometerReading) => {
    setCapturedEndOdometer(reading);
    setShowOdometerEndModal(false);
    setShowPerMileInvoiceModal(true);
  };

  const handlePerMileInvoiceSubmit = (invoiceData: PerMileInvoiceData) => {
    const endedAt = new Date().toISOString();
    const completedJob: AssignedJob = {
      ...job,
      status: 'completed',
      billingActive: false,
      endOdometer: capturedEndOdometer ?? undefined,
      timeTracking: job.timeTracking
        ? { ...job.timeTracking, endTime: endedAt }
        : { breaks: [], waitingTime: [], endTime: endedAt },
      invoice: {
        status: 'submitted',
        invoiceNumber: invoiceData.invoiceNumber,
        totalAmount: invoiceData.netPayout,
        submittedAt: invoiceData.submittedAt,
      },
    };
    if (onStopTimer) onStopTimer();
    setShowPerMileInvoiceModal(false);
    onJobComplete(completedJob);
  };

  const handleConfirmEndJob = (completionData: any) => {
    const endedAt = new Date().toISOString();
    const updatedJob = { ...job };
    updatedJob.status = 'completed';
    if (updatedJob.timeTracking) {
      updatedJob.timeTracking = {
        ...updatedJob.timeTracking,
        endTime: endedAt,
      };
    }
    updatedJob.billingActive = false;
    onJobComplete(updatedJob);
    setShowEndJobModal(false);
  };

  if (!job || job.status !== 'in-progress') {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-900 mb-1">No Active Job</p>
        <p className="text-sm text-gray-500 text-center mb-4">
          Start a job from My Jobs to see the navigation view here.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="text-[#155DFC] border-gray-200"
          onClick={onBack}
        >
          Go to My Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top Status Bar */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-gray-800 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-[#f89823] text-[#1a1a1a] border-none">
            <Timer className="w-3 h-3 mr-1" />
            {elapsedTime}
          </Badge>
          <Badge className="bg-blue-600 text-white border-none">
            Active Job
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:bg-gray-800"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Full-Screen Map */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="active-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#active-grid)" />
          </svg>
        </div>

        {/* Route Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl">
            <svg className="w-full h-full" viewBox="0 0 400 600">
              <path
                d="M 200 50 L 200 150 L 250 200 L 250 350 L 180 420 L 180 550"
                stroke="#60A5FA"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="0 15"
                opacity="0.8"
              />
              <circle cx="200" cy="50" r="12" fill="#22C55E" stroke="white" strokeWidth="3" />
              <circle cx="180" cy="550" r="12" fill="#EF4444" stroke="white" strokeWidth="3" />
              <circle cx="200" cy="200" r="15" fill="#F89823" stroke="white" strokeWidth="4">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="250" cy="250" r="6" fill="#60A5FA" opacity="0.6" />
              <circle cx="220" cy="350" r="6" fill="#60A5FA" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Current Location Marker */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <Navigation className="w-8 h-8 text-[#f89823] drop-shadow-lg" fill="#f89823" />
            <div className="absolute -inset-4 bg-[#f89823] rounded-full opacity-20 animate-ping" />
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur hover:bg-white shadow-lg"
            onClick={() => setMapMode(mapMode === 'day' ? 'night' : 'day')}
          >
            {mapMode === 'day' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur hover:bg-white shadow-lg">
            <Layers className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur hover:bg-white shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed & Distance */}
        <div className="absolute top-4 left-4">
          <Card className="bg-white/90 backdrop-blur border-none shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-2xl" style={{ fontWeight: 700 }}>
                    <Gauge className="w-5 h-5 text-blue-600" />
                    45
                  </div>
                  <div className="text-xs text-gray-600">mph</div>
                </div>
                <div className="h-10 w-px bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>68</div>
                  <div className="text-xs text-gray-600">mi left</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-white/95 backdrop-blur border-none shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{job.jobTitle}</p>
                <Badge className="bg-[#FFF3E0] text-[#BF360C] border border-[#FFE0B2] shadow-none text-[10px] h-5">
                  In Progress
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {job.origin} → {job.destination} · {job.distance}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Turn Instruction */}
      <div className="bg-white px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-5xl text-blue-600 min-w-[60px] text-center" style={{ fontWeight: 700 }}>
            {getDirectionIcon(currentStep.icon)}
          </div>
          <div className="flex-1">
            <div className="text-base text-gray-900 mb-1" style={{ fontWeight: 600 }}>
              {currentStep.instruction}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentStep.distance}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentStep.duration}
              </span>
              <span className="text-gray-400">
                {remainingSteps} steps
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSteps(!showSteps)}
            className="text-blue-600"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${showSteps ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Route Steps Drawer */}
      {showSteps && (
        <div className="bg-white border-t border-gray-200 max-h-64 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Route Steps</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSteps(false)} className="text-gray-600">
              Close
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {routeSteps.map((step, index) => (
              <div
                key={step.id}
                className={`px-4 py-3 flex items-center gap-3 ${
                  index === currentStepIndex ? 'bg-blue-50' : ''
                } ${index < currentStepIndex ? 'opacity-50' : ''}`}
              >
                <div className={`text-2xl ${index === currentStepIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                  {getDirectionIcon(step.icon)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{step.instruction}</div>
                  <div className="text-xs text-gray-600">{step.distance} · {step.duration}</div>
                </div>
                {index === currentStepIndex && (
                  <Badge className="bg-blue-600 text-white border-none text-xs">Current</Badge>
                )}
                {index < currentStepIndex && <div className="text-green-600">{'\u2713'}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="bg-white px-4 py-4 border-t border-gray-200 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-gray-900" style={{ fontWeight: 500 }}>{job.origin}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2 text-sm">
            <Flag className="w-4 h-4 text-red-600" />
            <span className="text-gray-900" style={{ fontWeight: 500 }}>{job.destination}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
          Report
        </Button>

        <Button
          className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleEndJob}
        >
          <CircleStop className="w-4 h-4 mr-2" />
          Complete Job
        </Button>
      </div>

      {/* Modals */}
      <CompleteJobModal
        open={showCompleteJobModal}
        job={job}
        onClose={() => setShowCompleteJobModal(false)}
        onConfirm={(_payoutMethod) => {
          setShowCompleteJobModal(false);
          handleConfirmEndJob({});
        }}
      />

      {showInvoiceModal && (
        <InvoiceSubmissionModal
          job={job}
          onClose={() => setShowInvoiceModal(false)}
          onSubmit={(invoiceData: InvoiceData) => {
            setShowInvoiceModal(false);
            handleConfirmEndJob({});
          }}
        />
      )}

      {/* Per-Mile: End Odometer Capture */}
      <OdometerCaptureModal
        open={showOdometerEndModal}
        type="end"
        jobTitle={job.jobTitle}
        jobId={job.id}
        origin={job.origin}
        destination={job.destination}
        ratePerMile={job.ratePerMile}
        startReading={job.startOdometer?.reading}
        onConfirm={handlePerMileOdometerEnd}
        onClose={() => setShowOdometerEndModal(false)}
      />

      {/* Per-Mile: Invoice Modal */}
      {showPerMileInvoiceModal && capturedEndOdometer && job.startOdometer && (
        <PerMileInvoiceModal
          open={showPerMileInvoiceModal}
          job={job}
          startOdometer={job.startOdometer}
          endOdometer={capturedEndOdometer}
          onSubmit={handlePerMileInvoiceSubmit}
          onClose={() => setShowPerMileInvoiceModal(false)}
        />
      )}
    </div>
  );
}
