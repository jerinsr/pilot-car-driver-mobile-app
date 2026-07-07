import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckCircle2, PenTool, Calendar, User, AlertCircle } from 'lucide-react';
import { RouteSurveyData } from '../RouteSurveyForm';

interface RouteSurveySignoffProps {
  data: RouteSurveyData;
  updateData: (updates: Partial<RouteSurveyData>) => void;
  readOnly?: boolean;
}

export default function RouteSurveySignoff({ 
  data, 
  updateData, 
  readOnly 
}: RouteSurveySignoffProps) {
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleCreateSignature = () => {
    // Simulate signature creation
    const signature = `${data.pcOperatorName} - Digital Signature`;
    updateData({
      signature: signature,
      signoffDate: new Date().toISOString()
    });
    setShowSignaturePad(false);
  };

  const handleClearSignature = () => {
    updateData({
      signature: undefined,
      signoffDate: undefined
    });
  };

  const isComplete = data.signature && data.certification && data.signoffDate;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <h3 className="font-semibold text-blue-900 mb-1.5 text-sm">Survey Sign-off</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Review your survey and certify that the information provided is accurate and complete. 
          Your signature confirms the route survey has been thoroughly conducted.
        </p>
      </div>

      {/* Completion Status */}
      {isComplete ? (
        <div className="bg-white border-2 border-green-500 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-green-50 p-4 flex items-center gap-3 border-b border-green-200">
            <div className="bg-green-100 rounded-full p-2.5">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 text-base">Survey Completed</h3>
              <p className="text-sm text-green-700">Ready for submission</p>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
             <div className="bg-white border-2 border-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Digital Signature</p>
                <div className="font-serif italic text-xl text-gray-800 mb-2">
                   {data.signature || data.pcOperatorName}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                   <Calendar className="size-3.5" />
                   {data.signoffDate && new Date(data.signoffDate).toLocaleDateString('en-US', {
                     month: 'short',
                     day: 'numeric',
                     year: 'numeric',
                     hour: '2-digit',
                     minute: '2-digit'
                   })}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* Survey Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4">
              <h3 className="font-semibold mb-3 text-base">Survey Summary</h3>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Route Observations</span>
                  <span className="font-bold text-gray-900">{data.observations.length}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Compliance Checks</span>
                  <span className="font-bold text-gray-900">
                    {Object.values(data.compliance).filter(Boolean).length} / 4
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Layover Points</span>
                  <span className="font-bold text-gray-900">{data.layoverPoints.length}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Backup Routes</span>
                  <span className="font-bold text-gray-900">{data.backupRoutes.length}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Surveyor Notes</span>
                  <span className="font-bold text-gray-900">{data.surveyorNotes.length} chars</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-600">Attachments</span>
                  <span className="font-bold text-gray-900">{data.attachments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certification */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4">
              <div className={`rounded-xl p-4 border-2 transition-all ${
                data.certification 
                  ? 'bg-blue-50 border-[#155DFC]' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="certification"
                    checked={data.certification || false}
                    onCheckedChange={(checked) => 
                      updateData({ certification: checked === true })
                    }
                    disabled={readOnly}
                    className="mt-1 size-5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="certification" className="cursor-pointer font-semibold text-gray-900 text-sm block mb-2">
                      I certify that this route survey is accurate and complete
                    </Label>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>I have personally surveyed the route described</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>All observations and measurements are accurate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>All compliance requirements have been assessed</span>
                      </li>
                    </ul>
                  </div>
                  {data.certification && (
                    <CheckCircle2 className="size-5 text-[#155DFC] flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4">
              <h3 className="font-semibold mb-4 text-base">Digital Signature</h3>

              {!data.signature ? (
                <>
                  {!showSignaturePad ? (
                    <button
                      onClick={() => setShowSignaturePad(true)}
                      disabled={!data.certification || readOnly}
                      className="w-full bg-[#155DFC] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 px-4 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <PenTool className="size-5" />
                      Sign Survey
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                        <PenTool className="size-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">
                          Your digital signature
                        </p>
                        <div className="bg-white rounded-lg p-4 font-serif italic text-xl text-gray-700 border border-gray-200">
                          {data.pcOperatorName}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowSignaturePad(false)}
                          className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl py-3 px-4 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateSignature}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 px-4 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 className="size-5" />
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="font-semibold text-green-900 text-sm">Signature Complete</span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="font-serif italic text-xl text-gray-700 mb-2">
                        {data.signature}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
                        <Calendar className="size-3.5" />
                        <span>
                          {data.signoffDate && new Date(data.signoffDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!readOnly && (
                    <button
                      onClick={handleClearSignature}
                      className="w-full bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 font-semibold rounded-xl py-3 px-4 transition-all active:scale-95 text-sm"
                    >
                      Clear Signature
                    </button>
                  )}
                </div>
              )}

              {!data.certification && !data.signature && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mt-3">
                  <div className="flex items-center gap-2.5 text-sm text-amber-900">
                    <AlertCircle className="size-4.5 flex-shrink-0" />
                    <span className="font-medium">Certification required before signing</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Final Reminder */}
          {data.signature && data.certification && (
            <div className="bg-green-50 border-2 border-green-500 rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1 text-sm">Ready to Submit</h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Your survey is complete. Click "Submit Survey" below to finalize.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}