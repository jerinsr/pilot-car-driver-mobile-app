import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  CheckCircle2,
  X,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Receipt,
  MapPin,
  ArrowRight,
  Layers,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";

export interface PerMileInvoiceData {
  invoiceNumber: string;
  startOdometer: number;
  endOdometer: number;
  distanceMiles: number;
  ratePerMile: number;
  baseMileageAmount: number;
  additionalCharges: { id: string; label: string; amount: number }[];
  additionalChargesTotal: number;
  grossAmount: number;
  platformFee: number;
  tax: number;
  netPayout: number;
  submittedAt: string;
}

interface AdditionalCharge {
  id: string;
  label: string;
  amount: number;
}

const PLATFORM_FEE_RATE = 0.05;
const TAX_RATE = 0.08;

const CHARGE_PRESETS = ["Waiting Charge", "Layover Charge", "Fuel Surcharge", "Other"];

interface Props {
  open: boolean;
  job: AssignedJob;
  startOdometer: { reading: number; capturedAt: string };
  endOdometer: { reading: number; capturedAt: string };
  onSubmit: (data: PerMileInvoiceData) => void;
  onClose: () => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Step indicator shared with OdometerCaptureModal (steps 4 = Invoice, 5 = Done)
const STEPS = ["Start Reading", "In Progress", "End Reading", "Invoice", "Done"];

export function PerMileInvoiceModal({ open, job, startOdometer, endOdometer, onSubmit, onClose }: Props) {
  const [step, setStep] = useState<"summary" | "preview" | "success">("summary");
  const [charges, setCharges] = useState<AdditionalCharge[]>([]);
  const [addingCharge, setAddingCharge] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const ratePerMile = job.ratePerMile ?? 0;
  const distance = endOdometer.reading - startOdometer.reading;
  const baseAmount = distance * ratePerMile;
  const additionalTotal = charges.reduce((s, c) => s + c.amount, 0);
  const grossAmount = baseAmount + additionalTotal;
  const platformFee = grossAmount * PLATFORM_FEE_RATE;
  const tax = grossAmount * TAX_RATE;
  const netPayout = grossAmount - platformFee - tax;
  const invoiceNumber = `INV-PM-${job.id}-${Date.now().toString().slice(-5)}`;

  const addCharge = () => {
    const amt = parseFloat(newAmount);
    if (!newLabel || isNaN(amt) || amt <= 0) return;
    setCharges((p) => [...p, { id: Date.now().toString(), label: newLabel, amount: amt }]);
    setNewLabel("");
    setNewAmount("");
    setAddingCharge(false);
  };

  const removeCharge = (id: string) => setCharges((p) => p.filter((c) => c.id !== id));

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      onSubmit({
        invoiceNumber,
        startOdometer: startOdometer.reading,
        endOdometer: endOdometer.reading,
        distanceMiles: distance,
        ratePerMile,
        baseMileageAmount: baseAmount,
        additionalCharges: charges,
        additionalChargesTotal: additionalTotal,
        grossAmount,
        platformFee,
        tax,
        netPayout,
        submittedAt: new Date().toISOString(),
      });
    }, 1800);
  };

  // ─── Success State ───
  if (step === "success") {
    return (
      <Sheet open={open}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl p-0 flex flex-col items-center justify-center"
          style={{ height: "65dvh" }}
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Invoice Submitted</SheetTitle>
          <div className="flex flex-col items-center px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Invoice Submitted</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">${fmt(netPayout)}</h2>
            <p className="text-sm text-gray-500 mb-1">Net payout after deductions</p>
            <p className="text-xs text-gray-400 font-mono mb-4">{invoiceNumber}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your invoice has been submitted to{" "}
              <span className="font-semibold text-gray-700">{job.requestingCompany}</span> for review.
              You will be notified once it is approved.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ─── Step indicator ───
  const activeStep = step === "summary" ? 3 : 3;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 flex flex-col overflow-hidden"
        style={{ height: "95dvh" }}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Per-Mile Invoice</SheetTitle>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Step Progress */}
        <div className="px-5 pt-2 pb-4 shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((label, idx) => {
              const done = idx < 3;
              const active = idx === 3;
              return (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-[#f89823] text-white shadow-md shadow-[#f89823]/30"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[9px] font-medium whitespace-nowrap ${active ? "text-[#f89823]" : done ? "text-green-500" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-1 mb-4 rounded-full ${done ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────── */}
        {/*  STEP A — Mileage Summary + Add Charges     */}
        {/* ─────────────────────────────────────────── */}
        {step === "summary" && (
          <>
            {/* Header */}
            <div className="mx-5 mb-4 rounded-2xl px-4 py-4 bg-[#fff7ed] border border-[#f89823]/20 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f89823]/15 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-[#f89823]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f89823] uppercase tracking-wider">Step 4 · Mileage Summary</p>
                    <h2 className="text-base font-bold text-gray-900 mt-0.5">Distance Calculation</h2>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              {/* Job context */}
              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-500 bg-white/60 px-2 py-0.5 rounded-md border border-gray-200">
                  {job.id}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-gray-600">
                  <span className="truncate max-w-[75px]">{job.origin.split(",")[0]}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate max-w-[75px]">{job.destination.split(",")[0]}</span>
                </div>
                <span className="ml-auto text-[11px] font-bold text-gray-700">${ratePerMile}/mi</span>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">

              {/* Odometer comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#f89823]" />
                    <p className="text-[11px] text-gray-500 font-medium">Start Reading</p>
                  </div>
                  <p className="text-xl font-bold font-mono text-gray-900">
                    {startOdometer.reading.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">mi</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-[11px] text-gray-500 font-medium">End Reading</p>
                  </div>
                  <p className="text-xl font-bold font-mono text-gray-900">
                    {endOdometer.reading.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">mi</p>
                </div>
              </div>

              {/* Distance + calculation */}
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Distance Travelled</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">
                      {endOdometer.reading.toLocaleString()} − {startOdometer.reading.toLocaleString()} mi
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-mono text-blue-700">{distance.toFixed(1)}</span>
                    <span className="text-sm text-blue-500 ml-1">mi</span>
                  </div>
                </div>
                <div className="h-px bg-blue-200 mb-3" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Base Mileage Amount</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">
                      {distance.toFixed(1)} mi × ${ratePerMile}/mi
                    </p>
                  </div>
                  <span className="text-xl font-bold font-mono text-blue-700">${fmt(baseAmount)}</span>
                </div>
                <p className="text-[10px] text-blue-400 mt-2 text-center">
                  System-calculated · Read-only
                </p>
              </div>

              {/* Additional Charges */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-900">Additional Charges</span>
                    {charges.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        {charges.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setAddingCharge(true)}
                    className="flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {charges.length === 0 && !addingCharge ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      No additional charges. Add waiting time,<br />layover, or other approved charges.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {charges.map((c) => (
                      <div key={c.id} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-gray-700">{c.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-gray-900">${fmt(c.amount)}</span>
                          <button
                            onClick={() => removeCharge(c.id)}
                            className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {addingCharge && (
                  <div className="px-4 pb-4 pt-3 space-y-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {CHARGE_PRESETS.map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewLabel(p)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            newLabel === p
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-200"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Charge description"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="h-10 text-sm"
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          className="h-10 text-sm pl-7 font-mono"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={addCharge}
                        disabled={!newLabel || !newAmount}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-4 text-xs"
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setAddingCharge(false); setNewLabel(""); setNewAmount(""); }}
                        className="h-10 text-gray-500 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtotal preview */}
              {additionalTotal > 0 && (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal (before deductions)</span>
                  <span className="font-mono font-bold text-gray-900">${fmt(grossAmount)}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="shrink-0 px-5 pb-8 pt-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setStep("preview")}
                className="w-full h-14 rounded-2xl bg-[#f89823] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#f89823]/25 active:scale-[0.98] transition-all"
              >
                Review Invoice <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ─────────────────────────────────────────── */}
        {/*  STEP B — Invoice Preview                   */}
        {/* ─────────────────────────────────────────── */}
        {step === "preview" && (
          <>
            {/* Header */}
            <div className="mx-5 mb-4 rounded-2xl px-4 py-4 bg-green-50 border border-green-200 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Step 4 · Invoice Preview</p>
                    <h2 className="text-base font-bold text-gray-900 mt-0.5">Review & Submit</h2>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-500 bg-white/60 px-2 py-0.5 rounded-md border border-gray-200">
                  {invoiceNumber}
                </span>
                <span className="ml-auto text-[11px] text-gray-500">{job.requestingCompany}</span>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">

              {/* Odometer evidence */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <Gauge className="w-4 h-4 text-[#f89823]" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Odometer Evidence</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="px-3 py-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">Start</p>
                    <p className="text-sm font-bold font-mono text-gray-900">{startOdometer.reading.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">mi</p>
                  </div>
                  <div className="px-3 py-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">End</p>
                    <p className="text-sm font-bold font-mono text-gray-900">{endOdometer.reading.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">mi</p>
                  </div>
                  <div className="px-3 py-3 text-center bg-blue-50">
                    <p className="text-[10px] text-blue-500 mb-1">Distance</p>
                    <p className="text-sm font-bold font-mono text-blue-700">{distance.toFixed(1)}</p>
                    <p className="text-[10px] text-blue-400">mi</p>
                  </div>
                </div>
              </div>

              {/* Full invoice breakdown */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Invoice Breakdown</span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">Base Mileage Amount</p>
                      <p className="text-[11px] text-gray-400">{distance.toFixed(1)} mi × ${ratePerMile}/mi</p>
                    </div>
                    <span className="font-mono font-semibold text-gray-900">${fmt(baseAmount)}</span>
                  </div>

                  {charges.map((c) => (
                    <div key={c.id} className="flex justify-between items-center">
                      <p className="text-sm text-gray-700">{c.label}</p>
                      <span className="font-mono text-gray-900">${fmt(c.amount)}</span>
                    </div>
                  ))}

                  <div className="h-px bg-gray-200" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-900">Gross Invoice Amount</p>
                    <span className="font-mono font-bold text-gray-900">${fmt(grossAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-red-500">Platform Fee (5%)</p>
                    <span className="font-mono text-red-500">−${fmt(platformFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-red-500">Tax (8%)</p>
                    <span className="font-mono text-red-500">−${fmt(tax)}</span>
                  </div>
                </div>
                {/* Net payout highlight */}
                <div className="mx-3 mb-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Net Payout</p>
                    <p className="text-[11px] text-gray-500">After all deductions</p>
                  </div>
                  <span className="text-2xl font-bold font-mono text-green-600">${fmt(netPayout)}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
                By submitting this invoice you confirm that the odometer readings and attached photographs accurately reflect the distance travelled during this escort.
              </p>
            </div>

            {/* CTAs */}
            <div className="shrink-0 px-5 pb-8 pt-4 border-t border-gray-100 bg-white space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Your net payout</span>
                <span className="text-lg font-bold text-green-600">${fmt(netPayout)}</span>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full h-14 rounded-2xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-[0.98] transition-all"
              >
                Submit Invoice <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep("summary")}
                className="w-full h-10 rounded-xl text-sm text-gray-500 font-medium flex items-center justify-center gap-1.5 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Edit
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
