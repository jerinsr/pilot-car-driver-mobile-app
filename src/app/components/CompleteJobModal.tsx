import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  Clock,
  Info,
  Plus,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";

type PayoutMethod = "standard" | "instant";
type Step = "confirm" | "job-completed" | "charges" | "payout" | "success";

interface CustomInvoiceItem {
  id: string;
  label: string;
  amount: string; // raw input value; parsed when totalling
  category?: string; // matched category label, for the list icon
}

interface CompleteJobModalProps {
  open: boolean;
  job: AssignedJob;
  onClose: () => void;
  onConfirm: (payoutMethod: PayoutMethod) => void;
  /** Step to land on when the sheet opens — e.g. jump straight to "charges" from a reminder notification. */
  initialStep?: Step;
}

const PAYMENT_PROCESSING_FEE = 0.33;
const STANDARD_PAYOUT_FEE = 1.5;
const INSTANT_PAYOUT_RATE = 0.015; // 1.5%
const STANDARD_PLATFORM_RATE = 0.1; // 10%
const INSTANT_PLATFORM_RATE = 0.15; // 15%

const CHARGE_CATEGORIES: { label: string; icon: LucideIcon }[] = [
  { label: "Waiting Charge", icon: Clock },
  { label: "Other", icon: Tag },
];

