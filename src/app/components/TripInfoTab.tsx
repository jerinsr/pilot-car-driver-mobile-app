import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ReportIncidentDrawer from './ReportIncidentDrawer';

interface TripInfoTabProps {
  permit: any;
  routeDetails: any;
  load: any;
  driverDetails: any;
  truck: any;
  trailer: any;
}

export default function TripInfoTab({ permit, routeDetails, load, driverDetails, truck, trailer }: TripInfoTabProps) {
  const [openSections, setOpenSections] = useState<string[]>(['general', 'vehicle', 'load', 'route', 'truck', 'trailer']);
  const [isIncidentDrawerOpen, setIsIncidentDrawerOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex gap-4 items-start pb-3 border-b border-[#f3f4f6]">
      <p className="text-xs text-[#6b7280] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">{label}</p>
      <p className="text-sm text-[#202224] font-medium leading-[21px] break-words flex-1 min-w-0">{value}</p>
    </div>
  );

  const CollapsibleSection = ({ 
    id, 
    title, 
    subtitle,
    children 
  }: { 
    id: string; 
    title: string; 
    subtitle?: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections.includes(id);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <div className="text-left">
            <h3 className="font-semibold text-[15px] text-[#202224]">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 pb-6">
      {/* General Information */}
      <CollapsibleSection
        id="general"
        title="General Information"
        subtitle="Company details and contact information"
      >
        <div className="space-y-4">
          <InfoField label="Company Name" value="Acme Logistics Corp." />
          <InfoField label="MC Number" value="MC-123456" />
          <InfoField label="US DOT Number" value="DOT-789012" />
          <InfoField label="NSC Number" value="NSC-345678" />
          <InfoField label="Phone Number" value="+1 (512) 555-0123" />
          <InfoField label="Email Address" value="contact@acmelogistics.com" />
          <InfoField label="Requested By" value="John Smith" />
          <InfoField label="Created Date" value="December 15, 2024" />
          <InfoField label="Physical Address" value="123 Main Street, Suite 100, Austin, TX 78701" />
        </div>
      </CollapsibleSection>

      {/* Load Details */}
      <CollapsibleSection
        id="load"
        title="Load Details"
        subtitle="Information about the load being transported"
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <InfoField label="Load Type" value="Standard Load" />
            <InfoField label="Is Divisible" value="No" />
            <InfoField label="Is Self-Propelled" value="No" />
            <InfoField label="Commodity Class" value="General Freight" />
            <InfoField label="Commodity Type" value="Standard" />
            <InfoField label="Load Description" value="Sample load description" />
          </div>

          <div className="pt-3 border-t border-[#e5e7eb]">
            <p className="text-xs text-[#6b7280] font-semibold uppercase mb-3">Dimensions/Weight</p>
            <div className="space-y-4">
              <InfoField label="Overall Height" value={'13\'6" ft/in'} />
              <InfoField label="Overall Width" value={'6\'0" ft/in'} />
              <InfoField label="Overall Length" value={'53\' ft/in'} />
              <InfoField label="Front Overhang" value={'5\' ft/in'} />
              <InfoField label="Rear Overhang" value={'4\' ft/in'} />
              <InfoField label="Total Vehicle Weight" value="80000 lbs" />
              <InfoField label="Load Weight" value="45000 lbs" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Route & Travel */}
      <CollapsibleSection
        id="route"
        title="Route & Travel"
        subtitle="Details about the trip's route and travel dates"
      >
        <div className="space-y-4">
          <InfoField label="Origin" value="California" />
          <InfoField label="Destination" value="Arizona" />
          <InfoField label="Start Date" value="2024-12-18" />
          <InfoField label="End Date" value="2024-12-30" />
        </div>
      </CollapsibleSection>

      {/* Truck Information - Detailed */}
      <CollapsibleSection
        id="truck"
        title="Truck Information"
        subtitle="Detailed specifications of the truck"
      >
        <div className="space-y-6">
          {/* General truck details */}
          <div className="border-b border-[#e5e7eb] pb-4">
            <p className="text-sm font-normal text-[#0f172a] mb-3">General Truck Details</p>
            <div className="space-y-3">
              <InfoField label="Unit #" value="TRK-001" />
              <InfoField label="License Plate" value="ABC-1234" />
              <InfoField label="VIN" value="1HGBH41JXMN109186" />
              <InfoField label="Vehicle Year" value="2020" />
              <InfoField label="Vehicle Make" value="Peterbilt" />
              <InfoField label="Vehicle Model" value="579" />
              <div className="flex gap-4 items-start">
                <p className="text-xs text-[#6b7280] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Inspection Expiry Date</p>
                <p className="text-sm text-[#202224] font-medium leading-[21px] break-words flex-1">12/31/2025</p>
              </div>
            </div>
          </div>

          {/* Steer Configuration */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[rgba(37,99,235,0.1)] rounded-[10px] size-7 flex items-center justify-center shrink-0">
                <svg className="size-4" fill="none" viewBox="0 0 16 16">
                  <path d="M5.33333 9.33333C6.80609 9.33333 8 8.13943 8 6.66667C8 5.19391 6.80609 4 5.33333 4C3.86057 4 2.66667 5.19391 2.66667 6.66667C2.66667 8.13943 3.86057 9.33333 5.33333 9.33333Z" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 2.66667V4M2 4.66667H4M2 8.66667H4M4 9.33333V12" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#0f172a]">Steer</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-3">
                <InfoField label="Steer Type" value="Single Steer" />
                <InfoField label="Wheels per Axle" value="2" />
                <InfoField label="Tire Width (Steer)" value="10 in" />
                <InfoField label="TARE" value="12,000 lbs" />
              </div>
            </div>
          </div>

          {/* Drive Configuration */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[rgba(37,99,235,0.1)] rounded-[10px] size-7 flex items-center justify-center shrink-0">
                <svg className="size-4" fill="none" viewBox="0 0 16 16">
                  <path d="M5.33333 9.33333C6.80609 9.33333 8 8.13943 8 6.66667C8 5.19391 6.80609 4 5.33333 4C3.86057 4 2.66667 5.19391 2.66667 6.66667C2.66667 8.13943 3.86057 9.33333 5.33333 9.33333Z" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 2.66667V4M2 4.66667H4M2 8.66667H4M4 9.33333V12" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#0f172a]">Drive</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-3">
                <InfoField label="Drive Type" value="Tandem Drive" />
                <InfoField label="Number of Driving Axles" value="2" />
                <InfoField label="Wheels per Drive Axle" value="4" />
                <InfoField label="Tire Size" value="11 in" />
                <InfoField label="TARE" value="34,000 lbs" />
              </div>
            </div>
          </div>

          {/* Weight Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[rgba(37,99,235,0.1)] rounded-[10px] size-7 flex items-center justify-center shrink-0">
                <svg className="size-4" fill="none" viewBox="0 0 16 16">
                  <path d="M2 13.3333H14M4 10.6667H12C12.7364 10.6667 13.3333 10.0697 13.3333 9.33333V6C13.3333 5.26362 12.7364 4.66667 12 4.66667H4C3.26362 4.66667 2.66667 5.26362 2.66667 6V9.33333C2.66667 10.0697 3.26362 10.6667 4 10.6667ZM8 7.33333V8.66667" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#0f172a]">Weight Details</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-3">
                <InfoField label="Tractor TARE Weight (Empty)" value="18,000 lbs" />
                <InfoField label="Steer Axle Weight" value="12,000 lbs" />
                <InfoField label="Drive Axles Weight" value="34,000 lbs" />
              </div>
            </div>
          </div>

          {/* Axle Configuration and Interaxle Spacing */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[rgba(37,99,235,0.1)] rounded-[10px] size-7 flex items-center justify-center shrink-0">
                <svg className="size-4" fill="none" viewBox="0 0 16 16">
                  <path d="M2 8H14M10.6667 5.33333L13.3333 8L10.6667 10.6667M5.33333 5.33333L2.66667 8L5.33333 10.6667" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#0f172a]">Axle Configuration and Interaxle Spacing</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <p className="text-xs text-[#64748b] mb-4 italic">All interaxle spacings are measured from center to center between axles.</p>
              
              <div className="space-y-4">
                {/* Distance Measurements */}
                <div>
                  <p className="text-xs font-semibold text-[#6b7280] mb-3 uppercase">Distance Measurements</p>
                  <div className="space-y-3">
                    <div className="flex gap-4 items-start">
                      <p className="text-xs text-[#6b7280] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Front Bumper → First Steer Axle Distance</p>
                      <p className="text-sm text-[#202224] font-medium leading-[21px] break-words flex-1">120 in</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <p className="text-xs text-[#6b7280] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">1st Steer Axle → 1st Drive Axle Distance</p>
                      <p className="text-sm text-[#202224] font-medium leading-[21px] break-words flex-1">192 in</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <p className="text-xs text-[#6b7280] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">1st Drive Axle → 2nd Drive Axle Distance</p>
                      <p className="text-sm text-[#202224] font-medium leading-[21px] break-words flex-1">54 in</p>
                    </div>
                  </div>
                </div>
                
                {/* Axle Width */}
                <div className="pt-3 border-t border-[#e2e8f0]">
                  <p className="text-xs font-semibold text-[#6b7280] mb-3 uppercase">Axle Width</p>
                  <div className="space-y-3">
                    <InfoField label="Steer Axle Width" value="80 in" />
                    <InfoField label="1st Drive Axle Width" value="96 in" />
                    <InfoField label="2nd Drive Axle Width" value="96 in" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Trailer Information - Detailed */}
      <CollapsibleSection
        id="trailer"
        title="Trailer Information"
        subtitle="Detailed specifications of the trailer"
      >
        <div className="space-y-4">
          {/* Jeep */}
          <div className="border-b border-[#e5e7eb] pb-4">
            <p className="text-[15px] font-normal text-[#0f172a] mb-4">Jeep</p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-3">
                <InfoField label="Unit #" value="UASJT01" />
                <InfoField label="License Plate" value="JEP-1234" />
                <InfoField label="VIN" value="1FUJGHDV1CLBP3589" />
                <InfoField label="Year" value="2019" />
                <InfoField label="Make" value="Fontaine" />
                <InfoField label="Model" value="Magnitude 55L" />
                <InfoField label="Tire Size" value="11 in" />
                <InfoField label="Number of Axles" value="2" />
                <InfoField label="Wheels per Axle" value="4" />
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from previous unit to first axle on Jeep</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">168 in</p>
                </div>
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from last axle to next axle</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">54 in</p>
                </div>
                <InfoField label="TARE" value="5,000 lbs" />
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Annual Inspection Expiry Date</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">12/31/2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booster */}
          <div className="border-b border-[#e5e7eb] pb-4">
            <p className="text-[15px] font-normal text-[#0f172a] mb-4">Booster</p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-3">
                <InfoField label="Unit #" value="UABST01" />
                <InfoField label="License Plate" value="BST-5678" />
                <InfoField label="VIN" value="1XNAP40X6YN456789" />
                <InfoField label="Year" value="2020" />
                <InfoField label="Make" value="Trail King" />
                <InfoField label="Model" value="TK110HDG" />
                <InfoField label="Tire Size" value="12 in" />
                <InfoField label="Number of Axles" value="2" />
                <InfoField label="Wheels per Axle" value="8" />
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from previous unit to first axle on Booster</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">192 in</p>
                </div>
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from last axle to next axle</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">52 in</p>
                </div>
                <InfoField label="TARE" value="12,000 lbs" />
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Annual Inspection Expiry Date</p>
                  <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">06/30/2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trailer */}
          <div className="border-b border-[#e5e7eb] pb-4">
            <p className="text-[15px] font-normal text-[#0f172a] mb-4">Trailer</p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-3 sm:p-4">
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-3 pb-3 border-b border-[#e2e8f0]">
                  <InfoField label="Unit #" value="TRL-001" />
                  <InfoField label="License Plate" value="TRL-9012" />
                  <InfoField label="VIN" value="4KZDCO9292VS234567" />
                  <InfoField label="Year" value="2021" />
                  <InfoField label="Make" value="Fontaine" />
                  <InfoField label="Model" value="Magnitude 55 Ton" />
                  <InfoField label="Trailer Configuration" value="Perimeter Trailer" />
                  <InfoField label="Trailer Type" value="Flat Bed" />
                </div>

                {/* Deck & Pin Joint Information */}
                <div className="space-y-3 pb-3 border-b border-[#e2e8f0]">
                  <InfoField label="Pin Joint Present?" value="Yes" />
                  <InfoField label="Deck Section Required" value="Yes" />
                  <InfoField label="Deck Section Length" value="240 in" />
                  <InfoField label="Deck Section Width" value="102 in" />
                </div>

                {/* Axle & Tire Configuration */}
                <div className="space-y-3 pb-3 border-b border-[#e2e8f0]">
                  <InfoField label="Number of Axles" value="3" />
                  <InfoField label="Wheels per Axle" value="8" />
                  <InfoField label="Tire Size" value="11 in" />
                  <InfoField label="Tire Width" value="10 in" />
                  <InfoField label="Axle Width" value="102 in" />
                  <InfoField label="Axle Spacing" value="54 in" />
                </div>

                {/* Spacing & Distance Measurements */}
                <div className="space-y-3 pb-3 border-b border-[#e2e8f0]">
                  <div className="flex gap-4 items-start">
                    <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from previous unit to first axle on Trailer</p>
                    <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">192 in</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from Axle 1 to Axle 2</p>
                    <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">54 in</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Distance from Axle 2 to Axle 3</p>
                    <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">54 in</p>
                  </div>
                </div>

                {/* Weight & Inspection */}
                <div className="space-y-3">
                  <InfoField label="TARE" value="15,000 lbs" />
                  <div className="flex gap-4 items-start">
                    <p className="text-xs text-[#64748b] font-normal leading-[18px] w-[140px] flex-shrink-0 pt-0.5">Annual Inspection Expiry Date</p>
                    <p className="text-sm text-[#0f172a] font-medium leading-[21px] flex-1">06/30/2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Driver Information */}
      <CollapsibleSection
        id="driver"
        title="Driver Information"
        subtitle="Details about the driver assigned to the trip"
      >
        <div className="space-y-4">
          <InfoField label="Driver Name" value="John Smith" />
          <InfoField label="License Number" value="DL123456789" />
          <InfoField label="Contact Number" value="(555) 123-4567" />
        </div>
      </CollapsibleSection>

      {/* Reported Incidents */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <button 
                  onClick={() => setIsIncidentDrawerOpen(true)}
                  className="bg-[#fb923c] rounded-lg size-8 flex items-center justify-center shrink-0 hover:bg-[#f97316] transition-colors"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 20 20">
                    <path d="M10 6.66667V10M10 13.3333H10.0083M8.57501 3.51667L2.52084 13.8333C2.37154 14.0885 2.29331 14.3779 2.29331 14.6725C2.29331 14.967 2.37154 15.2564 2.52084 15.5117C2.67013 15.7669 2.88578 15.9792 3.14373 16.1262C3.40168 16.2732 3.69309 16.3499 3.98918 16.35H16.0975C16.3936 16.3499 16.685 16.2732 16.943 16.1262C17.2009 15.9792 17.4166 15.7669 17.5659 15.5117C17.7152 15.2564 17.7934 14.967 17.7934 14.6725C17.7934 14.3779 17.7152 14.0885 17.5659 13.8333L11.5117 3.51667C11.3624 3.26145 11.1467 3.04915 10.8888 2.90216C10.6308 2.75517 10.3394 2.67847 10.0433 2.67847C9.74729 2.67847 9.45591 2.75517 9.19796 2.90216C8.94001 3.04915 8.72436 3.26145 8.57501 3.51667Z" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h3 className="text-sm font-semibold text-[#0f172a]">Reported Incidents</h3>
              </div>
              <p className="text-xs text-[#6b7280] ml-11">2 incidents</p>
            </div>
            <button 
              onClick={() => setIsIncidentDrawerOpen(true)}
              className="bg-[#fb923c] hover:bg-[#f97316] text-white size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            >
              <svg className="size-5" fill="none" viewBox="0 0 20 20">
                <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Incidents List */}
        <div className="px-4 pt-4 pb-4 space-y-3">
          {/* Incident 1 */}
          <div className="bg-white border border-[#fed7aa] rounded-lg p-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#c2410c]">Breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fef3c7] border border-[#fde68a] rounded text-[10px] font-medium text-[#92400e]">Medium</span>
                <span className="text-xs text-[#6b7280]">2h ago</span>
              </div>
            </div>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Tire blowout on I-95 southbound near mile marker 142. Vehicle pulled to shoulder, waiting for roadside assistance.
            </p>
          </div>

          {/* Incident 2 */}
          <div className="bg-white border border-[#fecaca] rounded-lg p-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#991b1b]">Road Closure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fee2e2] border border-[#fecaca] rounded text-[10px] font-medium text-[#991b1b]">High</span>
                <span className="text-xs text-[#6b7280]">5h ago</span>
              </div>
            </div>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Highway 101 closed due to accident. Rerouting through alternate route via Highway 280. ETA delayed by 45 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Report Incident Drawer */}
      <ReportIncidentDrawer isOpen={isIncidentDrawerOpen} onClose={() => setIsIncidentDrawerOpen(false)} />
    </div>
  );
}
