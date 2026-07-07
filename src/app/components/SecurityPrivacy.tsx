import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  ChevronLeft,
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  Bell,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface SecurityPrivacyProps {
  onBack: () => void;
}

export function SecurityPrivacy({ onBack }: SecurityPrivacyProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Security & Privacy</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Password */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Lock className="size-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Password</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-xs text-gray-500">
                  Current Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-gray-400" />
                    ) : (
                      <Eye className="size-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-xs text-gray-500">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-xs text-gray-500">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-1"
                />
              </div>
              <Button className="w-full bg-[#f89823] text-white hover:bg-[#e08820]">
                Update Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 rounded-lg p-2">
                <Smartphone className="size-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 flex-1">
                Two-Factor Authentication
              </h3>
              {twoFactorEnabled && (
                <Badge className="bg-green-100 text-green-700 border-0">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Add an extra layer of security to your account by requiring a
                  verification code in addition to your password.
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-gray-900">
                  <span>Manage 2FA Settings</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Biometric Authentication */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 rounded-lg p-2">
                <Shield className="size-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 flex-1">
                Biometric Login
              </h3>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Use fingerprint or face recognition to quickly and securely log
                  in to your account.
                </p>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <Globe className="size-4 text-[#f89823]" />
              </div>
              <h3 className="font-semibold text-gray-900">Active Sessions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      iPhone 14 Pro
                    </p>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                      Current
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    Austin, TX • Last active: Now
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Chrome on Windows
                  </p>
                  <p className="text-xs text-gray-500">
                    Dallas, TX • Last active: 2 hours ago
                  </p>
                </div>
                <button className="text-xs text-red-600 font-medium">
                  Revoke
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 rounded-lg p-2">
                <Bell className="size-4 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Privacy Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Profile Visibility
                  </p>
                  <p className="text-xs text-gray-500">
                    Allow other users to view your profile information
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Location Sharing
                  </p>
                  <p className="text-xs text-gray-500">
                    Share your location during active jobs
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Activity Status
                  </p>
                  <p className="text-xs text-gray-500">
                    Show when you're online and available
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-100 rounded-lg p-2">
                <Key className="size-4 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Data & Privacy</h3>
            </div>
            <div className="space-y-2">
              <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-700">Download My Data</span>
                <ChevronRight className="size-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-700">Delete My Account</span>
                <ChevronRight className="size-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}