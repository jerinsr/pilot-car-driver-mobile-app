import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, CheckCircle2, Clock, Coffee, AlertCircle, DollarSign, Calendar, MapPin, FileText } from 'lucide-react';
import { AssignedJob } from './AssignedJobCard';
import { RatingPrompt } from './RatingPrompt';

interface EndJobModalProps {
  job: AssignedJob | null;
  onClose: () => void;
  onConfirm: (endTime: string, notes: string, submitInvoice: boolean) => void;
  onRateDriver?: () => void;
}

export function EndJobModal({ 
  job, 
  onClose, 
  onConfirm,
  onRateDriver
}: EndJobModalProps) {
  const [notes, setNotes] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [submitInvoice, setSubmitInvoice] = useState(true);

  if (!job || !job.timeTracking || !job.timeTracking.startedAt) return null;

  const endTime = new Date().toISOString();
  
  // Calculate times
  const startDate = new Date(job.timeTracking.startedAt);
  const endDate = new Date(endTime);
  const totalMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / 1000 / 60);
  
  const totalBreakMinutes = job.timeTracking.breaks.reduce((sum, b) => sum + b.duration, 0);
  const totalWaitingMinutes = job.timeTracking.waitingTime.reduce((sum, w) => sum + w.duration, 0);
  const workingMinutes = totalMinutes - totalBreakMinutes;
  const billableMinutes = workingMinutes + totalWaitingMinutes;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleConfirm = () => {
    if (!confirmChecked) {
      alert('Please confirm that all information is accurate');
      return;
    }

    onConfirm(endTime, notes.trim(), submitInvoice);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-lg md:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600" />
            <h2 className="font-semibold text-lg">End Job</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{job.jobTitle}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="size-4" />
                  <span>{job.origin} → {job.destination}</span>
                </div>
              </div>
              <Badge className="bg-[#FFF3E0] text-[#C2410C] border-2 border-[#FFE0B2] shrink-0">In Progress</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-4" />
                <span>Job #{job.id}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="size-4" />
                <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(startDate)}</span>
              </div>
            </div>
          </div>

          {/* Time Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">Time Summary</h3>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-600" />
                    <span className="text-gray-700">Started</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(startDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-600" />
                    <span className="text-gray-700">Ending</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(endDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-blue-300 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-900" />
                    <span className="font-medium text-gray-900">Total Time</span>
                  </div>
                  <span className="font-bold text-blue-700 text-lg">{formatDuration(totalMinutes)}</span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Working Time</span>
                </div>
                <span className="font-medium text-gray-900">{formatDuration(workingMinutes)}</span>
              </div>

              {job.timeTracking.breaks.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Coffee className="size-4 text-blue-400" />
                    <span className="text-gray-700">Breaks ({job.timeTracking.breaks.length})</span>
                  </div>
                  <span className="font-medium text-gray-900">-{formatDuration(totalBreakMinutes)}</span>
                </div>
              )}

              {job.timeTracking.waitingTime.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-orange-400" />
                    <span className="text-gray-700">Waiting Time ({job.timeTracking.waitingTime.length})</span>
                  </div>
                  <span className="font-medium text-orange-700">+{formatDuration(totalWaitingMinutes)}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 bg-green-50 border border-green-200 rounded-lg px-3 mt-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-green-600" />
                  <span className="font-medium text-green-900">Billable Time</span>
                </div>
                <span className="font-bold text-green-700 text-lg">{formatDuration(billableMinutes)}</span>
              </div>
            </div>
          </div>

          {/* Break Details */}
          {job.timeTracking.breaks.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Coffee className="size-3" />
                Break Details
              </div>
              <div className="space-y-1">
                {job.timeTracking.breaks.map((brk, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex justify-between">
                    <span>{brk.notes || 'Break'}</span>
                    <span className="font-medium">{formatDuration(brk.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waiting Details */}
          {job.timeTracking.waitingTime.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="text-xs font-medium text-orange-900 mb-2 flex items-center gap-1">
                <AlertCircle className="size-3" />
                Waiting Time Details
              </div>
              <div className="space-y-1">
                {job.timeTracking.waitingTime.map((wait, idx) => (
                  <div key={idx} className="text-xs text-orange-800 flex justify-between">
                    <span>{wait.reason}</span>
                    <span className="font-medium">{formatDuration(wait.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Pay */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-sm mb-1">Assigned Pay</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <DollarSign className="size-6" />
                  {job.assignedPay}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-emerald-100 bg-white/10 rounded-lg px-3 py-2">
              Additional billable time may result in extra compensation
            </div>
          </div>

          {/* Completion Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold text-gray-900 mb-3 block">
              Completion Notes (optional)
            </Label>
            <textarea
              id="notes"
              placeholder="Any notes about the job completion, issues encountered, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-base"
            />
          </div>

          {/* Confirmation */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that all time entries are accurate and the job has been completed successfully.
              </span>
            </label>
          </div>

          {/* Submit Invoice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={submitInvoice}
                onChange={(e) => setSubmitInvoice(e.target.checked)}
                className="mt-1 size-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="size-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">Submit Invoice Now</span>
                </div>
                <span className="text-sm text-gray-600">
                  Automatically generate and submit invoice for this job after completion
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <Button
            onClick={handleConfirm}
            disabled={!confirmChecked}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="size-4 mr-2" />
            {submitInvoice ? 'Complete Job & Submit Invoice' : 'Complete Job'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
          {onRateDriver && (
            <RatingPrompt
              onRate={onRateDriver}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}