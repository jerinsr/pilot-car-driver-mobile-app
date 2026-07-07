import { ChevronRight, User, Shield, Settings, HelpCircle, Edit2, Truck } from 'lucide-react';
import Header from './Header';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface ProfileOverviewProps {
  onNavigate: (screen: Screen) => void;
  onToggleSidebar?: () => void;
}

export default function ProfileOverview({ onNavigate, onToggleSidebar }: ProfileOverviewProps) {
  const sections = [
    {
      id: 'security' as Screen,
      icon: Shield,
      title: 'Security & Account',
      description: 'Password, 2FA, and account settings',
    },
    {
      id: 'preferences' as Screen,
      icon: Settings,
      title: 'App Preferences',
      description: 'Notifications, currency, and policies',
    },
    {
      id: 'support' as Screen,
      icon: HelpCircle,
      title: 'Support',
      description: 'Help center, FAQs, and contact',
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Profile" showMenuButton={true} onMenuClick={onToggleSidebar} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Profile Information Section */}
          <div className="bg-white rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-6">
            <div className="flex flex-col items-center gap-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#0066cc] flex items-center justify-center">
                  <span className="text-white text-[40px] font-semibold">J</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#f89823] flex items-center justify-center shadow-md">
                  <Edit2 className="w-4 h-4 text-[#1a1a1a]" />
                </button>
              </div>

              {/* User Information */}
              <div className="flex flex-col items-center gap-2 w-full">
                <h2 className="text-[20px] font-semibold text-black">John Davis</h2>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-center gap-2 text-[14px] text-[#0b1215]">
                    <span className="text-[#6b7280]">Email:</span>
                    <span className="font-medium">john.davis@overwizeconnect.com</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[14px] text-[#0b1215]">
                    <span className="text-[#6b7280]">Phone:</span>
                    <span className="font-medium">+1 (555) 234-5678</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-center gap-4 pt-5 mt-5 border-t border-[#e5e7eb]">
              <div className="w-12 h-12 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#0066cc]" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-[#6b7280] mb-1">Account Type</p>
                <p className="text-[16px] font-semibold text-black">Truck Driver</p>
              </div>
              <div className="bg-[#10b981] rounded-full px-3 py-1">
                <span className="text-[12px] font-semibold text-white">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Access Sections */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Quick Access</h3>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 hover:bg-[#f9f9f9] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#0066cc]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[16px] font-semibold text-black">{section.title}</p>
                    <p className="text-[13px] text-[#6b7280]">{section.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}