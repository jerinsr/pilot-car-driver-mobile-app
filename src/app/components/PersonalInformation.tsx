import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Save,
  Edit2,
} from "lucide-react";

interface PersonalInformationProps {
  onBack: () => void;
}

export function PersonalInformation({ onBack }: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Michael",
    lastName: "Thompson",
    email: "michael.thompson@pilotcar.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    company: "SafeRoute Escort Services",
    licenseNumber: "PC-TX-45678",
    dateOfBirth: "1985-06-15",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

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
          <h1 className="text-lg font-bold text-white">Personal Information</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Edit2 className="size-5 text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <User className="size-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-xs text-gray-500">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs text-gray-500">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dob" className="text-xs text-gray-500">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 rounded-lg p-2">
                <Mail className="size-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs text-gray-500">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-gray-500">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 rounded-lg p-2">
                <MapPin className="size-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Address</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-xs text-gray-500">
                  Street Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city" className="text-xs text-gray-500">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs text-gray-500">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-xs text-gray-500">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <Briefcase className="size-4 text-[#f89823]" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Professional Details
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company" className="text-xs text-gray-500">
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="licenseNumber"
                  className="text-xs text-gray-500"
                >
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <Button
              onClick={handleSave}
              className="w-full h-12 bg-[#f89823] text-white hover:bg-[#e08820]"
            >
              <Save className="size-5 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}