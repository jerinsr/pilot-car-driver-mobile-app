import { ChevronRight, Bell, Shield, FileText, ScrollText } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support' | 'notifications';

interface AppPreferencesProps {
  onNavigate: (screen: Screen) => void;
}

export default function AppPreferences({ onNavigate }: AppPreferencesProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'CAD' | 'USD'>('CAD');

  const preferenceItems = [
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notification History',
      description: 'View past notifications',
      onClick: () => {
        onNavigate('notifications');
      },
    },
  ];

  const legalItems = [
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy Policy',
      description: 'How we protect your data',
      onClick: () => {
        // Navigate to privacy policy (placeholder)
      },
    },
    {
      id: 'terms',
      icon: FileText,
      title: 'Terms & Conditions',
      description: 'Terms of service',
      onClick: () => {
        // Navigate to terms (placeholder)
      },
    },
    {
      id: 'agreement',
      icon: ScrollText,
      title: 'User Service Agreement',
      description: 'Service usage agreement',
      onClick: () => {
        // Navigate to agreement (placeholder)
      },
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="App Preferences" onBack={() => onNavigate('overview')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#6b7280]">Customize your app settings and preferences</p>
          </div>

          {/* Preference Items */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Settings</h3>
            {preferenceItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 hover:bg-[#f9f9f9] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#0066cc]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[16px] font-semibold text-black">{item.title}</p>
                    <p className="text-[13px] text-[#6b7280]">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
                </button>
              );
            })}

            {/* Currency Selection */}
            <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-[#0066cc]">$</span>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-semibold text-black">Currency Type</p>
                  <p className="text-[13px] text-[#6b7280]">Select your preferred currency</p>
                </div>
                <div className="relative bg-[#f3f4f6] rounded-[8px] p-1 flex-shrink-0">
                  <div 
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[6px] shadow-sm transition-transform duration-200 ease-out"
                    style={{
                      transform: selectedCurrency === 'USD' ? 'translateX(calc(100% + 8px))' : 'translateX(0)'
                    }}
                  />
                  <div className="relative flex">
                    <button
                      onClick={() => setSelectedCurrency('CAD')}
                      className={`py-1.5 px-3 rounded-[6px] transition-colors duration-200 relative z-10 ${
                        selectedCurrency === 'CAD'
                          ? 'text-black'
                          : 'text-[#6b7280]'
                      }`}
                    >
                      <span className="font-semibold text-[14px]">CAD</span>
                    </button>
                    <button
                      onClick={() => setSelectedCurrency('USD')}
                      className={`py-1.5 px-3 rounded-[6px] transition-colors duration-200 relative z-10 ${
                        selectedCurrency === 'USD'
                          ? 'text-black'
                          : 'text-[#6b7280]'
                      }`}
                    >
                      <span className="font-semibold text-[14px]">USD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Legal & Policies */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Legal & Policies</h3>
            {legalItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 hover:bg-[#f9f9f9] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#6b7280]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[16px] font-semibold text-black">{item.title}</p>
                    <p className="text-[13px] text-[#6b7280]">{item.description}</p>
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