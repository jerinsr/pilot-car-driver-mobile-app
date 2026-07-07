import svgPaths from '../imports/svg-abl6lneir1';
import { ArrowLeft, Menu } from 'lucide-react';

function NotificationButton({ onClick, badgeCount }: { onClick?: () => void; badgeCount?: number }) {
  return (
    <button 
      className="relative flex items-center justify-center w-[36px] h-[36px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/15 transition-all duration-200 backdrop-blur-sm cursor-pointer"
      onClick={onClick}
      data-name="Notification Button"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 19.9917 19.9917">
        <g clipPath="url(#clip0_notification)">
          <path d={svgPaths.p659f680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          <path d={svgPaths.p18776180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
        </g>
        <defs>
          <clipPath id="clip0_notification">
            <rect fill="white" height="19.9917" width="19.9917" />
          </clipPath>
        </defs>
      </svg>
      {badgeCount && badgeCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-[#fb2c36] rounded-full min-w-[19px] h-[19px] flex items-center justify-center px-1">
          <p className="font-semibold text-[10px] text-white leading-[15px]">
            {badgeCount > 9 ? '9+' : badgeCount}
          </p>
        </div>
      )}
    </button>
  );
}

function ProfileButton({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-white/20 active:bg-white/15 transition-all duration-200 backdrop-blur-sm cursor-pointer"
      onClick={onClick}
      data-name="Profile Button"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 19.9917 19.9917">
        <g>
          <path d={svgPaths.p173acb00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          <path d={svgPaths.p2e8cae00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
        </g>
      </svg>
    </button>
  );
}

function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/15 transition-all duration-200 backdrop-blur-sm cursor-pointer"
      onClick={onClick}
      data-name="Back Button"
    >
      <ArrowLeft className="w-6 h-6 text-white" />
    </button>
  );
}

function MenuButton({ onClick }: { onClick?: () => void}) {
  return null;
}

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  rightElement?: React.ReactNode;
  jobNumber?: string;
  backButtonText?: string;
  onNotificationClick?: () => void;
  notificationCount?: number;
  onProfileClick?: () => void;
  showNotifications?: boolean;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  onBack, 
  showBackButton = false, 
  onMenuClick, 
  showMenuButton = false, 
  rightElement, 
  jobNumber, 
  backButtonText,
  onNotificationClick,
  notificationCount = 0,
  onProfileClick,
  showNotifications = true,
  showProfile = true
}: HeaderProps) {
  return (
    <div 
      className="content-stretch flex items-center justify-between px-4 py-5 relative shrink-0 w-full h-[75px]" 
      data-name="Header"
      style={{
        backgroundImage: 'linear-gradient(150.608deg, rgb(11, 18, 21) 8.7016%, rgb(48, 48, 49) 96.752%)'
      }}
    >
      {/* Left Section */}
      <div className="flex items-center justify-start w-[44px]">
        {showBackButton && onBack ? (
          <BackButton onClick={onBack} />
        ) : showMenuButton && onMenuClick ? (
          <MenuButton onClick={onMenuClick} />
        ) : null}
      </div>

      {/* Center Section - Title */}
      <div className="flex-1 flex items-center justify-center px-4">
        <h1 className="font-bold text-[20px] text-white text-center leading-normal">
          {jobNumber || title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-3">
        {rightElement ? (
          rightElement
        ) : (
          <>
            {showNotifications && (
              <NotificationButton 
                onClick={onNotificationClick} 
                badgeCount={notificationCount}
              />
            )}
            {showProfile && (
              <ProfileButton onClick={onProfileClick} />
            )}
          </>
        )}
      </div>
    </div>
  );
}