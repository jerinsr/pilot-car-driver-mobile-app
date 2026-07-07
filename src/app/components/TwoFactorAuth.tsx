import { useState } from 'react';
import { Shield, Smartphone, Key, Copy, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface TwoFactorAuthProps {
  onNavigate: (screen: Screen) => void;
}

export default function TwoFactorAuth({ onNavigate }: TwoFactorAuthProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock backup codes
  const backupCodes = [
    '1A2B-3C4D-5E6F',
    '7G8H-9I0J-1K2L',
    '3M4N-5O6P-7Q8R',
    '9S0T-1U2V-3W4X',
    '5Y6Z-7A8B-9C0D',
    '1E2F-3G4H-5I6J',
  ];

  const handleToggle2FA = () => {
    if (!is2FAEnabled) {
      // Enabling 2FA
      setIs2FAEnabled(true);
    } else {
      // Disabling 2FA - would require verification
      setIs2FAEnabled(false);
      setShowBackupCodes(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      // Verify code logic
      setShowBackupCodes(true);
    }
  };

  const copyToClipboard = (code: string) => {
    // Fallback method for copying text
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      textArea.remove();
      // Just show the visual feedback even if copy fails
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'overwize-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Two-Factor Authentication" onBack={() => onNavigate('security')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#6b7280]">Add an extra layer of security to your account</p>
          </div>

          {/* 2FA Toggle */}
          <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#0066cc]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-black">Enable 2FA</p>
                  <p className="text-[13px] text-[#6b7280]">Secure your account with 2FA</p>
                </div>
              </div>
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handleToggle2FA}
                className="data-[state=checked]:bg-[#00a63e]"
              />
            </div>
          </div>

          {is2FAEnabled && !showBackupCodes && (
            <>
              {/* QR Code Section */}
              <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#0066cc]" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-black">Scan QR Code</h3>
                  <p className="text-[13px] text-[#6b7280] text-center">
                    Use your authenticator app to scan the QR code below
                  </p>

                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-[#f3f4f6] rounded-[8px] flex items-center justify-center border border-[#e5e7eb]">
                    <div className="text-center">
                      <Key className="w-12 h-12 text-[#9ca3af] mx-auto mb-2" />
                      <p className="text-[12px] text-[#6b7280]">QR Code</p>
                    </div>
                  </div>

                  {/* Manual Entry Code */}
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-3">
                    <p className="text-[12px] text-[#6b7280] mb-1">Or enter this code manually:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-[14px] font-mono text-black">ABCD EFGH IJKL MNOP</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('ABCDEFGHIJKLMNOP')}
                        className="text-[#0066cc] hover:text-[#0052a3]"
                      >
                        {copiedCode === 'ABCDEFGHIJKLMNOP' ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00a63e]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Code Input */}
              <form onSubmit={handleVerify} className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4">
                <Label htmlFor="verification-code" className="text-[14px] font-semibold text-black mb-2 block">
                  Enter Verification Code
                </Label>
                <p className="text-[13px] text-[#6b7280] mb-3">
                  Enter the 6-digit code from your authenticator app
                </p>
                <div className="flex gap-3">
                  <Input
                    id="verification-code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="flex-1 h-11 text-center text-[18px] tracking-widest border-[#e6e3df] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                    maxLength={6}
                    required
                  />
                  <button
                    type="submit"
                    disabled={verificationCode.length !== 6}
                    className={`px-6 py-2 rounded-[8px] font-semibold transition-all h-[50px] ${
                      verificationCode.length === 6
                        ? 'bg-[#f89823] text-[#1a1a1a] hover:bg-[#e08820] active:scale-[0.98] cursor-pointer'
                        : 'bg-[#f5c78a] text-[rgba(26,26,26,0.5)] cursor-not-allowed'
                    }`}
                  >
                    Verify
                  </button>
                </div>
              </form>
            </>
          )}

          {is2FAEnabled && showBackupCodes && (
            <>
              {/* Success Message */}
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00a63e] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#00a63e] mb-1">2FA Enabled Successfully</h3>
                    <p className="text-[13px] text-[#065f46]">
                      Your account is now protected with two-factor authentication
                    </p>
                  </div>
                </div>
              </div>

              {/* Backup Codes */}
              <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#fff7ed] flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-[#f89823]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-black">Backup Codes</h3>
                    <p className="text-[13px] text-[#6b7280]">Save these codes in a safe place</p>
                  </div>
                </div>

                <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-[6px] p-2">
                        <code className="text-[13px] font-mono text-black">{code}</code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(code)}
                          className="text-[#6b7280] hover:text-[#0066cc] ml-2"
                        >
                          {copiedCode === code ? (
                            <CheckCircle2 className="w-4 h-4 text-[#00a63e]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadBackupCodes}
                  className="w-full bg-[#f3f4f6] text-[#0b1215] font-semibold py-3 px-6 rounded-[8px] hover:bg-[#e5e7eb] transition-colors text-center"
                >
                  Download Backup Codes
                </button>
              </div>
            </>
          )}

          {!is2FAEnabled && (
            <>
              {/* How It Works */}
              <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4">
                <h3 className="text-[16px] font-semibold text-black mb-3">How It Works</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                      <span className="text-[14px] font-semibold text-[#0066cc]">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-black font-medium">Download an authenticator app</p>
                      <p className="text-[13px] text-[#6b7280]">Google Authenticator, Authy, or similar</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                      <span className="text-[14px] font-semibold text-[#0066cc]">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-black font-medium">Scan the QR code</p>
                      <p className="text-[13px] text-[#6b7280]">Or enter the code manually in your app</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                      <span className="text-[14px] font-semibold text-[#0066cc]">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-black font-medium">Enter verification code</p>
                      <p className="text-[13px] text-[#6b7280]">Complete setup and save backup codes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-[#eef4ff] border border-[#c7d7fe] rounded-[8px] p-4">
                <h3 className="text-[14px] font-semibold text-[#0066cc] mb-2">Why Enable 2FA?</h3>
                <ul className="text-[13px] text-[#0b1215] space-y-1">
                  <li>• Protects your account even if your password is compromised</li>
                  <li>• Adds an extra verification step during login</li>
                  <li>• Industry-standard security practice</li>
                  <li>• Receive backup codes for emergency access</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}