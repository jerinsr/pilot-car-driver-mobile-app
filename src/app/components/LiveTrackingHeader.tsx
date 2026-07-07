import svgPaths from "../imports/svg-hsbprh67qc";
import imgMapImage from "figma:asset/1f5cbd94e64bd6468d47d611846ed0c8a6eaf1a1.png";
import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";

interface LiveTrackingHeaderProps {
  currentLocation: string;
  speed: string;
  eta: string;
  progress: number; // 0-100
  onMaximize?: () => void;
  isCollapsed?: boolean;
}

function MapContainer() {
  return (
    <div
      className="content-stretch flex flex-col items-center justify-end relative size-full"
      data-name="Map Container"
    >
      <motion.div
        className="absolute h-[400px] left-0 top-[0] w-[477px]"
        data-name="Map Image"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
          src={imgMapImage}
        />
      </motion.div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="absolute content-stretch flex h-[16.007px] items-start left-[17.98px] top-0 w-[96.467px]"
      data-name="Text"
    >
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap tracking-[0.3px] uppercase">
        Live Tracking
      </p>
    </div>
  );
}

function Text1() {
  return (
    <motion.div
      className="absolute bg-[#00c950] left-[-3.29px] opacity-[0.256] rounded-[3.96025e+07px] size-[16.585px] top-[-3.29px]"
      data-name="Text"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.256, 0.4, 0.256],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function Text2() {
  return (
    <motion.div
      className="absolute bg-[#00a63e] left-0 rounded-[3.96025e+07px] size-[9.995px] top-0"
      data-name="Text"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function Text3() {
  return (
    <div
      className="absolute left-0 size-[9.995px] top-[3.01px]"
      data-name="Text"
    >
      <Text1 />
      <Text2 />
    </div>
  );
}

function Container() {
  return (
    <div
      className="h-[16.007px] relative shrink-0 w-[114.447px]"
      data-name="Container"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Text3 />
      </div>
    </div>
  );
}

function Text4({ eta }: { eta: string }) {
  return (
    <div
      className="bg-[#f3f4f6] h-[23.974px] relative rounded-[4px] shrink-0 px-2"
      data-name="Text"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full flex items-center">
        <p className="font-['Consolas:Bold',sans-serif] leading-[16px] not-italic text-[#4a5565] text-[12px] whitespace-nowrap">
          ETA: {eta}
        </p>
      </div>
    </div>
  );
}

function Container1({ eta }: { eta: string }) {
  return (
    <div
      className="content-stretch flex h-[23.974px] items-center justify-between relative shrink-0 w-full"
      data-name="Container"
    >
      <Container />
      <Text4 eta={eta} />
    </div>
  );
}

function Icon() {
  return (
    <motion.div
      className="absolute left-0 size-[13.997px] top-px"
      data-name="Icon"
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g clipPath="url(#clip0_156_1299)" id="Icon">
          <path
            d={svgPaths.p3e500d80}
            id="Vector"
            stroke="#101828"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16642"
          />
          <path
            d="M8.74812 10.4977H5.24887"
            id="Vector_2"
            stroke="#101828"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16642"
          />
          <path
            d={svgPaths.p5753980}
            id="Vector_3"
            stroke="#101828"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16642"
          />
          <path
            d={svgPaths.p3d9bef00}
            id="Vector_4"
            stroke="#101828"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16642"
          />
          <path
            d={svgPaths.p3492100}
            id="Vector_5"
            stroke="#101828"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16642"
          />
        </g>
        <defs>
          <clipPath id="clip0_156_1299">
            <rect fill="white" height="13.997" width="13.997" />
          </clipPath>
        </defs>
      </svg>
    </motion.div>
  );
}

function Text5({
  currentLocation,
}: {
  currentLocation: string;
}) {
  return (
    <div
      className="basis-0 grow h-[16.007px] min-h-px min-w-px relative shrink-0"
      data-name="Text"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[19.99px] not-italic text-[#101828] text-[14px] text-nowrap top-0">
          {currentLocation}
        </p>
      </div>
    </div>
  );
}

function Text6({ speed }: { speed: string }) {
  return (
    <div
      className="h-[16.007px] relative shrink-0"
      data-name="Text"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-start relative">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-nowrap">
          {speed}
        </p>
      </div>
    </div>
  );
}

function Container2({
  currentLocation,
  speed,
}: {
  currentLocation: string;
  speed: string;
}) {
  return (
    <div
      className="h-[16.007px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="size-full">
        <div className="content-stretch flex items-start justify-between relative size-full">
          <Text5 currentLocation={currentLocation} />
          <Text6 speed={speed} />
        </div>
      </div>
    </div>
  );
}

function RouteDetailsContainer({
  currentLocation,
  speed,
}: {
  currentLocation: string;
  speed: string;
}) {
  return (
    <div
      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
      data-name="Route Details Container"
    >
      <Container2
        currentLocation={currentLocation}
        speed={speed}
      />
    </div>
  );
}

function Container3({ progress }: { progress: number }) {
  return (
    <motion.div
      className="bg-[#00a63e] h-[7.985px] rounded-[3.96025e+07px] shadow-[0px_0px_10px_0px_rgba(37,99,235,0.5)] shrink-0"
      data-name="Container"
      initial={{ width: 0 }}
      animate={{
        width: `${progress}%`,
        boxShadow: [
          "0px 0px 10px 0px rgba(0,166,62,0.5)",
          "0px 0px 15px 0px rgba(0,166,62,0.7)",
          "0px 0px 10px 0px rgba(0,166,62,0.5)",
        ],
      }}
      transition={{
        width: { duration: 0.8, ease: "easeOut" },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    />
  );
}

function Container4({ progress }: { progress: number }) {
  return (
    <div
      className="bg-[#f3f4f6] h-[7.985px] relative rounded-[3.96025e+07px] shrink-0 w-full"
      data-name="Container"
    >
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <Container3 progress={progress} />
        </div>
      </div>
    </div>
  );
}

function RouteInfoContainer({
  currentLocation,
  speed,
  progress,
}: {
  currentLocation: string;
  speed: string;
  progress: number;
}) {
  return (
    <div
      className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
      data-name="Route Info Container"
    >
      <RouteDetailsContainer
        currentLocation={currentLocation}
        speed={speed}
      />
      <Container4 progress={progress} />
    </div>
  );
}

function InfoContainer({
  currentLocation,
  speed,
  eta,
  progress,
}: LiveTrackingHeaderProps) {
  return (
    <motion.div
      className="bg-[rgba(255,255,255,0.72)] relative shrink-0 w-full"
      data-name="Info Container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-end p-[16px] relative w-full">
          <Container1 eta={eta} />
          <RouteInfoContainer
            currentLocation={currentLocation}
            speed={speed}
            progress={progress}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveTrackingHeader({
  currentLocation,
  speed,
  eta,
  progress,
  onMaximize,
  isCollapsed = false,
}: LiveTrackingHeaderProps) {
  return (
    <motion.div
      className="bg-[#d4d3d3] content-stretch flex flex-col items-end justify-between overflow-clip relative rounded-tl-[16px] rounded-tr-[16px] w-full"
      data-name="Live Tracking Header"
      animate={{
        height: isCollapsed ? 120 : 303,
      }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <MapContainer />
      <InfoContainer
        currentLocation={currentLocation}
        speed={speed}
        eta={eta}
        progress={progress}
      />
      {onMaximize && (
        <button
          className="absolute right-4 top-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all hover:scale-110 active:scale-95"
          onClick={onMaximize}
        >
          <Maximize2 className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </motion.div>
  );
}