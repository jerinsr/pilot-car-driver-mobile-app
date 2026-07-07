import svgPaths from "./svg-abl6lneir1";

function BackButton() {
  return <div className="absolute left-[15.99px] size-[43.999px] top-[15.99px]" data-name="BackButton1" />;
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[23.263px] items-start left-[59.99px] top-[26.36px] w-[229.982px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[20px] text-center text-white">Dashboard</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[19.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9917 19.9917">
        <g id="Icon">
          <path d={svgPaths.p173acb00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          <path d={svgPaths.p2e8cae00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex items-center justify-center left-[47.98px] overflow-clip rounded-[37170400px] size-[35.985px] top-0" data-name="Button">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[8px] size-[19.992px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9917 19.9917">
        <g clipPath="url(#clip0_2096_97)" id="Icon">
          <path d={svgPaths.p659f680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          <path d={svgPaths.p18776180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
        </g>
        <defs>
          <clipPath id="clip0_2096_97">
            <rect fill="white" height="19.9917" width="19.9917" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bg-[#fb2c36] h-[18.988px] left-[14.89px] rounded-[37170400px] top-[-4px] w-[25.098px]" data-name="Text">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[12.99px] not-italic text-[10px] text-center text-white top-[2.1px]">9+</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] left-0 rounded-[12px] size-[35.985px] top-0" data-name="Button">
      <Icon1 />
      <Text />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[35.985px] left-[289.97px] top-[19.99px] w-[83.965px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

export default function Header() {
  return (
    <div className="relative size-full" data-name="Header" style={{ backgroundImage: "linear-gradient(150.608deg, rgb(11, 18, 21) 8.7016%, rgb(48, 48, 49) 96.752%)" }}>
      <BackButton />
      <Paragraph />
      <Container />
    </div>
  );
}