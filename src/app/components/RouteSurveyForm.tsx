import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Camera,
  Mic,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";
import RouteSurveyGeneral from "./survey-sections/RouteSurveyGeneral";
import RouteSurveyObservations from "./survey-sections/RouteSurveyObservations";
import RouteSurveyCompliance from "./survey-sections/RouteSurveyCompliance";
import RouteSurveyNotes from "./survey-sections/RouteSurveyNotes";
import RouteSurveyAttachments from "./survey-sections/RouteSurveyAttachments";
import RouteSurveySignoff from "./survey-sections/RouteSurveySignoff";

export interface RouteObservation {
  id: string;
  category:
    | "height"
    | "width"
    | "turning"
    | "parking"
    | "restrictions";
  location: string;
  measurement?: string;
  description: string;
  severity?: "critical" | "moderate" | "minor";
}

export interface SurveyAttachment {
  id: string;
  type: "map" | "photo" | "voice";
  name: string;
  url?: string;
  timestamp: string;
}

export interface RouteSurveyData {
  // Section 1 - General (auto-filled)
  surveyDate: string;
  pcOperatorName: string;
  vehicleId: string;
  jobReference: string;
  freightDescription: string;
  surveyType: string;
  route: {
    origin: string;
    destination: string;
    distance: string;
  };
  loadDimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  jurisdictions: string[];
  units: "imperial" | "metric";

  // Section 2 - Route Observations
  observations: RouteObservation[];

  // Section 3 - Compliance & Recommendations
  compliance: {
    permitRequired: boolean;
    policeEscortRequired: boolean;
    heightPoleRequired: boolean;
    steerAxlesRequired: boolean;
  };
  layoverPoints: Array<{
    id: string;
    location: string;
    facilities: string;
  }>;
  backupRoutes: Array<{
    id: string;
    description: string;
    reason: string;
  }>;
  permitApprovalRecommended: boolean;

  // Section 4 - Notes
  surveyorNotes: string;

  // Section 5 - Attachments
  attachments: SurveyAttachment[];

  // Section 6 - Sign-off
  signature?: string;
  signoffDate?: string;
  certification?: boolean;
}

interface RouteSurveyFormProps {
  job: AssignedJob;
  onBack: () => void;
  existingSurvey?: RouteSurveyData;
  readOnly?: boolean;
  onSaveDraft?: (jobId: string, data: RouteSurveyData) => void;
}

const SECTION_TITLES = [
  "General Information",
  "Route Observations",
  "Compliance & Recommendations",
  "Surveyor Notes",
  "Attachments",
  "Sign-off",
];