const categoryIcon = (label?: string): LucideIcon =>
  CHARGE_CATEGORIES.find((c) => c.label === label)?.icon ?? Tag;

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
  initialStep,
}: CompleteJobModalProps) {
  const [step, setStep] = useState<Step>(initialStep ?? "confirm");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("standard");
  const [completedAt, setCompletedAt] = useState<Date | null>(null);

  // Re-sync to the requested entry step each time the sheet is (re)opened
  useEffect(() => {
    if (open) setStep(initialStep ?? "confirm");
  }, [open]);

  // Custom invoice charges
  const [customItems, setCustomItems] = useState<CustomInvoiceItem[]>([]);

  // Draft state for the "Additional Charges" add form
  const [draftCategory, setDraftCategory] = useState("");
  const [draftLabel, setDraftLabel] = useState("");
  const [draftAmount, setDraftAmount] = useState("");

  const jobFee = parseFloat(job.assignedPay.replace(/[$,]/g, "")) || 500;
  const payoutFee =
    payoutMethod === "standard"
      ? STANDARD_PAYOUT_FEE
      : jobFee * INSTANT_PAYOUT_RATE;
  const customItemsTotal = customItems.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0,
  );
  // Fees are deducted from the job fee (+ any additional charges)
  const transactionFee = payoutFee + PAYMENT_PROCESSING_FEE;
  const platformRate =
    payoutMethod === "standard" ? STANDARD_PLATFORM_RATE : INSTANT_PLATFORM_RATE;
  const platformFee = jobFee * platformRate;
  const totalAmount =
    jobFee + customItemsTotal - transactionFee - platformFee;

  const removeCustomItem = (id: string) => {
    setCustomItems(customItems.filter((item) => item.id !== id));
  };

  const selectCategory = (label: string) => {
    setDraftCategory(label);
    // "Other" leaves the description blank for a custom entry
    setDraftLabel(label === "Other" ? "" : label);
  };

  const draftValid = draftLabel.trim().length > 0 && parseFloat(draftAmount) > 0;

  const commitDraft = () => {
    if (!draftValid) return;
    setCustomItems([
      ...customItems,
      {
        id: `ITEM-${Date.now()}`,
        label: draftLabel.trim(),
        amount: draftAmount,
        category: draftCategory || "Other",
      },
    ]);
    setDraftCategory("");
    setDraftLabel("");
    setDraftAmount("");
  };

  // Continue to payout, folding in any valid-but-unsaved draft first
  const commitAndContinue = () => {
    commitDraft();
    setStep("payout");
  };

  const reset = () => {
    setStep("confirm");
    setPayoutMethod("standard");
    setCustomItems([]);
    setDraftCategory("");
    setDraftLabel("");
    setDraftAmount("");
    setCompletedAt(null);
  };

  const handleClose = () => {
    if (step === "success" || step === "job-completed") {
      // Job is already confirmed — dismissing the sheet continues the flow
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
        style={{
          height: step === "payout" || step === "charges" ? "92dvh" : "auto",
        }}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">
          {step === "confirm"
            ? "Complete Job Confirmation"
            : step === "job-completed"
              ? "Job Completed Successfully"
              : step === "charges"
                ? "Additional Charges"
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
          <div className="px-5 pb-8 pt-2">
            {/* Hero */}
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-5">
                <span className="absolute inset-0 -m-3 rounded-full bg-[#f89823]/5" />
                <span className="absolute inset-0 -m-1.5 rounded-full bg-[#f89823]/10" />
                <div className="relative w-16 h-16 rounded-full bg-[#f89823] flex items-center justify-center shadow-lg shadow-[#f89823]/30">
                  <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.2} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Complete Job?</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-1.5 max-w-[280px]">
                Confirm you've successfully completed this job. You'll add any
                extra charges and review your payout next.
              </p>
            </div>

            {/* Actions — two columns */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleClose}
                className="h-12 rounded-[6px] bg-gray-100 text-sm font-semibold text-gray-700 cursor-pointer active:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCompletedAt(new Date());
                  setStep("job-completed");
                }}
                className="h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer active:bg-[#e08820] transition-colors"
              >
                Complete <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1.5: Job Completed (intermediate) ── */}
        {step === "job-completed" && (
          <div className="px-5 pb-8 pt-2">
            {/* Hero */}
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-5">
                <span className="absolute inset-0 -m-3 rounded-full bg-green-500/5" />
                <span className="absolute inset-0 -m-1.5 rounded-full bg-green-500/10" />
                <div className="relative w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.2} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Job Completed Successfully</h2>
              <p className="text-xs text-gray-400 mt-1.5">
                {(completedAt ?? new Date()).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-[280px]">
                Invoice has been generated and sent to Pilot Car Driver for review.
              </p>
            </div>

            {/* Actions — two columns */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleDone}
                className="h-12 rounded-[6px] bg-gray-100 text-sm font-semibold text-gray-700 cursor-pointer active:bg-gray-200 transition-colors"
              >
                Go to Trips
              </button>
              <button
                onClick={() => setStep("charges")}
                className="h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer active:bg-[#e08820] transition-colors"
              >
                View Invoice <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Additional Charges ── */}
        {step === "charges" && (
          <>
            {/* Header */}
            <div className="px-5 pt-1 pb-4 shrink-0 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900">Additional Charges</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Add any extra charges before reviewing your payout.
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
            <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-6 pb-4">
              {/* Added charges list */}
              {customItems.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">
                    Added charges
                  </p>
                  {customItems.map((item) => {
                    const Icon = categoryIcon(item.category);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-[12px] border border-gray-200 bg-white p-3"
                      >
                        <span className="w-10 h-10 rounded-[12px] bg-[#fff7ed] flex items-center justify-center shrink-0">
                          <Icon className="w-[18px] h-[18px] text-[#f89823]" />
                        </span>
                        <p className="flex-1 min-w-0 text-sm font-semibold text-gray-900 truncate">
                          {item.label || "Additional charge"}
                        </p>
                        <span className="text-base font-bold text-gray-900 shrink-0">
                          ${fmt(parseFloat(item.amount) || 0)}
                        </span>
                        <button
                          onClick={() => removeCustomItem(item.id)}
                          aria-label="Remove charge"
                          className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center text-gray-400 shrink-0 cursor-pointer active:bg-gray-100 transition-colors"
                        >
                          <X className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add a charge */}
              <div className="space-y-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">
                  {customItems.length > 0 ? "Add another charge" : "Add a charge"}
                </p>

                {/* Category grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {CHARGE_CATEGORIES.map(({ label, icon: Icon }) => {
                    const active = draftCategory === label;
                    return (
                      <button
                        key={label}
                        onClick={() => selectCategory(label)}
                        aria-pressed={active}
                        className={`flex items-center gap-2.5 h-14 rounded-[12px] border-2 px-3 text-left transition-colors cursor-pointer ${
                          active
                            ? "border-[#f89823] bg-[#fff7ed]"
                            : "border-gray-200 bg-white active:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
                            active ? "bg-[#f89823]" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-[18px] h-[18px] ${
                              active ? "text-white" : "text-gray-500"
                            }`}
                          />
                        </span>
                        <span
                          className={`text-sm font-semibold leading-tight ${
                            active ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Description — only for a custom "Other" charge */}
                {draftCategory === "Other" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="charge-desc"
                      className="block text-xs font-medium text-gray-500 px-0.5"
                    >
                      Charge Name
                    </label>
                    <input
                      id="charge-desc"
                      type="text"
                      value={draftLabel}
                      onChange={(e) => setDraftLabel(e.target.value)}
                      placeholder="e.g. Detention time at pickup"
                      className="w-full h-12 rounded-[12px] border-2 border-gray-200 px-4 text-base text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-[#f89823] transition-colors"
                    />
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="charge-amount"
                    className="block text-xs font-medium text-gray-500 px-0.5"
                  >
                    Amount
                  </label>
                  <div className="flex items-center gap-2 h-16 rounded-[12px] border-2 border-gray-200 bg-white px-4 focus-within:border-[#f89823] transition-colors">
                    <input
                      id="charge-amount"
                      type="text"
                      inputMode="decimal"
                      value={draftAmount}
                      onChange={(e) =>
                        setDraftAmount(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      placeholder="0.00"
                      className="flex-1 min-w-0 text-2xl font-bold text-gray-900 placeholder:font-semibold placeholder:text-gray-300 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-gray-400">CAD</span>
                  </div>
                </div>

                {/* Add charge */}
                <button
                  onClick={commitDraft}
                  disabled={!draftValid}
                  className="w-full h-12 rounded-[6px] border-2 border-dashed border-[#f89823] text-[#f89823] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer active:bg-[#fff7ed] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:active:bg-transparent"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} /> Add charge
                </button>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 bg-white">
              <button
                onClick={commitAndContinue}
                className="w-full h-14 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-base font-bold flex items-center justify-center gap-2 cursor-pointer active:bg-[#e08820] transition-colors"
              >
                {customItems.length > 0 || draftValid ? "Continue" : "Skip"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Payout Method ── */}
        {step === "payout" && (
          <>
            {/* Header */}
            <div className="px-5 pt-1 pb-4 shrink-0 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <button
                    onClick={() => setStep("charges")}
                    aria-label="Back"
                    className="w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center shrink-0 cursor-pointer active:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900">Select Payout Method</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      How would you like to receive your payment?
                    </p>
                  </div>
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
                  className={`w-full text-left rounded-[12px] border-2 p-4 transition-colors cursor-pointer ${
                    payoutMethod === "standard"
                      ? "border-[#f89823] bg-[#fff7ed]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
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
                        <span className="text-sm font-semibold text-gray-900">Standard Deposit</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        3–5 business days after payment.
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
                  className={`w-full text-left rounded-[12px] border-2 p-4 transition-colors cursor-pointer ${
                    payoutMethod === "instant"
                      ? "border-[#f89823] bg-[#fff7ed]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
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
                        <span className="text-sm font-semibold text-gray-900">Instant Deposit</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Within 30 minutes after payment (+15%)
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

              {/* Payout Summary */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payout Summary</p>
                </div>{/*  */}
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Job Fee</span>
                    <span className="text-sm font-semibold text-gray-900">${fmt(jobFee)}</span>
                  </div>

                  {/* Custom charges (added in the previous step) — add to the payout */}
                  {customItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 truncate min-w-0 pr-3">
                        {item.label || "Additional charge"}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 shrink-0">
                        ${fmt(parseFloat(item.amount) || 0)}
                      </span>
                    </div>
                  ))}

                  {/* Deductions */}
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Transaction Processing Fee</span>
                    <span className="text-sm text-gray-500">−${fmt(transactionFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Platform Fee{" "}
                      <span className="text-gray-400">
                        ({payoutMethod === "standard" ? "10%" : "15%"})
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">−${fmt(platformFee)}</span>
                  </div>
                </div>
                <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Net Payout</span>
                  <span className="text-lg font-bold text-green-600">${fmt(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 bg-white">
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

        {/* ── STEP 4: Success ── */}
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
            <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Payout Method</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    {payoutMethod === "instant" ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-[#f89823]" /> Express Deposit
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-gray-500" /> Standard Deposit
                      </>
                    )}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-sm font-bold text-gray-900">Net Payout</span>
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
