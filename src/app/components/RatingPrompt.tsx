import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, CheckCircle2 } from 'lucide-react';

interface RatingPromptProps {
  driverName: string;
  jobId: string;
  rating?: number;
  onRateClick: () => void;
}

export function RatingPrompt({ driverName, jobId, rating, onRateClick }: RatingPromptProps) {
  if (rating) {
    // Post-submission view - Compact success state
    return (
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-700">
                  You rated <span className="font-semibold">{driverName}</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Thank you for your feedback!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pre-submission view - Prominent call-to-action
  return (
    <Card className="border-2 border-[#f89823]/30 bg-gradient-to-r from-orange-50 to-amber-50 shadow-none hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-white rounded-full p-2 shadow-sm">
              <Star className="w-5 h-5 text-[#f89823]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Rate {driverName}</p>
              <p className="text-xs text-gray-600 truncate">How was your experience?</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-8 px-4 text-sm font-semibold shadow-sm"
            onClick={onRateClick}
          >
            Rate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}