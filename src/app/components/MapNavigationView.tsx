import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  ArrowLeft,
  Navigation,
  Phone,
  AlertTriangle,
  MapPin,
  Flag,
  Clock,
  Gauge,
  Info,
  ChevronRight,
  Coffee,
  Timer,
  CircleStop,
  MessageSquare,
  Settings,
  Maximize2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Layers
} from 'lucide-react';
import { AssignedJob } from './AssignedJobCard';
import { calculateElapsedTime } from './PilotJobStateMachine';

interface MapNavigationViewProps {
  job: AssignedJob;
  onBack: () => void;
  onEndJob: (job: AssignedJob) => void;
  onAddBreak: (job: AssignedJob) => void;
  onAddWaitingTime: (job: AssignedJob) => void;
}

interface RouteStep {
  id: string;
  instruction: string;
  distance: string;
  duration: string;
  icon: 'straight' | 'right' | 'left' | 'slight-right' | 'slight-left';
}

export function MapNavigationView({
  job,
  onBack,
  onEndJob,
  onAddBreak,
  onAddWaitingTime
}: MapNavigationViewProps) {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [showSteps, setShowSteps] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mapMode, setMapMode] = useState<'day' | 'night'>('day');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
    {
      id: '1',
      instruction: 'Head east on Main Street',
      distance: '0.5 mi',
      duration: '2 min',
      icon: 'straight'
    },
    {
      id: '2',
      instruction: 'Turn right onto Highway 65',
      distance: '15 mi',
      duration: '18 min',
      icon: 'right'
    },
    {
      id: '3',
      instruction: 'Slight right to stay on Highway 65',
      distance: '45 mi',
      duration: '52 min',
      icon: 'slight-right'
    },
    {
      id: '4',
      instruction: 'Turn left onto State Route 12',
      distance: '8 mi',
      duration: '12 min',
      icon: 'left'
    },
    {
      id: '5',
      instruction: 'Destination on the right',
      distance: '0.2 mi',
      duration: '1 min',
      icon: 'straight'
    }
  ];

  const currentStep = routeSteps[currentStepIndex];
  const remainingSteps = routeSteps.length - currentStepIndex;

  const getDirectionIcon = (icon: string) => {
    switch (icon) {
      case 'right':
        return '↱';
      case 'left':
        return '↰';
      case 'slight-right':
        return '↗';
      case 'slight-left':
        return '↖';
      default:
        return '↑';
    }
  };

  // Simulate progress through route
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < routeSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 15000); // Advance every 15 seconds for demo

    return () => clearInterval(timer);
  }, []);

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
            {job.id}
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

      {/* Map Container - Simulated */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 overflow-hidden">
        {/* Simulated Map Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Route Line Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl">
            {/* Simulated route path */}
            <svg className="w-full h-full" viewBox="0 0 400 600">
              {/* Route line */}
              <path
                d="M 200 50 L 200 150 L 250 200 L 250 350 L 180 420 L 180 550"
                stroke="#60A5FA"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="0 15"
                opacity="0.8"
              />
              
              {/* Origin marker */}
              <circle cx="200" cy="50" r="12" fill="#22C55E" stroke="white" strokeWidth="3" />
              
              {/* Destination marker */}
              <circle cx="180" cy="550" r="12" fill="#EF4444" stroke="white" strokeWidth="3" />
              
              {/* Current position (animated) */}
              <circle cx="200" cy="200" r="15" fill="#F89823" stroke="white" strokeWidth="4">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Checkpoints */}
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
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur hover:bg-white shadow-lg"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur hover:bg-white shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed & Distance Info */}
        <div className="absolute top-4 left-4">
          <Card className="bg-white/90 backdrop-blur border-none shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    45
                  </div>
                  <div className="text-xs text-gray-600">mph</div>
                </div>
                <div className="h-10 w-px bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">68</div>
                  <div className="text-xs text-gray-600">mi left</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Turn Instruction */}
      <div className="bg-white px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-blue-600 min-w-[60px] text-center">
            {getDirectionIcon(currentStep.icon)}
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold text-gray-900 mb-1">
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
                {remainingSteps} steps remaining
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
            <h3 className="font-semibold text-gray-900">Route Steps</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSteps(false)}
              className="text-gray-600"
            >
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
                  <div className="text-sm font-medium text-gray-900">
                    {step.instruction}
                  </div>
                  <div className="text-xs text-gray-600">
                    {step.distance} • {step.duration}
                  </div>
                </div>
                {index === currentStepIndex && (
                  <Badge className="bg-blue-600 text-white border-none text-xs">
                    Current
                  </Badge>
                )}
                {index < currentStepIndex && (
                  <div className="text-green-600">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="bg-white px-4 py-4 border-t border-gray-200 shadow-2xl">
        {/* Route Info */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-gray-900 font-medium">{job.origin}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2 text-sm">
            <Flag className="w-4 h-4 text-red-600" />
            <span className="text-gray-900 font-medium">{job.destination}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBreak(job)}
            className="flex-col h-auto py-2 px-2"
          >
            <Coffee className="w-5 h-5 mb-1 text-amber-600" />
            <span className="text-xs">Break</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddWaitingTime(job)}
            className="flex-col h-auto py-2 px-2"
          >
            <Clock className="w-5 h-5 mb-1 text-blue-600" />
            <span className="text-xs">Waiting</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-col h-auto py-2 px-2"
          >
            <AlertTriangle className="w-5 h-5 mb-1 text-orange-600" />
            <span className="text-xs">Report</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-col h-auto py-2 px-2"
          >
            <Phone className="w-5 h-5 mb-1 text-green-600" />
            <span className="text-xs">Contact</span>
          </Button>
        </div>

        {/* End Job Button */}
        <Button
          className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => {
            console.log('🔴 Complete Job button clicked');
            console.log('🔴 Job data:', job);
            console.log('🔴 Job status:', job.status);
            console.log('🔴 Job timeTracking:', job.timeTracking);
            onEndJob(job);
          }}
        >
          <CircleStop className="w-4 h-4 mr-2" />
          Complete Job
        </Button>
      </div>
    </div>
  );
}