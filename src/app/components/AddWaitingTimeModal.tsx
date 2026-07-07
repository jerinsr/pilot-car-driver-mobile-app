import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X, Clock, AlertCircle, Play, Square, Timer } from 'lucide-react';

interface AddWaitingTimeModalProps {
  onClose: () => void;
  onSave: (waitingData: { duration: number; reason: string }) => void;
  existingWaiting?: { startTime: string; reason?: string } | null;
}

export function AddWaitingTimeModal({ onClose, onSave, existingWaiting }: AddWaitingTimeModalProps) {
  const [isActive, setIsActive] = useState(!!existingWaiting);
  const [startTime, setStartTime] = useState<Date>(existingWaiting ? new Date(existingWaiting.startTime) : new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reason, setReason] = useState(existingWaiting?.reason || '');

  // Timer effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time = formatTime(elapsedSeconds);

  const handleStartWaiting = () => {
    if (!reason.trim()) {
      alert('Please select or enter a reason before starting the timer');
      return;
    }
    
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    setElapsedSeconds(0);
  };

  const handleEndWaiting = () => {
    const durationMinutes = Math.ceil(elapsedSeconds / 60);
    
    if (durationMinutes === 0) {
      alert('Waiting time must be at least 1 minute');
      return;
    }

    if (!reason.trim()) {
      alert('Please provide a reason for the waiting time');
      return;
    }

    onSave({
      duration: durationMinutes,
      reason: reason.trim()
    });
  };

  const commonReasons = [
    { emoji: '🚔', text: 'Waiting for escort' },
    { emoji: '🚧', text: 'Road closure' },
    { emoji: '⛈️', text: 'Weather delay' },
    { emoji: '🚗', text: 'Traffic jam' },
    { emoji: '📦', text: 'Loading delay' },
    { emoji: '📋', text: 'Permit verification' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-700 to-slate-800 p-4 rounded-t-3xl md:rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="size-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-white">Waiting Time</h2>
                <p className="text-slate-200 text-xs">Billable waiting tracker</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="size-5 text-white" />
            </button>
          </div>

          {/* Timer Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <Timer className="size-4 text-white/80" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wide">
                {isActive ? 'Waiting in Progress' : 'Ready to Start'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {/* Hours */}
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[52px]">
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {time.hours}
                  </div>
                </div>
                <div className="text-[10px] text-white/70 mt-1 font-medium">Hours</div>
              </div>
              
              <div className="text-2xl font-bold text-white/50 pb-4">:</div>
              
              {/* Minutes */}
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[52px]">
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {time.minutes}
                  </div>
                </div>
                <div className="text-[10px] text-white/70 mt-1 font-medium">Minutes</div>
              </div>
              
              <div className="text-2xl font-bold text-white/50 pb-4">:</div>
              
              {/* Seconds */}
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[52px]">
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {time.seconds}
                  </div>
                </div>
                <div className="text-[10px] text-white/70 mt-1 font-medium">Seconds</div>
              </div>
            </div>
            
            {isActive && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                  <div className="size-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/90">
                    Started at {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reason Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
              Why are you waiting? *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {commonReasons.map(item => (
                <button
                  key={item.text}
                  onClick={() => setReason(item.text)}
                  disabled={isActive}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 text-left
                    ${reason === item.text 
                      ? 'border-[#155DFC] bg-[#EFF6FF] shadow-[0_2px_8px_rgba(21,93,252,0.15)]' 
                      : 'border-gray-200 bg-white hover:border-[#155DFC] hover:bg-gray-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    }
                    ${isActive ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="text-xl mb-1">{item.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{item.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          <div>
            <Label htmlFor="custom-reason" className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
              Or write a custom reason
            </Label>
            <textarea
              id="custom-reason"
              placeholder="e.g., Waiting for load verification, Equipment malfunction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isActive}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:border-transparent resize-none text-sm disabled:opacity-50 disabled:bg-gray-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-200 focus:shadow-[0_2px_8px_rgba(21,93,252,0.15)]"
            />
          </div>

          {/* Info */}
          {!isActive && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex gap-3">
                <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1 text-gray-900">Billable Time Alert</p>
                  <p className="text-gray-600">Waiting time is billable and will be added to your total job time. Make sure to document the reason clearly for proper compensation.</p>
                </div>
              </div>
            </div>
          )}

          {isActive && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex gap-3">
                <Timer className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1 text-gray-900">Timer is running</p>
                  <p className="mb-2 text-gray-600">Reason: <span className="font-semibold text-gray-900">{reason}</span></p>
                  <p className="text-gray-600">This waiting time will be added to your billable hours. Tap "End Waiting" when you're ready to resume work.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          {!isActive ? (
            <>
              <Button
                onClick={handleStartWaiting}
                disabled={!reason.trim()}
                className="w-full h-12 text-base font-semibold bg-[#155DFC] hover:bg-[#1248CC] shadow-[0_2px_8px_rgba(21,93,252,0.25)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Play className="size-5 mr-2 fill-white" />
                Start Waiting Timer
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-10 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEndWaiting}
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-[0_2px_8px_rgba(22,163,74,0.25)] rounded-lg transition-all duration-200"
              >
                <Square className="size-5 mr-2 fill-white" />
                End Waiting
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-10 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Running (Close)
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}