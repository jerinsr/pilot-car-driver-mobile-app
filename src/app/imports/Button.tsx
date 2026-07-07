function Icon() {
  return (
    <div className="absolute left-[109.56px] size-[15.993px] top-[14.89px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d="M3.33195 7.99667H12.6614" id="Vector" stroke="var(--stroke-0, #1A1A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d="M7.99667 3.33195V12.6614" id="Vector_2" stroke="var(--stroke-0, #1A1A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#f89823] border-[1.108px] border-[rgba(248,152,35,0.2)] border-solid relative rounded-[8px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-full" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[195.55px] not-italic text-[#1a1a1a] text-[14px] text-center top-[13px]">Create New Job</p>
    </div>
  );
}