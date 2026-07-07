import { X } from 'lucide-react';
import { AssignedJob } from './AssignedJobCard';

interface InvoiceStatusModalProps {
  job: AssignedJob;
  onClose: () => void;
  onDownloadInvoice: (job: AssignedJob) => void;
  onDownloadTripReport: (job: AssignedJob) => void;
}

export function InvoiceStatusModal({ job, onClose, onDownloadInvoice, onDownloadTripReport }: InvoiceStatusModalProps) {
  if (!job.invoice || !job.timeTracking) return null;

  const invoice = job.invoice;
  const timeTracking = job.timeTracking;

  // Calculate time data
  const startDate = new Date(timeTracking.startTime!);
  const endDate = new Date(timeTracking.endTime!);
  
  const totalMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / 1000 / 60);
  const totalBreakMinutes = timeTracking.breaks.reduce((sum, b) => sum + b.duration, 0);
  const totalWaitingMinutes = timeTracking.waitingTime.reduce((sum, w) => sum + w.duration, 0);
  const workingMinutes = totalMinutes - totalBreakMinutes;
  const billableMinutes = workingMinutes + totalWaitingMinutes;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`
;
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate invoice breakdown
  const basePay = parseFloat(job.assignedPay.replace('$', '').replace(',', ''));
  const hourlyRate = 50; // $50 per hour
  const waitingTimeCost = (totalWaitingMinutes / 60) * hourlyRate;
  
  // Calculate layover (mock - 3 days * $200/day)
  const layoverCost = 600;
  
  // Calculate overtime (hours beyond 8 per day)
  const totalHours = workingMinutes / 60;
  const overtimeHours = Math.max(0, totalHours - 8);
  const overtimeCost = overtimeHours * (hourlyRate * 1.5);
  
  const totalAmount = invoice.totalAmount || (basePay + waitingTimeCost + layoverCost + overtimeCost);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-hidden shadow-xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 pt-4 pb-3 z-10 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
          >
            <X className="size-5 text-gray-600" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-white">
          <div className="flex flex-col gap-4 items-start pt-4 px-4 pb-6">
            {/* Company Information */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="font-semibold leading-4 text-[#364153] text-xs tracking-[0.3px] uppercase">
                Company Information
              </h4>
              <div className="bg-[#f9fafb] rounded-[10px] p-4 w-full">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-normal leading-4 text-[#6a7282] text-xs">Company</p>
                    <p className="font-medium leading-5 text-[#101828] text-sm">{job.requestingCompany}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-normal leading-4 text-[#6a7282] text-xs">Email</p>
                    <p className="font-medium leading-5 text-[#101828] text-sm">
                      contact@{job.requestingCompany.toLowerCase().replace(/\s+/g, '')}.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="font-semibold leading-4 text-[#364153] text-xs tracking-[0.3px] uppercase">
                Job Details
              </h4>
              <div className="bg-[#f9fafb] rounded-[10px] p-4 w-full">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-normal leading-4 text-[#6a7282] text-xs">Route</p>
                    <p className="font-medium leading-5 text-[#101828] text-sm">
                      {job.origin} → {job.destination}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-normal leading-4 text-[#6a7282] text-xs">Distance</p>
                      <p className="font-medium leading-5 text-[#101828] text-sm">{job.distance}</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-normal leading-4 text-[#6a7282] text-xs">Vehicle Type</p>
                      <p className="font-medium leading-5 text-[#101828] text-sm">{job.position} Pilot Car</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-normal leading-4 text-[#6a7282] text-xs">Subject</p>
                    <p className="font-medium leading-5 text-[#101828] text-sm">{job.jobTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Timeline */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="font-semibold leading-4 text-[#364153] text-xs tracking-[0.3px] uppercase">
                Invoice Timeline
              </h4>
              <div className="bg-[#f9fafb] rounded-[10px] p-4 w-full">
                <div className="flex flex-col gap-3">
                  {invoice.submittedAt && (
                    <div className="flex flex-col gap-0.5">
                      <p className="font-normal leading-4 text-[#6a7282] text-xs">Created</p>
                      <p className="font-medium leading-5 text-[#101828] text-sm">{formatDate(invoice.submittedAt)}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-normal leading-4 text-[#6a7282] text-xs">Last Updated</p>
                    <p className="font-medium leading-5 text-[#101828] text-sm">
                      {invoice.approvedAt ? formatDate(invoice.approvedAt) : 
                       invoice.submittedAt ? formatDate(invoice.submittedAt) : 
                       formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="font-semibold leading-4 text-[#364153] text-xs tracking-[0.3px] uppercase">
                Charges Breakdown
              </h4>
              <div className="bg-[#f9fafb] rounded-[10px] relative w-full">
                {/* Base Pay */}
                <div className="flex h-5 items-center justify-between px-4 pt-4">
                  <div className="flex items-baseline">
                    <span className="font-normal leading-5 text-[#4a5565] text-sm">Base Mileage </span>
                    <span className="font-normal leading-5 text-[#99a1af] text-sm ml-1">({job.distance})</span>
                  </div>
                  <span className="font-medium leading-5 text-[#101828] text-sm">${formatCurrency(basePay)}</span>
                </div>

                {/* Waiting Time */}
                {totalWaitingMinutes > 0 && (
                  <div className="flex h-5 items-center justify-between px-4 mt-[10px]">
                    <div className="flex items-baseline">
                      <span className="font-normal leading-5 text-[#4a5565] text-sm">Waiting Time </span>
                      <span className="font-normal leading-5 text-[#99a1af] text-sm ml-1">({formatDuration(totalWaitingMinutes)})</span>
                    </div>
                    <span className="font-medium leading-5 text-[#101828] text-sm">${formatCurrency(waitingTimeCost)}</span>
                  </div>
                )}

                {/* Layover */}
                <div className="flex h-5 items-center justify-between px-4 mt-[10px]">
                  <div className="flex items-baseline">
                    <span className="font-normal leading-5 text-[#4a5565] text-sm">Layover </span>
                    <span className="font-normal leading-5 text-[#99a1af] text-sm ml-1">(3 days)</span>
                  </div>
                  <span className="font-medium leading-5 text-[#101828] text-sm">${formatCurrency(layoverCost)}</span>
                </div>

                {/* Overtime */}
                {overtimeHours > 0 && (
                  <div className="flex h-5 items-center justify-between px-4 mt-[10px]">
                    <div className="flex items-baseline">
                      <span className="font-normal leading-5 text-[#4a5565] text-sm">Overtime </span>
                      <span className="font-normal leading-5 text-[#99a1af] text-sm ml-1">({Math.round(overtimeHours)}h)</span>
                    </div>
                    <span className="font-medium leading-5 text-[#101828] text-sm">${formatCurrency(overtimeCost)}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="bg-[rgba(0,0,0,0.1)] h-[1px] mx-4 mt-[12px]" />

                {/* Total Amount */}
                <div className="flex items-center justify-between px-4 pt-[12px] pb-4">
                  <span className="font-bold leading-5 text-[#101828] text-sm">Total Amount</span>
                  <span className="font-bold leading-7 text-[#101828] text-lg">${formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                onClick={() => onDownloadInvoice(job)}
                className="bg-[#f89823] hover:bg-[#e08820] active:scale-[0.98] transition-all duration-150 text-[#1a1a1a] rounded-lg w-full h-[50px] flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice PDF
              </button>
              
              <button
                onClick={() => onDownloadTripReport(job)}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg w-full h-[44px] flex items-center justify-center gap-2 transition-colors font-medium text-sm"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Job Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}