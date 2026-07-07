import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, FileText, Clock, Coffee, AlertCircle, DollarSign, Send, CheckCircle2, Calendar, MapPin, User } from 'lucide-react';
import { AssignedJob } from './AssignedJobCard';

interface InvoiceSubmissionModalProps {
  job: AssignedJob;
  onClose: () => void;
  onSubmit: (invoiceData: InvoiceData) => void;
}

export interface InvoiceData {
  jobId: string;
  invoiceNumber: string;
  basePayAmount: number;
  workingHours: number;
  breakHours: number;
  waitingHours: number;
  billableHours: number;
  overtimeHours: number;
  overtimeRate: number;
  additionalCharges: { description: string; amount: number }[];
  totalAmount: number;
  notes: string;
  submittedAt: string;
}

export function InvoiceSubmissionModal({ job, onClose, onSubmit }: InvoiceSubmissionModalProps) {
  const [additionalCharges, setAdditionalCharges] = useState<{ description: string; amount: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('50'); // Default 1.5x = 50% extra

  // Calculate time data
  const timeTracking = job.timeTracking;
  if (!timeTracking || !timeTracking.startTime || !timeTracking.endTime) {
    return null;
  }

  const startDate = new Date(timeTracking.startTime);
  const endDate = new Date(timeTracking.endTime);
  
  const totalMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / 1000 / 60);
  const totalBreakMinutes = timeTracking.breaks.reduce((sum, b) => sum + b.duration, 0);
  const totalWaitingMinutes = timeTracking.waitingTime.reduce((sum, w) => sum + w.duration, 0);
  const workingMinutes = totalMinutes - totalBreakMinutes;
  const billableMinutes = workingMinutes + totalWaitingMinutes;

  // Convert to hours
  const totalHours = totalMinutes / 60;
  const breakHours = totalBreakMinutes / 60;
  const workingHours = workingMinutes / 60;
  const waitingHours = totalWaitingMinutes / 60;
  const billableHours = billableMinutes / 60;

  // Calculate overtime (hours beyond 8)
  const regularHours = Math.min(billableHours, 8);
  const overtimeHours = Math.max(0, billableHours - 8);

  // Parse base pay
  const basePay = parseFloat(job.assignedPay.replace(/,/g, ''));
  const hourlyRate = basePay / 8; // Assume 8-hour base

  // Calculate amounts
  const regularPayAmount = regularHours * hourlyRate;
  const overtimePayAmount = overtimeHours * hourlyRate * (1 + parseFloat(overtimeRate) / 100);
  
  const additionalTotal = additionalCharges.reduce((sum, charge) => {
    const amount = parseFloat(charge.amount) || 0;
    return sum + amount;
  }, 0);

  const totalAmount = regularPayAmount + overtimePayAmount + additionalTotal;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatHours = (hours: number) => {
    return hours.toFixed(2) + 'h';
  };

  const formatCurrency = (amount: number) => {
    return '$' + amount.toFixed(2);
  };

  const handleAddCharge = () => {
    setAdditionalCharges([...additionalCharges, { description: '', amount: '' }]);
  };

  const handleRemoveCharge = (index: number) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index));
  };

  const handleChargeChange = (index: number, field: 'description' | 'amount', value: string) => {
    const updated = [...additionalCharges];
    updated[index][field] = value;
    setAdditionalCharges(updated);
  };

  const handleSubmitInvoice = () => {
    // Validate additional charges
    const validCharges = additionalCharges
      .filter(c => c.description.trim() && c.amount.trim())
      .map(c => ({
        description: c.description.trim(),
        amount: parseFloat(c.amount)
      }));

    const invoiceData: InvoiceData = {
      jobId: job.id,
      invoiceNumber: `INV-${job.id}-${Date.now()}`,
      basePayAmount: basePay,
      workingHours: parseFloat(workingHours.toFixed(2)),
      breakHours: parseFloat(breakHours.toFixed(2)),
      waitingHours: parseFloat(waitingHours.toFixed(2)),
      billableHours: parseFloat(billableHours.toFixed(2)),
      overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      overtimeRate: parseFloat(overtimeRate),
      additionalCharges: validCharges,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      notes: notes.trim(),
      submittedAt: new Date().toISOString()
    };

    onSubmit(invoiceData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-t-3xl md:rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FileText className="size-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Submit Invoice</h2>
                <p className="text-emerald-100 text-sm">Job #{job.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
              <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-2 border-[#C8E6C9] shrink-0">Completed</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-4" />
                <span>{new Date(timeTracking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="size-4" />
                <span>{job.requestingCompany}</span>
              </div>
            </div>
          </div>

          {/* Time Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">Time Summary</h3>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-600" />
                    <span className="text-gray-700">Total Elapsed Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatDuration(totalMinutes)} ({formatHours(totalHours)})</span>
                </div>

                {timeTracking.breaks.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Coffee className="size-4 text-blue-600" />
                      <span className="text-gray-700">Breaks ({timeTracking.breaks.length})</span>
                    </div>
                    <span className="font-semibold text-gray-900">-{formatDuration(totalBreakMinutes)} ({formatHours(breakHours)})</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm border-t border-blue-300 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-900" />
                    <span className="font-medium text-gray-900">Working Time</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatDuration(workingMinutes)} ({formatHours(workingHours)})</span>
                </div>

                {timeTracking.waitingTime.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-4 text-orange-600" />
                      <span className="text-gray-700">Waiting Time ({timeTracking.waitingTime.length})</span>
                    </div>
                    <span className="font-semibold text-orange-700">+{formatDuration(totalWaitingMinutes)} ({formatHours(waitingHours)})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5 text-emerald-700" />
                  <span className="font-semibold text-emerald-900">Total Billable Hours</span>
                </div>
                <span className="text-2xl font-bold text-emerald-700">{formatHours(billableHours)}</span>
              </div>
            </div>
          </div>

          {/* Payment Calculation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">Payment Breakdown</h3>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
              {/* Base/Regular Hours */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-gray-900">Regular Hours (up to 8h)</div>
                  <div className="text-xs text-gray-600">{formatHours(regularHours)} × {formatCurrency(hourlyRate)}/hr</div>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(regularPayAmount)}</span>
              </div>

              {/* Overtime */}
              {overtimeHours > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div>
                      <div className="font-medium text-orange-900">Overtime Hours (beyond 8h)</div>
                      <div className="text-xs text-gray-600">{formatHours(overtimeHours)} × {formatCurrency(hourlyRate * (1 + parseFloat(overtimeRate) / 100))}/hr</div>
                    </div>
                    <span className="font-semibold text-orange-700">{formatCurrency(overtimePayAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="overtime-rate" className="text-xs text-gray-600 whitespace-nowrap">Overtime Rate:</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="overtime-rate"
                        type="number"
                        value={overtimeRate}
                        onChange={(e) => setOvertimeRate(e.target.value)}
                        className="h-8 w-20 text-sm"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs text-gray-600">% extra (1.{parseFloat(overtimeRate) / 100}x)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Charges */}
              {additionalCharges.length > 0 && (
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  {additionalCharges.map((charge, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Description (e.g., Toll fees)"
                        value={charge.description}
                        onChange={(e) => handleChargeChange(index, 'description', e.target.value)}
                        className="flex-1 h-9 text-sm"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={charge.amount}
                          onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                          className="h-9 w-28 pl-6 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCharge(index)}
                        className="h-9 w-9 text-red-600 hover:bg-red-50"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleAddCharge}
              className="w-full border-2 border-dashed"
            >
              + Add Additional Charge
            </Button>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-sm mb-1">Total Invoice Amount</div>
                <div className="text-4xl font-bold">{formatCurrency(totalAmount)}</div>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <DollarSign className="size-10" />
              </div>
            </div>
            {additionalTotal > 0 && (
              <div className="mt-3 text-xs text-emerald-100 bg-white/10 rounded-lg px-3 py-2">
                Includes {formatCurrency(additionalTotal)} in additional charges
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="invoice-notes" className="text-base font-semibold text-gray-900 mb-3 block">
              Additional Notes (Optional)
            </Label>
            <textarea
              id="invoice-notes"
              placeholder="Any additional information for the truck driver or notes about the job..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-base"
            />
          </div>

          {/* Break Details */}
          {timeTracking.breaks.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Break Details</h4>
              <div className="space-y-1">
                {timeTracking.breaks.map((brk, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex justify-between">
                    <span>{brk.notes || 'Break'}</span>
                    <span className="font-medium">{formatDuration(brk.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waiting Details */}
          {timeTracking.waitingTime.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <h4 className="font-medium text-orange-900 text-sm mb-2">Waiting Time Details</h4>
              <div className="space-y-1">
                {timeTracking.waitingTime.map((wait, idx) => (
                  <div key={idx} className="text-xs text-orange-800 flex justify-between">
                    <span>{wait.reason}</span>
                    <span className="font-medium">{formatDuration(wait.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Invoice Submission</p>
                <p>This invoice will be submitted to <span className="font-semibold">{job.requestingCompany}</span> for review and approval. You'll be notified once the payment has been processed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-4 space-y-3">
          <Button
            onClick={handleSubmitInvoice}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/30 rounded-xl"
          >
            <Send className="size-6 mr-2" />
            Submit Invoice to Truck Driver
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-12 text-base font-medium border-2 rounded-xl"
          >
            Review Later
          </Button>
        </div>
      </div>
    </div>
  );
}