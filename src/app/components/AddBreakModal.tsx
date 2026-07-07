import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X, Clock, Coffee, Play, Square, Timer } from 'lucide-react';

interface AddBreakModalProps {
  onClose: () => void;
  onSave: (breakData: { duration: number; notes?: string }) => void;
  existingBreak?: { startTime: string } | null;
}

export function AddBreakModal({ onClose, onSave, existingBreak }: AddBreakModalProps) {
  const [isActive, setIsActive] = useState(!!existingBreak);
  const [startTime, setStartTime] = useState<Date>(existingBreak ? new Date(existingBreak.startTime) : new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState('');

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

  const handleStartBreak = () => {
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    setElapsedSeconds(0);
  };

  const handleEndBreak = () => {
    const durationMinutes = Math.ceil(elapsedSeconds / 60);
    
    if (durationMinutes === 0) {
      alert('Break must be at least 1 minute');
      return;
    }

    onSave({
      duration: durationMinutes,
      notes: notes.trim() || undefined
    });
  };

  const commonNotes = [
    '☕ Coffee break',
    '🍔 Lunch break',
    '🚻 Restroom break',
    '💤 Rest break',
    '⛽ Fuel stop',
    '📞 Phone call'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-t-3xl md:rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Coffee className="size-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-white">Break Timer</h2>
                <p className="text-blue-100 text-xs">Auto-tracked break time</p>
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
                {isActive ? 'Break in Progress' : 'Ready to Start'}
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
          {/* Notes Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
              What's this break for?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {commonNotes.map(note => (
                <button
                  key={note}
                  onClick={() => setNotes(note)}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 text-left font-medium
                    ${notes === note 
                      ? 'border-[#155DFC] bg-[#EFF6FF] text-[#155DFC] shadow-[0_2px_8px_rgba(21,93,252,0.15)]' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#155DFC] hover:bg-gray-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    }
                  `}
                >
                  <div className="text-sm">{note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <Label htmlFor="custom-notes" className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
              Or write a custom note
            </Label>
            <textarea
              id="custom-notes"
              placeholder="e.g., Vehicle inspection, Documentation review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:border-transparent resize-none text-sm shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-200 focus:shadow-[0_2px_8px_rgba(21,93,252,0.15)]"
            />
          </div>

          {/* Info */}
          {!isActive && (
            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex gap-3">
                <Clock className="size-5 text-[#155DFC] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1 text-gray-900">How it works:</p>
                  <p className="text-gray-600">Tap "Start Break" and the timer will begin automatically. When you're ready to resume work, tap "End Break" and the time will be recorded.</p>
                </div>
              </div>
            </div>
          )}

          {isActive && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex gap-3">
                <Clock className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1 text-gray-900">Break time is running</p>
                  <p className="text-gray-600">Break time will be deducted from your total working time. Tap "End Break" when you're ready to resume.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-4 space-y-3">
          {!isActive ? (
            <>
              <Button
                onClick={handleStartBreak}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 rounded-xl"
              >
                <Play className="size-6 mr-2 fill-white" />
                Start Break
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-12 text-base font-medium border-2 rounded-xl"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEndBreak}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/30 rounded-xl"
              >
                <Square className="size-6 mr-2 fill-white" />
                End Break
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-12 text-base font-medium border-2 rounded-xl"
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