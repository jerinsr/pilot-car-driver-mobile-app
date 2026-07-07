import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  X,
  Zap,
  Clock,
  Info,
} from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";

type PayoutMethod = "standard" | "instant";
type Step = "confirm" | "payout" | "success";

interface CompleteJobModalProps {
  open: boolean;
  job: AssignedJob;
  onClose: () => void;
  onConfirm: (payoutMethod: PayoutMethod) => void;
}

const PAYMENT_PROCESSING_FEE = 0.33;
const PLATFORM_FEE = 40.0;
const STANDARD_PAYOUT_FEE = 1.5;
const INSTANT_PAYOUT_RATE = 0.015; // 1.5%

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CompleteJobModal({
  open,
  job,
  onClose,
  onConfirm,
}: CompleteJobModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("standard");

  const jobFee = parseFloat(job.assignedPay.replace(/[$,]/g, "")) || 500;
  const payoutFee =
    payoutMethod === "standard"
      ? STANDARD_PAYOUT_FEE
      : jobFee * INSTANT_PAYOUT_RATE;
  const totalAmount = jobFee + payoutFee + PAYMENT_PROCESSING_FEE + PLATFORM_FEE;

  const reset = () => {
    setStep("confirm");
    setPayoutMethod("standard");
  };

  const handleClose = () => {
    if (step === "success") {
      // Job is already confirmed — dismissing the success screen continues the flow
      onConfirm(payoutMethod);
    } else {
      onClose();
    }
    reset();
  };

  const handleDone = () => {
    onConfirm(payoutMethod);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl p-0 flex flex-col gap-0 overflow-hidden [&>button]:hidden"
        style={{ height: step === "payout" ? "92dvh" : "auto" }}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">
          {step === "confirm"
            ? "Complete Job Confirmation"
            : step === "payout"
              ? "Select Payout Method"
              : "Job Completed"}
        </SheetTitle>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ── STEP 1: Confirm ── */}
        {step === "confirm" && (
          <div className="px-5 pb-8 pt-2 space-y-5">
            {/* Icon + Title */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Complete Job?</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{job.id}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you have successfully completed this job? Once confirmed,
              you'll proceed to review your payout details before submitting.
            </p>

            {/* Job pill */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">Job</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{job.jobTitle}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {job.origin} → {job.destination}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleClose}
                className="flex-1 h-12 rounded-[6px] border border-gray-200 text-sm font-semibold text-gray-700 bg-white active:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("payout")}
                className="flex-1 h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center gap-2 active:bg-[#e08820] transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Payout Method ── */}
        {step === "payout" && (
          <>
            {/* Header */}
            <div className="px-5 pt-1 pb-4 shrink-0 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900">Select Payout Method</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    How would you like to receive your payment?
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer active:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-5 pb-4">

              {/* Payout Options */}
              <div role="radiogroup" aria-label="Payout method" className="space-y-2.5">
                {/* Standard */}
                <button
                  role="radio"
                  aria-checked={payoutMethod === "standard"}
                  onClick={() => setPayoutMethod("standard")}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-colors cursor-pointer ${
                    payoutMethod === "standard"
                      ? "border-[#f89823] bg-[#fff7ed]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        payoutMethod === "standard" ? "bg-[#f89823]" : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`w-5 h-5 ${
                          payoutMethod === "standard" ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Standard Payout</span>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Default
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">ACH (Canada) / EFT (USA)</p>
                      <p className="text-xs text-gray-400">
                        ${fmt(STANDARD_PAYOUT_FEE)} processing fee
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                        payoutMethod === "standard"
                          ? "bg-[#f89823]"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {payoutMethod === "standard" && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </button>

                {/* Instant */}
                <button
                  role="radio"
                  aria-checked={payoutMethod === "instant"}
                  onClick={() => setPayoutMethod("instant")}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-colors cursor-pointer ${
                    payoutMethod === "instant"
                      ? "border-[#f89823] bg-[#fff7ed]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        payoutMethod === "instant" ? "bg-[#f89823]" : "bg-gray-100"
                      }`}
                    >
                      <Zap
                        className={`w-5 h-5 ${
                          payoutMethod === "instant" ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Instant Payout</span>
                        <span className="text-[10px] font-semibold text-[#f89823] bg-[#f89823]/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Fastest
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Receive your payment instantly</p>
                      <p className="text-xs text-gray-400">
                        ${fmt(jobFee * INSTANT_PAYOUT_RATE)} processing fee (1.5%)
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                        payoutMethod === "instant"
                          ? "bg-[#f89823]"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {payoutMethod === "instant" && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Invoice Summary */}
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice Summary</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Job Fee</span>
                    <span className="text-sm font-semibold text-gray-900">${fmt(jobFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payout Processing Fee</span>
                    <span className="text-sm text-gray-700">${fmt(payoutFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payment Processing Fee</span>
                    <span className="text-sm text-gray-700">${fmt(PAYMENT_PROCESSING_FEE)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Overwize Platform Fee</span>
                    <span className="text-sm text-gray-700">${fmt(PLATFORM_FEE)}</span>
                  </div>
                </div>
                <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-green-600">${fmt(totalAmount)}</span>
                </div>
              </div>

              {/* Info notice */}
              {payoutMethod === "instant" && (
                <div className="flex gap-2.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-3">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Instant Payout includes a 1.5% processing fee. Funds will be sent
                    instantly once the Truck Driver has paid the invoice.
                  </p>
                </div>
              )}
            </div>

            {/* Sticky CTA */}
            <div className="shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 bg-white">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-gray-500">Total Amount</span>
                <span className="text-xl font-bold text-green-600">${fmt(totalAmount)}</span>
              </div>
              <button
                onClick={() => setStep("success")}
                className="w-full h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer active:bg-[#e08820] transition-colors"
              >
                Confirm & Complete Job
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Success ── */}
        {step === "success" && (
          <div className="px-5 pb-8 pt-4 space-y-5">
            {/* Icon + Title */}
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Job Completed!</h2>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{job.id}</p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 max-w-[280px]">
                Your job has been marked as complete. The invoice will be sent to
                the Truck Driver for payment.
              </p>
            </div>

            {/* Payout summary */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Payout Method</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    {payoutMethod === "instant" ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-[#f89823]" /> Instant
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-gray-500" /> Standard
                      </>
                    )}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-sm font-bold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-green-600">${fmt(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Done */}
            <button
              onClick={handleDone}
              className="w-full h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center active:bg-[#e08820] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
