import { useState } from "react";
import PilotCarJobTab from "./trip-tabs/PilotCarJobTab";
import type { PilotCarJobInfo, LoadInfo } from "./CreateTripPage";
import { Button } from "./ui/button";
import { Briefcase } from "lucide-react";
import Header from "./Header";

interface PostJobPageProps {
  onBack: () => void;
  onSave: (jobData: any) => void;
  loadInfo?: LoadInfo;
  tripId?: string;
  routeOrigin?: string;
  routeDestination?: string;
  routeStartDate?: string;
  routeStates?: string[];
  tripPermits?: Array<{ id: string; name: string; state: string }>;
}

export default function PostJobPage({
  onBack,
  onSave,
  loadInfo,
  tripId,
  routeOrigin,
  routeDestination,
  routeStartDate,
  routeStates = [],
  tripPermits = [],
}: PostJobPageProps) {
  const [pilotCarJobData, setPilotCarJobData] = useState<PilotCarJobInfo>({
    jobTitle: "",
    jobType: "",
    startDate: "",
    endDate: "",
    associatedPermit: "",
    loadType: "",
    loadDescription: "",
    commodityType: "",
    specialHandling: "",
    overHeight: "",
    overWidth: "",
    overLength: "",
    trailerLength: "",
    loadLength: "",
    grossVehicleWeight: "",
    loadWeight: "",
    loadImage: null,
    origin: "",
    destination: "",
    statesProvinces: [],
    requestedRoute: "",
    pilotCarTypes: {},
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!pilotCarJobData.jobTitle)
      errors.jobTitle = "Job Title is required";
    
    if (!pilotCarJobData.jobType)
      errors.jobType = "Job Type is required";
    
    if (!pilotCarJobData.startDate)
      errors.startDate = "Start Date is required";
    
    if (!pilotCarJobData.endDate)
      errors.endDate = "End Date is required";
    
    if (tripPermits.length > 0 && !pilotCarJobData.associatedPermit) {
      errors.associatedPermit = "Associated Permit is required when permits are available";
    }

    if (pilotCarJobData.startDate && pilotCarJobData.endDate) {
      const startDate = new Date(pilotCarJobData.startDate);
      const endDate = new Date(pilotCarJobData.endDate);
      if (startDate > endDate) {
        errors.endDate = "End Date must be after Start Date";
      }
    }

    if (!pilotCarJobData.commodityType)
      errors.commodityType = "Commodity Type is required";

    if (!pilotCarJobData.grossVehicleWeight)
      errors.grossVehicleWeight = "Gross Vehicle Weight is required";

    if (!pilotCarJobData.origin)
      errors.origin = "Origin is required";
    
    if (!pilotCarJobData.destination)
      errors.destination = "Destination is required";
    
    if (pilotCarJobData.statesProvinces.length === 0)
      errors.statesProvinces = "At least one State/Province is required";

    const hasSelectedPilotCar = Object.values(pilotCarJobData.pilotCarTypes).some(
      (type: any) => type.selected
    );
    if (!hasSelectedPilotCar) {
      errors.pilotCarTypes = "At least one Pilot Car Type is required";
    } else {
      for (const [key, value] of Object.entries(pilotCarJobData.pilotCarTypes)) {
        if ((value as any).selected && (!(value as any).count || (value as any).count < 1)) {
          errors.pilotCarTypes = "All selected pilot car types must have a count ≥ 1";
          break;
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const jobData = {
        type: "pilot-car",
        status: "open",
        createdDate: new Date().toISOString(),
        pilotCarJobInfo: pilotCarJobData,
        title: pilotCarJobData.jobTitle,
      };
      
      onSave(jobData);
      onBack();
      
      setPilotCarJobData({
        jobTitle: "",
        jobType: "",
        startDate: "",
        endDate: "",
        associatedPermit: "",
        loadType: "",
        loadDescription: "",
        commodityType: "",
        specialHandling: "",
        overHeight: "",
        overWidth: "",
        overLength: "",
        trailerLength: "",
        loadLength: "",
        grossVehicleWeight: "",
        loadWeight: "",
        loadImage: null,
        origin: "",
        destination: "",
        statesProvinces: [],
        requestedRoute: "",
        pilotCarTypes: {},
      });
      setValidationErrors({});
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-none">
        <Header 
          title="Post Pilot Car Job"
          showBackButton={true}
          onBack={onBack}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <PilotCarJobTab
          data={pilotCarJobData}
          onChange={setPilotCarJobData}
          errors={validationErrors}
          loadInfo={loadInfo}
          tripId={tripId}
          routeOrigin={routeOrigin}
          routeDestination={routeDestination}
          routeStartDate={routeStartDate}
          routeStates={routeStates}
          tripPermits={tripPermits}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-1000">
        <div className="flex gap-3 max-w-5xl mx-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 text-base font-medium border-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:scale-98 transition-transform"
          >
            Post Job
          </Button>
        </div>
      </div>
    </div>
  );
}