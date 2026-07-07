import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react';
import Header from './Header';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface ResetPasswordProps {
  onNavigate: (screen: Screen) => void;
}

export default function ResetPassword({ onNavigate }: ResetPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const allRequirementsMet = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequirementsMet && currentPassword) {
      // Handle password reset logic
      console.log('Password reset submitted');
      // Navigate back to security page
      onNavigate('security');
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-[#00a63e]" />
      ) : (
        <XCircle className="w-4 h-4 text-[#d45153]" />
      )}
      <span className={`text-[13px] ${met ? 'text-[#00a63e]' : 'text-[#6b7280]'}`}>{text}</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Reset Password" onBack={() => onNavigate('security')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#6b7280]">Create a new password for your account</p>
          </div>

          {/* Password Reset Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Password Fields Card */}
            <div className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-4">
              {/* Current Password */}
              <div>
                <Label htmlFor="current-password" className="text-[14px] font-semibold text-black mb-2 block">
                  Current Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-[#6b7280]" />
                  </div>
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pl-10 pr-10 h-11 border-[#e6e3df] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0066cc]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="new-password" className="text-[14px] font-semibold text-black mb-2 block">
                  New Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-[#6b7280]" />
                  </div>
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 pr-10 h-11 border-[#e6e3df] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0066cc]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirm-password" className="text-[14px] font-semibold text-black mb-2 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-[#6b7280]" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10 h-11 border-[#e6e3df] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0066cc]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-4">
              <h3 className="text-[14px] font-semibold text-black mb-3">Password Requirements</h3>
              <div className="flex flex-col gap-2">
                <RequirementItem met={hasMinLength} text="At least 8 characters" />
                <RequirementItem met={hasUpperCase} text="One uppercase letter" />
                <RequirementItem met={hasLowerCase} text="One lowercase letter" />
                <RequirementItem met={hasNumber} text="One number" />
                <RequirementItem met={hasSpecialChar} text="One special character (!@#$%^&*)" />
                {confirmPassword && (
                  <RequirementItem met={passwordsMatch} text="Passwords match" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!allRequirementsMet || !currentPassword}
              className={`w-full py-3 px-6 rounded-[8px] font-semibold transition-all text-center h-[50px] ${
                allRequirementsMet && currentPassword
                  ? 'bg-[#f89823] text-[#1a1a1a] hover:bg-[#e08820] active:scale-[0.98] cursor-pointer'
                  : 'bg-[#f5c78a] text-[rgba(26,26,26,0.5)] cursor-not-allowed'
              }`}
            >
              Update Password
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-[14px] text-[#0066cc] font-medium hover:underline"
                onClick={() => {
                  // Navigate to forgot password flow
                }}
              >
                Forgot your current password?
              </button>
            </div>
          </form>

          {/* Security Note */}
          <div className="bg-[#eef4ff] border border-[#c7d7fe] rounded-[8px] p-4">
            <h3 className="text-[14px] font-semibold text-[#0066cc] mb-2">Security Tips</h3>
            <ul className="text-[13px] text-[#0b1215] space-y-1">
              <li>• Use a unique password that you don't use elsewhere</li>
              <li>• Avoid using personal information in your password</li>
              <li>• Consider using a password manager</li>
              <li>• Update your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}