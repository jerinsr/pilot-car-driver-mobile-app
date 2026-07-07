function Container() {
  return <div className="absolute border-[#e5e7eb] border-[1.108px] border-solid h-[48.967px] left-0 rounded-[8px] top-0 w-[357.946px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[41.48px] not-italic text-[14px] text-center text-white top-[-0.11px]">Job Details</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col h-[38.997px] items-start left-[4.98px] pt-[11.493px] px-[15.993px] rounded-[5px] shadow-[0px_0px_2px_0px_#949ec5] top-[4.98px] w-[114.515px]" data-name="Button" style={{ backgroundImage: "linear-gradient(162.2deg, rgb(37, 99, 235) 30.266%, rgb(78, 121, 216) 91.737%)" }}>
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[15.993px] left-[13.1px] top-[11.49px] w-[82.528px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[46.54px] not-italic text-[#0a0a0a] text-[14px] text-center top-[-0.23px] w-[60px]">Bids (1)</p>
    </div>
  );
}

function Container1() {
  return <div className="absolute border-[1.108px] border-[rgba(0,0,0,0)] border-solid h-[38.997px] left-0 rounded-[8px] top-0 w-[108.734px]" data-name="Container" />;
}

function Button1() {
  return (
    <div className="absolute h-[38.997px] left-[127.5px] rounded-[8px] top-[4.98px] w-[108.734px]" data-name="Button">
      <Paragraph1 />
      <Container1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[15.993px] left-[13.1px] top-[11.49px] w-[82.528px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[41.22px] not-italic text-[#0a0a0a] text-[14px] text-center top-[-0.11px]">Invoice</p>
    </div>
  );
}

function Container2() {
  return <div className="absolute border-[1.108px] border-[rgba(0,0,0,0)] border-solid h-[38.997px] left-0 rounded-[8px] top-0 w-[108.734px]" data-name="Container" />;
}

function Button2() {
  return (
    <div className="absolute h-[38.997px] left-[244.23px] rounded-[8px] top-[4.98px] w-[108.734px]" data-name="Button">
      <Paragraph2 />
      <Container2 />
    </div>
  );
}

export default function SegmentedTabControl() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="SegmentedTabControl">
      <Container />
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}