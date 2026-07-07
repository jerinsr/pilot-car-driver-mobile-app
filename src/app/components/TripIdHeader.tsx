import svgPaths from "../imports/svg-uhwbb27uho";

interface TripIdHeaderProps {
  tripId: string;
  status: 'Open' | 'In Transit' | 'Action Required' | 'Completed';
}

function Heading({ tripId }: { tripId: string }) {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 2">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#101828] text-[16px] text-nowrap">Trip - {tripId}</p>
    </div>
  );
}

function Container({ tripId }: { tripId: string }) {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Heading tripId={tripId} />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[9.17px] size-[11.987px] top-[5.18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_156_1351)" id="Icon">
          <path d={svgPaths.p398aed00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.998907" />
        </g>
        <defs>
          <clipPath id="clip0_156_1351">
            <rect fill="white" height="11.9869" width="11.9869" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  // Status badge colors
  const statusColors: Record<string, string> = {
    'Open': '#067647',
    'In Transit': '#2383f8',
    'Action Required': '#b42318',
    'Completed': '#6b7280'
  };

  const bgColor = statusColors[status] || statusColors['In Transit'];

  return (
    <div className="h-[22.351px] relative rounded-[5px] shrink-0 w-[91.285px]" style={{ backgroundColor: bgColor }} data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Icon />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[29.12px] not-italic text-[12px] text-nowrap text-white top-[3.17px]">{status}</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.18px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[5px]" />
    </div>
  );
}

function Container1({ tripId, status }: { tripId: string; status: string }) {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex items-start justify-between relative w-full">
          <Container tripId={tripId} />
          <Badge status={status} />
        </div>
      </div>
    </div>
  );
}

export default function TripIdHeader({ tripId, status }: TripIdHeaderProps) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative size-full">
      <Container1 tripId={tripId} status={status} />
    </div>
  );
}