import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  MapPin,
  User,
  X,
  Zap,
  Clock,
  Info,
  Plus,
  Moon,
  Fuel,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";

type PayoutMethod = "standard" | "instant";
type Step = "confirm" | "review" | "charges" | "success";
type ReminderPhase = "normal" | "reminder" | "final" | "expired";

// Invoice Generation Window (Day 1 policy — see invoice workflow spec)
const INVOICE_WINDOW_SECONDS = 4 * 60 * 60; // 4 hours to submit
const REMINDER_THRESHOLD_SECONDS = INVOICE_WINDOW_SECONDS / 2; // midway reminder (2h left)
const FINAL_REMINDER_THRESHOLD_SECONDS = 30 * 60; // final reminder (30m left)

function formatCountdown(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

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
}

const PAYMENT_PROCESSING_FEE = 0.33;
const STANDARD_PAYOUT_FEE = 1.5;
const INSTANT_PAYOUT_RATE = 0.015; // 1.5%
const STANDARD_PLATFORM_RATE = 0.1; // 10%
const INSTANT_PLATFORM_RATE = 0.15; // 15%

const CHARGE_CATEGORIES: { label: string; icon: LucideIcon }[] = [
  { label: "Waiting Charge", icon: Clock },
  { label: "Layover Charge", icon: Moon },
  { label: "Fuel Surcharge", icon: Fuel },
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
}: CompleteJobModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("standard");

  // Custom invoice charges
  const [customItems, setCustomItems] = useState<CustomInvoiceItem[]>([]);

  // Draft state for the "Additional Charges" add form
  const [draftCategory, setDraftCategory] = useState("");
  const [draftLabel, setDraftLabel] = useState("");
  const [draftAmount, setDraftAmount] = useState("");

  // Invoice Generation Window — starts once the job is marked complete
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(INVOICE_WINDOW_SECONDS);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  useEffect(() => {
    if (!open || (step !== "review" && step !== "charges")) return;
    if (remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAutoSubmitted(true);
          setStep("success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, step]);

  const reminderPhase: ReminderPhase =
    remainingSeconds <= 0
      ? "expired"
      : remainingSeconds <= FINAL_REMINDER_THRESHOLD_SECONDS
        ? "final"
        : remainingSeconds <= REMINDER_THRESHOLD_SECONDS
          ? "reminder"
          : "normal";

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

  // Save charges and return to the invoice review, folding in any valid-but-unsaved draft first
  const commitAndContinue = () => {
    commitDraft();
    setStep("review");
  };

  const reset = () => {
    setStep("confirm");
    setPayoutMethod("standard");
    setCustomItems([]);
    setDraftCategory("");
    setDraftLabel("");
    setDraftAmount("");
    setCompletedAt(null);
    setRemainingSeconds(INVOICE_WINDOW_SECONDS);
    setAutoSubmitted(false);
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
        style={{
          height: step === "review" || step === "charges" ? "92dvh" : "auto",
        }}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">
          {step === "confirm"
            ? "Complete Job Confirmation"
            : step === "review"
              ? "Review Invoice"
              : step === "charges"
                ? "Edit Invoice"
                : autoSubmitted
                  ? "Invoice Automatically Submitted"
                  : "Invoice Submitted"}
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
                Are you sure you want to complete this job? Once confirmed, your
                4-hour invoice submission window will begin.
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
                  setStep("review");
                }}
                className="h-12 rounded-[6px] bg-[#f89823] text-[#1a1a1a] text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer active:bg-[#e08820] transition-colors"
              >
                Complete Job <ChevronRight className="w-4 h-4" />
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
                <div className="flex items-start gap-2 min-w-0">
                  <button
                    onClick={() => setStep("review")}
                    aria-label="Back"
                    className="w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center shrink-0 cursor-pointer active:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900">Edit Invoice</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add any extra charges to this invoice.
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
                      Description
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
                {customItems.length > 0 || draftValid ? "Save & Return to Invoice" : "Back to Invoice"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Review Invoice ── */}
        {step === "review" && (
          <>
            {/* Header */}
            <div className="px-5 pt-1 pb-4 shrink-0 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900">Review Invoice</h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{job.id}</p>
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

              {/* Invoice window / reminder banner */}
              <div
                className={`rounded-[12px] border p-3.5 flex items-start gap-2.5 ${
                  reminderPhase === "final"
                    ? "border-red-200 bg-red-50"
                    : reminderPhase === "reminder"
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                {reminderPhase === "final" || reminderPhase === "reminder" ? (
                  <AlertCircle
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      reminderPhase === "final" ? "text-red-600" : "text-amber-600"
                    }`}
                  />
                ) : (
                  <Clock3 className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className={`text-xs font-bold ${
                        reminderPhase === "final"
                          ? "text-red-700"
                          : reminderPhase === "reminder"
                            ? "text-amber-700"
                            : "text-blue-700"
                      }`}
                    >
                      {reminderPhase === "final"
                        ? "Final Reminder"
                        : reminderPhase === "reminder"
                          ? "Invoice Pending"
                          : "Invoice Window Open"}
                    </p>
                    <span
                      className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        reminderPhase === "final"
                          ? "bg-red-100 text-red-700"
                          : reminderPhase === "reminder"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {formatCountdown(remainingSeconds)} left
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {reminderPhase === "final"
                      ? "Invoice window expires soon. If no action is taken, Overwize will auto-generate and submit your invoice."
                      : reminderPhase === "reminder"
                        ? "Please submit your invoice before the timer expires. Otherwise, Overwize will automatically generate and submit it based on your recorded trip details."
                        : "Please review and submit your invoice before the timer expires. If no invoice is submitted, Overwize will automatically generate one using your recorded trip details."}
                  </p>
                </div>
              </div>

              {/* Job Details */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Job Details</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Job</span>
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{job.jobTitle}</span>
                  </div>
                  {job.driverName && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Truck Driver
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{job.driverName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Completed
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {(completedAt ?? new Date()).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Route Information</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-green-600" /> Origin
                    </span>
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{job.origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Flag className="w-3.5 h-3.5 text-red-600" /> Destination
                    </span>
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{job.destination}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Distance</span>
                    <span className="text-sm font-semibold text-gray-900">{job.distance}</span>
                  </div>
                </div>
              </div>

              {/* Accepted Bid / Pricing Model / Currency */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Accepted Bid</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pricing Model</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {job.rateType === "per-mile" ? "Per Mile" : job.rateType === "hourly" ? "Hourly" : "Flat Rate"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Accepted Amount</span>
                    <span className="text-sm font-semibold text-gray-900">${fmt(jobFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Currency</span>
                    <span className="text-sm font-semibold text-gray-900">CAD</span>
                  </div>
                </div>
              </div>

              {/* Layover Configuration */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Layover Configuration</p>
                </div>
                <div className="px-4 py-3">
                  {customItems.filter((item) => item.category === "Layover Charge").length > 0 ? (
                    <div className="space-y-2.5">
                      {customItems
                        .filter((item) => item.category === "Layover Charge")
                        .map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 truncate min-w-0 pr-3">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-900 shrink-0">
                              ${fmt(parseFloat(item.amount) || 0)}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No layover charges for this trip.</p>
                  )}
                </div>
              </div>

              {/* Additional Charges */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Additional Charges</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {customItems.length > 0 ? (
                    <div className="space-y-2.5">
                      {customItems.map((item) => {
                        const Icon = categoryIcon(item.category);
                        return (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-[10px] bg-[#fff7ed] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#f89823]" />
                            </span>
                            <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-900 shrink-0">
                              ${fmt(parseFloat(item.amount) || 0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No additional charges added.</p>
                  )}
                  <button
                    onClick={() => setStep("charges")}
                    className="w-full h-11 rounded-[6px] border-2 border-dashed border-[#f89823] text-[#f89823] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer active:bg-[#fff7ed] transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} /> Edit Invoice
                  </button>
                </div>
              </div>

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

              {/* Platform Fee / Transaction Fee Configuration */}
              <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice Summary</p>
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
                Submit Invoice
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
              <h2 className="text-lg font-bold text-gray-900">
                {autoSubmitted ? "Invoice Automatically Submitted" : "Invoice Submitted"}
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{job.id}</p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 max-w-[280px]">
                {autoSubmitted
                  ? "Invoice window has expired. Your invoice has been automatically generated and submitted."
                  : "Your invoice has been submitted successfully. The Truck Driver has been notified to review the invoice."}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
                Pending Truck Driver Review
              </span>
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
