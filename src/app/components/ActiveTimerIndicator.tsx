import { useEffect, useState } from 'react';
import { Coffee, CircleStop, X, PlayCircle, Square } from 'lucide-react';
import { Button } from './ui/button';

export interface TimerState {
  type: 'break' | 'waiting';
  startTime: Date;
  jobId: string;
  jobTitle: string;
}

interface ActiveTimerIndicatorProps {
  timerState: TimerState | null;
  onStop: () => void;
  onClick: () => void;
}

export function ActiveTimerIndicator({ timerState, onStop, onClick }: ActiveTimerIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!timerState) return;

    // Update elapsed time every second
    const interval = setInterval(() => {
      const now = new Date();
      const startTime = timerState.startTime instanceof Date 
        ? timerState.startTime 
        : new Date(timerState.startTime);
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  if (!timerState) return null;
  
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const isBreak = timerState.type === 'break';
  const bgColor = isBreak ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-orange-600 to-orange-500';
  const Icon = isBreak ? Coffee : CircleStop;

  return (
    <div 
      className={` fixed top-0 left-0 right-0 ${bgColor} text-white shadow-lg z-50 cursor-pointer animate-in slide-in-from-top duration-300`}
      onClick={onClick}
    >
      <div className="max-w-[450px] mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Animated Icon with Status */}
          <div className="relative flex-shrink-0">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
            {/* Middle rotating ring */}
            <div className="absolute inset-0 bg-white/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            {/* Icon container */}
            <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-2.5 border-2 border-white/40">
              <Icon className="size-5" />
            </div>
            {/* Running indicator dot */}
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>

          {/* Timer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <PlayCircle className="size-3.5 animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase">
                {isBreak ? '⏸️ On Break' : '⏱️ Waiting Time Active'}
              </span>
            </div>
            
            {/* Large Timer Display */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-extrabold tracking-tight tabular-nums">
                {hours > 0 && `${String(hours).padStart(2, '0')}:`}{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs opacity-90 font-medium">
                {hours > 0 ? 'hrs' : minutes > 0 ? 'mins' : 'secs'}
              </span>
            </div>
            
            {/* Job Title */}
            <p className="text-[11px] opacity-80 truncate mt-0.5">{timerState.jobTitle}</p>
          </div>

          {/* Stop Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-9 px-3 text-xs font-bold shadow-lg backdrop-blur-sm flex-shrink-0"
          >
            <Square className="size-3.5 mr-1.5 fill-white" />
            Stop
          </Button>
        </div>
        
        {/* Subtle progress bar */}
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/50 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(seconds / 60) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}