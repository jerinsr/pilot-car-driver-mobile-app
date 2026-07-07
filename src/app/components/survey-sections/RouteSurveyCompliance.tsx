import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Trash2, CheckCircle2, XCircle, MapPin, AlertCircle } from 'lucide-react';
import { RouteSurveyData } from '../RouteSurveyForm';

interface RouteSurveyComplianceProps {
  data: RouteSurveyData;
  updateData: (updates: Partial<RouteSurveyData>) => void;
  readOnly?: boolean;
}

export default function RouteSurveyCompliance({ 
  data, 
  updateData, 
  readOnly 
}: RouteSurveyComplianceProps) {
  const [isAddingLayover, setIsAddingLayover] = useState(false);
  const [isAddingBackup, setIsAddingBackup] = useState(false);
  const [newLayover, setNewLayover] = useState({ location: '', facilities: '' });
  const [newBackup, setNewBackup] = useState({ description: '', reason: '' });

  const handleComplianceChange = (field: keyof RouteSurveyData['compliance'], value: boolean) => {
    updateData({
      compliance: {
        ...data.compliance,
        [field]: value
      }
    });
  };

  const handleAddLayover = () => {
    if (!newLayover.location) {
      alert('Please enter a layover location');
      return;
    }

    updateData({
      layoverPoints: [
        ...data.layoverPoints,
        {
          id: Date.now().toString(),
          location: newLayover.location,
          facilities: newLayover.facilities
        }
      ]
    });

    setNewLayover({ location: '', facilities: '' });
    setIsAddingLayover(false);
  };

  const handleDeleteLayover = (id: string) => {
    updateData({
      layoverPoints: data.layoverPoints.filter(point => point.id !== id)
    });
  };

  const handleAddBackup = () => {
    if (!newBackup.description) {
      alert('Please enter a backup route description');
      return;
    }

    updateData({
      backupRoutes: [
        ...data.backupRoutes,
        {
          id: Date.now().toString(),
          description: newBackup.description,
          reason: newBackup.reason
        }
      ]
    });

    setNewBackup({ description: '', reason: '' });
    setIsAddingBackup(false);
  };

  const handleDeleteBackup = (id: string) => {
    updateData({
      backupRoutes: data.backupRoutes.filter(route => route.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <h3 className="font-semibold text-blue-900 mb-1.5 text-sm">Compliance & Recommendations</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Check all applicable compliance requirements and provide layover points and backup routes as needed.
        </p>
      </div>

      {/* Compliance Checks - Simplified with visual feedback */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold text-base mb-4">Compliance Requirements</h3>
          
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              data.compliance.permitRequired 
                ? 'border-[#155DFC] bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <Checkbox
                id="permit"
                checked={data.compliance.permitRequired}
                onCheckedChange={(checked) => 
                  handleComplianceChange('permitRequired', checked === true)
                }
                disabled={readOnly}
                className="size-5"
              />
              <div className="flex-1">
                <Label htmlFor="permit" className="font-semibold cursor-pointer text-gray-900 text-sm">
                  Permit Required
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Special permits needed for this route and load
                </p>
              </div>
              {data.compliance.permitRequired && (
                <CheckCircle2 className="size-5 text-[#155DFC] flex-shrink-0" />
              )}
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              data.compliance.policeEscortRequired 
                ? 'border-[#155DFC] bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <Checkbox
                id="police"
                checked={data.compliance.policeEscortRequired}
                onCheckedChange={(checked) => 
                  handleComplianceChange('policeEscortRequired', checked === true)
                }
                disabled={readOnly}
                className="size-5"
              />
              <div className="flex-1">
                <Label htmlFor="police" className="font-semibold cursor-pointer text-gray-900 text-sm">
                  Police Escort Required
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Police escort recommended for safety or regulation compliance
                </p>
              </div>
              {data.compliance.policeEscortRequired && (
                <CheckCircle2 className="size-5 text-[#155DFC] flex-shrink-0" />
              )}
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              data.compliance.heightPoleRequired 
                ? 'border-[#155DFC] bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <Checkbox
                id="heightPole"
                checked={data.compliance.heightPoleRequired}
                onCheckedChange={(checked) => 
                  handleComplianceChange('heightPoleRequired', checked === true)
                }
                disabled={readOnly}
                className="size-5"
              />
              <div className="flex-1">
                <Label htmlFor="heightPole" className="font-semibold cursor-pointer text-gray-900 text-sm">
                  Height Pole Required
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Height pole needed to check clearances
                </p>
              </div>
              {data.compliance.heightPoleRequired && (
                <CheckCircle2 className="size-5 text-[#155DFC] flex-shrink-0" />
              )}
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              data.compliance.steerAxlesRequired 
                ? 'border-[#155DFC] bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <Checkbox
                id="steerAxles"
                checked={data.compliance.steerAxlesRequired}
                onCheckedChange={(checked) => 
                  handleComplianceChange('steerAxlesRequired', checked === true)
                }
                disabled={readOnly}
                className="size-5"
              />
              <div className="flex-1">
                <Label htmlFor="steerAxles" className="font-semibold cursor-pointer text-gray-900 text-sm">
                  Steer Axles Required
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Additional steer axles needed for tight turns
                </p>
              </div>
              {data.compliance.steerAxlesRequired && (
                <CheckCircle2 className="size-5 text-[#155DFC] flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layover Points */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Layover Points</h3>
            {data.layoverPoints.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#155DFC] text-white">
                {data.layoverPoints.length}
              </span>
            )}
          </div>

          {data.layoverPoints.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {data.layoverPoints.map((point) => (
                <div key={point.id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="size-4 text-gray-400 flex-shrink-0" />
                        <p className="font-semibold text-gray-900 text-sm">{point.location}</p>
                      </div>
                      {point.facilities && (
                        <p className="text-sm text-gray-600 ml-6 leading-relaxed">{point.facilities}</p>
                      )}
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteLayover(point.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors active:scale-95 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && (
            <>
              {!isAddingLayover ? (
                <button
                  onClick={() => setIsAddingLayover(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3.5 px-4 hover:border-[#155DFC] hover:bg-blue-50/50 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-gray-600 hover:text-[#155DFC] font-medium text-sm"
                >
                  <Plus className="size-5" />
                  Add Layover Point
                </button>
              ) : (
                <div className="space-y-3.5 p-4 bg-blue-50 rounded-xl border-2 border-[#155DFC]">
                  <div>
                    <Label htmlFor="layover-location" className="text-sm font-semibold text-gray-900 mb-2 block">Location *</Label>
                    <Input
                      id="layover-location"
                      placeholder="e.g., Truck Stop at Exit 125"
                      value={newLayover.location}
                      onChange={(e) => setNewLayover({ ...newLayover, location: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="layover-facilities" className="text-sm font-semibold text-gray-900 mb-2 block">Available Facilities</Label>
                    <Input
                      id="layover-facilities"
                      placeholder="e.g., Fuel, Parking, Restrooms"
                      value={newLayover.facilities}
                      onChange={(e) => setNewLayover({ ...newLayover, facilities: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingLayover(false);
                        setNewLayover({ location: '', facilities: '' });
                      }}
                      className="flex-1 h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddLayover}
                      className="flex-1 h-11 bg-[#155DFC] hover:bg-blue-700 text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Backup Routes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Backup Routes</h3>
            {data.backupRoutes.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#155DFC] text-white">
                {data.backupRoutes.length}
              </span>
            )}
          </div>

          {data.backupRoutes.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {data.backupRoutes.map((route) => (
                <div key={route.id} className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1.5 leading-snug text-sm">{route.description}</p>
                      {route.reason && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Reason:</span> {route.reason}
                        </p>
                      )}
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteBackup(route.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors active:scale-95 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && (
            <>
              {!isAddingBackup ? (
                <button
                  onClick={() => setIsAddingBackup(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3.5 px-4 hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-gray-600 hover:text-amber-600 font-medium text-sm"
                >
                  <Plus className="size-5" />
                  Add Backup Route
                </button>
              ) : (
                <div className="space-y-3.5 p-4 bg-amber-50 rounded-xl border-2 border-amber-400">
                  <div>
                    <Label htmlFor="backup-description" className="text-sm font-semibold text-gray-900 mb-2 block">Route Description *</Label>
                    <Textarea
                      id="backup-description"
                      placeholder="Describe the alternate route..."
                      value={newBackup.description}
                      onChange={(e) => setNewBackup({ ...newBackup, description: e.target.value })}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backup-reason" className="text-sm font-semibold text-gray-900 mb-2 block">Reason for Backup Route</Label>
                    <Input
                      id="backup-reason"
                      placeholder="e.g., Road construction, low clearance"
                      value={newBackup.reason}
                      onChange={(e) => setNewBackup({ ...newBackup, reason: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingBackup(false);
                        setNewBackup({ description: '', reason: '' });
                      }}
                      className="flex-1 h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddBackup}
                      className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Permit Approval Recommendation */}
      <div className={`rounded-xl border-2 shadow-sm transition-all ${data.permitApprovalRecommended ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="permitApproval"
              checked={data.permitApprovalRecommended}
              onCheckedChange={(checked) => 
                updateData({ permitApprovalRecommended: checked === true })
              }
              disabled={readOnly}
              className="mt-1 size-5"
            />
            <div className="flex-1">
              <Label htmlFor="permitApproval" className="font-semibold cursor-pointer flex items-center gap-2 text-base">
                {data.permitApprovalRecommended ? (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    <span className="text-green-900">Approve Permit Application</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-5 text-red-600" />
                    <span className="text-red-900">Do Not Approve Permit Application</span>
                  </>
                )}
              </Label>
              <p className={`text-sm mt-2 leading-relaxed ${data.permitApprovalRecommended ? 'text-green-800' : 'text-red-800'}`}>
                {data.permitApprovalRecommended 
                  ? 'Route is suitable for the load with noted precautions'
                  : 'Route has significant concerns that need to be addressed'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}