export default function RouteSurveyForm({
  job,
  onBack,
  existingSurvey,
  readOnly = false,
  onSaveDraft,
}: RouteSurveyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [surveyData, setSurveyData] = useState<RouteSurveyData>(
    existingSurvey || {
      surveyDate: new Date().toISOString().split("T")[0],
      pcOperatorName: "John Smith", // Would come from auth context
      vehicleId: "PC-VEH-001",
      jobReference: `${job.id} / ${job.requestId}`,
      freightDescription: job.loadType || "Standard Load",
      surveyType: job.jobType || "Standard Survey",
      route: {
        origin: job.origin,
        destination: job.destination,
        distance: job.distance,
      },
      loadDimensions: {
        length: "85'",
        width: "14'6\"",
        height: "13'8\"",
        weight: "48,000 lbs",
      },
      jurisdictions: ["TX", "NM", "AZ"],
      units: "imperial",
      observations: [],
      compliance: {
        permitRequired: false,
        policeEscortRequired: false,
        heightPoleRequired: false,
        steerAxlesRequired: false,
      },
      layoverPoints: [],
      backupRoutes: [],
      permitApprovalRecommended: true,
      surveyorNotes: "",
      attachments: [],
    },
  );

  const [isDraft, setIsDraft] = useState(
    !existingSurvey?.signoffDate,
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const progress =
    ((currentSection + 1) / SECTION_TITLES.length) * 100;

  const updateSurveyData = (
    updates: Partial<RouteSurveyData>,
  ) => {
    setSurveyData((prev) => {
      const newData = { ...prev, ...updates };
      // Auto-save after update
      if (!readOnly && onSaveDraft) {
        setTimeout(() => {
          onSaveDraft(job.id, newData);
          setLastSaved(new Date());
        }, 500);
      }
      return newData;
    });
  };

  const handleSaveDraft = () => {
    if (!onSaveDraft) return;

    setIsSaving(true);
    onSaveDraft(job.id, surveyData);

    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      alert("Survey draft saved successfully!");
    }, 500);
  };

  const handleSubmitSurvey = () => {
    if (!surveyData.signature || !surveyData.certification) {
      alert(
        "Please complete the sign-off section before submitting",
      );
      return;
    }

    setShowSubmitDialog(true);
  };
  
  const confirmSubmit = () => {
    setShowSubmitDialog(false);
    
    // TODO: Submit to backend
    alert(
      "Route survey submitted successfully! The job requester has been notified.",
    );
    onBack();
  };

  const handleNext = () => {
    if (currentSection < SECTION_TITLES.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const canProceed = () => {
    // Add validation logic for each section
    switch (currentSection) {
      case 0: // General - always valid (auto-filled)
        return true;
      case 1: // Observations - at least one observation recommended
        return surveyData.observations.length > 0;
      case 2: // Compliance
        return true;
      case 3: // Notes
        return surveyData.surveyorNotes.trim().length > 0;
      case 4: // Attachments - at least one attachment recommended
        return surveyData.attachments.length > 0;
      case 5: // Sign-off
        return surveyData.signature && surveyData.certification;
      default:
        return true;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <RouteSurveyGeneral
            data={surveyData}
            readOnly={readOnly}
          />
        );
      case 1:
        return (
          <RouteSurveyObservations
            data={surveyData}
            updateData={updateSurveyData}
            readOnly={readOnly}
          />
        );
      case 2:
        return (
          <RouteSurveyCompliance
            data={surveyData}
            updateData={updateSurveyData}
            readOnly={readOnly}
          />
        );
      case 3:
        return (
          <RouteSurveyNotes
            data={surveyData}
            updateData={updateSurveyData}
            readOnly={readOnly}
          />
        );
      case 4:
        return (
          <RouteSurveyAttachments
            data={surveyData}
            updateData={updateSurveyData}
            readOnly={readOnly}
          />
        );
      case 5:
        return (
          <RouteSurveySignoff
            data={surveyData}
            updateData={updateSurveyData}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Changed from min-h-screen to h-full */}
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Job Details - Compact Single Line - Scrolls Away */}
        <div className="bg-white border-b border-gray-200 px-4 pt-5 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="size-4 flex-shrink-0" />
              <span>{job.id}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-gray-900">
              <MapPin className="size-5 flex-shrink-0 text-gray-400" />
              <span className="truncate font-medium">
                {job.origin} → {job.destination}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar - Sticky at Top */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4">
            {/* Progress Text */}
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                {SECTION_TITLES[currentSection]}
              </h3>
              <span className="text-sm font-medium text-[#155DFC]">
                Step {currentSection + 1} of {SECTION_TITLES.length}
              </span>
            </div>
            {/* Segmented Progress Bar */}
            <div className="flex items-center gap-1.5">
              {SECTION_TITLES.map((title, index) => {
                const isCompleted = index < currentSection;
                const isCurrent = index === currentSection;
                
                return (
                  <button
                    key={index}
                    onClick={() => (isCompleted || isCurrent) && setCurrentSection(index)}
                    disabled={index > currentSection}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? 'bg-[#155DFC] cursor-pointer hover:opacity-80'
                        : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    title={title}
                    aria-label={`${title}${isCompleted ? ' - Completed' : isCurrent ? ' - Current' : ' - Locked'}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-4 pb-32">
          {/* Increased bottom padding to prevent content being hidden */}
          {renderSection()}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 max-w-[450px] mx-auto">
        {readOnly ? (
          /* View Mode Navigation */
          <div className="flex gap-3">
            {currentSection > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="h-12"
              >
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
            )}

            {currentSection < SECTION_TITLES.length - 1 && (
              <Button
                onClick={handleNext}
                className="ml-auto h-12"
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            )}
          </div>
        ) : (
          /* Edit Mode Navigation */
          <div className="flex gap-3">
            {currentSection > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="h-12 px-6"
              >
                <ChevronLeft className="size-4 mr-2" />
                Previous
              </Button>
            )}

            {currentSection < SECTION_TITLES.length - 1 ? (
              <Button
                onClick={handleNext}
                className="ml-auto bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-12 px-8 font-semibold"
              >
                Next
                <ChevronRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitSurvey}
                disabled={!canProceed()}
                className="ml-auto bg-green-600 hover:bg-green-700 text-white h-12 px-8 font-semibold disabled:bg-gray-300"
              >
                <Send className="size-4 mr-2" />
                Submit Survey
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Route Survey?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this route survey? Once
              submitted, the survey cannot be edited and will be sent
              to the job requester for review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}