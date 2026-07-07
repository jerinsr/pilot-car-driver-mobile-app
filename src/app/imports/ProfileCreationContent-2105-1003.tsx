import svgPaths from "./svg-iygenqqlgs";

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-[143.7px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#686c74] text-[14px] top-[-0.4px]">2 unread notifications</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[52.963px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[25.5px] not-italic text-[#2383f8] text-[14px] text-center top-[0.6px]">Clear All</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Button />
    </div>
  );
}

function Date() {
  return (
    <div className="content-stretch flex items-center relative rounded-[25px] shrink-0" data-name="Date">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#202021] text-[12px] text-center">Today</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative w-full">
        <Date />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_1012)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_1012">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#d1fae5] relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[111.4px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-0 not-italic text-[16px] text-black top-[-1.4px]">Trip Completed</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#777c86] text-[14px] w-[324px]">Your delivery to Chicago, IL has been marked as complete. Payment is being processed.</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[18px] relative shrink-0 w-[67.213px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#84878c] text-[14px] top-0">2 hours ago</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative w-full">
        <Container2 />
        <Paragraph3 />
        <Container3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#f5f9ff] relative rounded-[8px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start p-[16px] relative w-full">
        <Container1 />
        <Container4 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_1007)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #0066CC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333V10" id="Vector_2" stroke="var(--stroke-0, #0066CC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667H10.0083" id="Vector_3" stroke="var(--stroke-0, #0066CC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_1007">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[22.5px] left-0 top-0 w-[168.725px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-0 not-italic text-[16px] text-black top-[-1.4px]">New Route Assignment</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Container">
      <Paragraph5 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#777c86] text-[14px] w-[328px]">You have been assigned a new route from Dallas, TX to Houston, TX. Departure scheduled for tomorrow at 6:00 AM.</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[67.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#84878c] text-[14px] top-[-0.2px]">5 hours ago</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative w-full">
        <Container7 />
        <Paragraph6 />
        <Container8 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f5f9ff] relative rounded-[8px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start p-[16px] relative w-full">
        <Container6 />
        <Container9 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Container5 />
      <Container10 />
    </div>
  );
}

function Date1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[25px] shrink-0" data-name="Date">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#202021] text-[12px] text-center">Yesterday</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative w-full">
        <Date1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_1016)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_1016">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#fed7aa] relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[178.938px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-0 not-italic text-[15px] text-black top-[-1.4px]">Document Expiring Soon</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[42.25px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21.125px] left-0 not-italic text-[#777c86] text-[14px] top-[0.4px] w-[333px]">{`Your commercial driver's license will expire in 30 days. Please update your credentials.`}</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[18px] relative shrink-0 w-[54.225px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#777c86] text-[14px] top-[-0.2px]">1 day ago</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph11 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative self-stretch shrink-0 w-[324px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
        <Container13 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white relative rounded-[8px] shadow-[0px_2px_8px_0px_rgba(95,95,95,0.12)] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start p-[16px] relative w-full">
        <Container12 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Paragraph8 />
      {[...Array(3).keys()].map((_, i) => (
        <Container15 key={i} />
      ))}
    </div>
  );
}

function Date2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[25px] shrink-0" data-name="Date">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#202021] text-[12px] text-center">This Week</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="Paragraph">
      <Date2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2105_1016)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2105_1016">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#fed7aa] relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[178.938px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-0 not-italic text-[15px] text-black top-[-1.4px]">Document Expiring Soon</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[42.25px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21.125px] left-0 not-italic text-[#777c86] text-[14px] top-[0.4px] w-[333px]">{`Your commercial driver's license will expire in 30 days. Please update your credentials.`}</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[18px] relative shrink-0 w-[54.225px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#777c86] text-[14px] top-[-0.2px]">1 day ago</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph15 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative self-stretch shrink-0 w-[324px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Paragraph13 />
        <Paragraph14 />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white relative rounded-[8px] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start p-[16px] relative w-full">
        <Container17 />
        <Container19 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Paragraph12 />
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[408px]" data-name="Container">
      <Container11 />
      <Container16 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[795px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container22 />
    </div>
  );
}

export default function ProfileCreationContent() {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col items-start p-[16px] relative size-full" data-name="Profile creation content">
      <Container23 />
    </div>
  );
}