import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Gauge,
  ImagePlus,
  ArrowRight,
} from "lucide-react";

export interface OdometerReading {
  reading: number;
  photoData: string;
  capturedAt: string;
}

interface OdometerCaptureModalProps {
  open: boolean;
  type: "start" | "end";
  jobTitle: string;
  jobId?: string;
  origin?: string;
  destination?: string;
  ratePerMile?: number;
  startReading?: number;
  onConfirm: (data: OdometerReading) => void;
  onClose: () => void;
}

// Step indicator — 5 steps total in the per-mile flow
const STEPS = [
  { label: "Start Reading" },
  { label: "In Progress" },
  { label: "End Reading" },
  { label: "Invoice" },
  { label: "Done" },
];

export function OdometerCaptureModal({
  open,
  type,
  jobTitle,
  jobId,
  origin,
  destination,
  ratePerMile,
  startReading,
  onConfirm,
  onClose,
}: OdometerCaptureModalProps) {
  const [reading, setReading] = useState("");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isStart = type === "start";
  const activeStep = isStart ? 0 : 2;

  const readingNum = parseFloat(reading);
  const readingValid =
    reading !== "" &&
    !isNaN(readingNum) &&
    readingNum > 0 &&
    (isStart || (startReading !== undefined && readingNum > startReading));

  const readingError =
    !isStart &&
    reading !== "" &&
    !isNaN(readingNum) &&
    startReading !== undefined &&
    readingNum <= startReading
      ? `Must be greater than ${startReading.toLocaleString()} mi`
      : null;

  const distancePreview =
    !isStart && readingValid && startReading !== undefined
      ? readingNum - startReading
      : null;

  const canConfirm = readingValid && photoData !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoData(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({
      reading: readingNum,
      photoData: photoData!,
      capturedAt: new Date().toISOString(),
    });
    reset();
  };

  const reset = () => {
    setReading("");
    setPhotoData(null);
    setPhotoName("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 flex flex-col gap-0 overflow-hidden"
        style={{ height: "70dvh" }}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">
          {isStart ? "Starting Odometer Capture" : "Ending Odometer Capture"}
        </SheetTitle>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Step Progress Bar */}
        <div className="px-5 pt-0 pb-3 shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
              const done = idx < activeStep;
              const active = idx === activeStep;
              const future = idx > activeStep;
              return (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? isStart
                            ? "bg-[#f89823] text-white shadow-md shadow-[#f89823]/30"
                            : "bg-green-500 text-white shadow-md shadow-green-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] font-medium whitespace-nowrap ${
                        active ? (isStart ? "text-[#f89823]" : "text-green-600") : done ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1 mb-4 rounded-full ${done ? "bg-green-400" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Header */}
        <div
          className={`mx-5 mb-3 rounded-2xl px-4 py-3 shrink-0 ${
            isStart
              ? "bg-[#fff7ed] border border-[#f89823]/20"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isStart ? "bg-[#f89823]/15" : "bg-green-100"
                }`}
              >
                <Gauge className={`w-5 h-5 ${isStart ? "text-[#f89823]" : "text-green-600"}`} />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isStart ? "text-[#f89823]" : "text-green-600"}`}>
                  {isStart ? "Step 1 · Start Escort" : "Step 3 · Complete Escort"}
                </p>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">
                  {isStart ? "Starting Odometer" : "Ending Odometer"}
                </h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Job context */}
          {(jobId || origin) && (
            <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-2">
              {jobId && (
                <span className="text-[11px] font-mono text-gray-500 bg-white/60 px-2 py-0.5 rounded-md border border-gray-200">
                  {jobId}
                </span>
              )}
              {origin && destination && (
                <div className="flex items-center gap-1 text-[11px] text-gray-600">
                  <span className="truncate max-w-[80px]">{origin.split(",")[0]}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate max-w-[80px]">{destination.split(",")[0]}</span>
                </div>
              )}
              {ratePerMile && (
                <span className="ml-auto text-[11px] font-bold text-gray-700">${ratePerMile}/mi</span>
              )}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
          {/* Odometer Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">
                {isStart ? "Starting" : "Ending"} Odometer Reading
                <span className="text-red-400 ml-1">*</span>
              </label>
              {readingValid && (
                <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                </span>
              )}
            </div>
            <div
              className={`flex items-center rounded-xl border-2 bg-white transition-colors ${
                readingError
                  ? "border-red-400"
                  : readingValid
                  ? "border-green-400"
                  : "border-gray-200 focus-within:border-[#f89823]"
              }`}
            >
              <input
                type="number"
                inputMode="numeric"
                placeholder="84,250"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="flex-1 h-12 px-4 text-xl font-mono font-bold bg-transparent outline-none text-gray-900 placeholder:text-gray-300"
              />
              <span className="pr-4 text-sm font-semibold text-gray-400">mi</span>
            </div>

            {readingError && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {readingError}
              </div>
            )}

            {/* Distance + invoice preview — compact single row when both present */}
            {distancePreview !== null && (
              <div className={`grid gap-2 ${ratePerMile ? "grid-cols-2" : "grid-cols-1"}`}>
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 flex items-center justify-between">
                  <p className="text-[11px] text-blue-500 font-medium">Distance</p>
                  <div>
                    <span className="text-base font-bold font-mono text-blue-700">{distancePreview.toFixed(1)}</span>
                    <span className="text-[11px] text-blue-400 ml-1">mi</span>
                  </div>
                </div>
                {ratePerMile && (
                  <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 flex items-center justify-between">
                    <p className="text-[11px] text-green-600 font-medium">Base Amount</p>
                    <span className="text-base font-bold font-mono text-green-700">
                      ${(distancePreview * ratePerMile).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">
                Odometer Photo
                <span className="text-red-400 ml-1">*</span>
              </label>
              {photoData && (
                <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {photoData ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-green-300">
                <img src={photoData} alt="Odometer" className="w-full h-32 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-white font-medium truncate max-w-[160px]">{photoName}</span>
                  </div>
                  <button
                    onClick={() => { setPhotoData(null); setPhotoName(""); }}
                    className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1.5 active:bg-gray-100 transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">Take Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1.5 active:bg-gray-100 transition-colors"
                >
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">From Gallery</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 px-5 pb-8 pt-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full h-14 rounded-[6px] text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              canConfirm
                ? "bg-[#f89823] text-[#1a1a1a] active:bg-[#e08820]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isStart ? "Start Escort" : "Calculate Invoice"}
            {canConfirm && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
