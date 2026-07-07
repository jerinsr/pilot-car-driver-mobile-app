import { ChevronRight, Lock, Shield, Trash2, LogOut } from 'lucide-react';
import Header from './Header';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface SecurityAccountProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function SecurityAccount({ onNavigate, onLogout, onDeleteAccount }: SecurityAccountProps) {
  const securityItems = [
    {
      id: 'reset-password',
      icon: Lock,
      title: 'Reset Password',
      description: 'Change your account password',
      onClick: () => {
        onNavigate('reset-password');
      },
    },
    {
      id: '2fa',
      icon: Shield,
      title: 'Two-Factor Authentication',
      description: 'Enable/Disable 2FA for added security',
      onClick: () => {
        onNavigate('2fa');
      },
    },
    {
      id: 'delete',
      icon: Trash2,
      title: 'Delete Account',
      description: 'Permanently delete your account',
      onClick: onDeleteAccount,
      danger: true,
      restricted: true,
    },
    {
      id: 'logout',
      icon: LogOut,
      title: 'Logout',
      description: 'Sign out of your account',
      onClick: onLogout,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Security & Account" onBack={() => onNavigate('overview')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#6b7280]">Manage your security settings and account options</p>
          </div>

          {/* Security Items */}
          <div className="flex flex-col gap-3">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  <button
                    onClick={item.onClick}
                    className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 w-full hover:bg-[#f9f9f9] transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.danger ? 'bg-[#fee2e2]' : 'bg-[#eef4ff]'
                    }`}>
                      <Icon className={`w-5 h-5 ${item.danger ? 'text-[#d45153]' : 'text-[#0066cc]'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-[16px] font-semibold ${item.danger ? 'text-[#d45153]' : 'text-black'}`}>
                        {item.title}
                      </p>
                      <p className="text-[13px] text-[#6b7280]">{item.description}</p>
                      {item.restricted && (
                        <p className="text-[12px] text-[#f89823] mt-1">
                          Restricted for company-invited users
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-[#eef4ff] border border-[#c7d7fe] rounded-[8px] p-4">
            <h3 className="text-[14px] font-semibold text-[#0066cc] mb-2">Security Tips</h3>
            <ul className="text-[13px] text-[#0b1215] space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication</li>
              <li>• Never share your password with anyone</li>
              <li>• Review login activity regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}