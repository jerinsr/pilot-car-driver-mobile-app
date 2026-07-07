import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { CheckCircle2, Star } from "lucide-react";

interface RatingCategory {
  id: string;
  label: string;
  value: number;
}

interface RateDriverScreenProps {
  driverName: string;
  jobId: string;
  onClose: () => void;
  onSubmit: (ratings: RatingCategory[], comments: string) => void;
}

const getRatingLabel = (value: number): string => {
  if (value === 0) return "";
  if (value <= 2) return "Poor";
  if (value === 3) return "Average";
  if (value === 4) return "Good";
  return "Excellent";
};

export function RateDriverScreen({
  driverName,
  jobId,
  onClose,
  onSubmit,
}: RateDriverScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState("");
  
  const [categories, setCategories] = useState<RatingCategory[]>([
    { id: "safety", label: "Safety", value: 0 },
    { id: "driving", label: "Driving & Compliance", value: 0 },
    { id: "communication", label: "Communication", value: 0 },
    { id: "timeliness", label: "Timeliness", value: 0 },
    { id: "professionalism", label: "Professionalism", value: 0 },
  ]);

  const updateCategory = (id: string, value: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, value } : cat))
    );
  };

  const allRated = categories.every((cat) => cat.value > 0);
  const ratedCount = categories.filter((cat) => cat.value > 0).length;
  const overallRating =
    categories.reduce((sum, cat) => sum + cat.value, 0) / categories.length;

  const handleSubmit = () => {
    if (!allRated) {
      return;
    }

    const rating = {
      tripId: jobId,
      driverId: driverName,
      overallRating: Math.round(overallRating * 10) / 10,
      categories,
      comments,
      timestamp: new Date().toISOString(),
    };

    // Check if low rating (≤3) and trigger admin notification
    if (overallRating <= 3) {
      console.log("Low rating alert triggered for admin:", {
        title: "Low Rating Alert – Driver",
        message: `Driver ${driverName} received a rating of ${overallRating.toFixed(1)}★ for Job ${jobId}. Please review the feedback.`,
      });
    }

    // Show success state
    setSubmitted(true);
    
    // Call success callback - convert to original format
    const ratingsInOriginalFormat = categories.map(cat => ({
      id: cat.id,
      label: cat.label,
      rating: cat.value
    }));
    onSubmit(ratingsInOriginalFormat, comments);

    // Auto-close after showing success
    setTimeout(() => {
      onClose();
      // Reset state after animation completes
      setTimeout(() => {
        setSubmitted(false);
        setCategories([
          { id: "safety", label: "Safety", value: 0 },
          { id: "driving", label: "Driving & Compliance", value: 0 },
          { id: "communication", label: "Communication", value: 0 },
          { id: "timeliness", label: "Timeliness", value: 0 },
          { id: "professionalism", label: "Professionalism", value: 0 },
        ]);
        setComments("");
      }, 300);
    }, 2000);
  };

  const handleClose = () => {
    if (!submitted) {
      onClose();
    }
  };

  return (
    <Drawer open={true} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]" aria-describedby={undefined}>
        {!submitted ? (
          <>
            {/* Header */}
            <DrawerHeader className="border-b border-gray-100 pb-4">
              <DrawerTitle className="text-lg font-semibold text-gray-900">
                Rate Driver
              </DrawerTitle>
              <DrawerDescription className="text-sm text-gray-500 mt-1">
                Job #{jobId} • {driverName}
              </DrawerDescription>
            </DrawerHeader>

            {/* Content */}
            <div className="overflow-y-auto px-4 py-4">
              {/* Progress Indicator */}
              {ratedCount > 0 && (
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500">
                    {ratedCount} of {categories.length} completed
                  </p>
                </div>
              )}

              {/* Rating Categories */}
              <div className="space-y-0">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`py-3 ${
                      index < categories.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Label
                        htmlFor={category.id}
                        className="text-sm font-normal text-gray-700 flex-shrink-0"
                      >
                        {category.label}
                      </Label>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => updateCategory(category.id, starValue)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  starValue <= category.value
                                    ? 'text-[#f89823] fill-[#f89823]'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {category.value > 0 && (
                          <span className="text-xs text-gray-400">
                            {getRatingLabel(category.value)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments Section */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Label
                  htmlFor="comments"
                  className="text-sm font-normal text-gray-700 mb-2 block"
                >
                  Comments (Optional)
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Add comments..."
                  value={comments}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) {
                      setComments(e.target.value);
                    }
                  }}
                  rows={3}
                  maxLength={250}
                  className="resize-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {comments.length}/250 characters
                </p>
              </div>
            </div>

            {/* Footer */}
            <DrawerFooter className="border-t border-gray-100 pt-4 pb-6">
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11 font-medium"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!allRated}
                  className="flex-1 h-11 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Submit Rating
                </Button>
              </div>
            </DrawerFooter>
          </>
        ) : (
          /* Success State */
          <div className="py-12 px-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-sm text-gray-600">
              Your rating has been submitted successfully
            </p>
            <div className="mt-4 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  className={`w-6 h-6 ${
                    starValue <= Math.round(overallRating)
                      ? 'text-[#f89823] fill-[#f89823]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {overallRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}