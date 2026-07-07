import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, User, Car, FileText, MapPin, Ruler, Weight } from 'lucide-react';
import { RouteSurveyData } from '../RouteSurveyForm';

interface RouteSurveyGeneralProps {
  data: RouteSurveyData;
  readOnly?: boolean;
}

export default function RouteSurveyGeneral({ data, readOnly }: RouteSurveyGeneralProps) {
  return (
    <div className="space-y-3">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <p className="text-sm text-blue-900 leading-relaxed">
          This information has been auto-filled from the job assignment. Please review for accuracy.
        </p>
      </div>

      {/* Survey Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold text-base mb-3.5">Survey Details</h3>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Calendar className="size-4.5 text-gray-400" />
                <span>Survey Date</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {new Date(data.surveyDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <User className="size-4.5 text-gray-400" />
                <span>PC Operator</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{data.pcOperatorName}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Car className="size-4.5 text-gray-400" />
                <span>Vehicle ID</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{data.vehicleId}</span>
            </div>
            
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <FileText className="size-4.5 text-gray-400" />
                <span>Survey Type</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                {data.surveyType}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <FileText className="size-4.5 text-gray-400" />
                <span>Job Reference</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{data.jobReference}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Ruler className="size-4.5 text-gray-400" />
                <span>Measurement Units</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {data.units === 'imperial' ? 'Imperial (ft, lbs)' : 'Metric (m, kg)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold text-base mb-3.5 flex items-center gap-2">
            <MapPin className="size-4.5 text-gray-600" />
            Route Information
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Origin</p>
              <p className="font-semibold text-gray-900">{data.route.origin}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 py-1">
              <div className="flex-1 border-t border-dashed border-gray-300"></div>
              <span className="text-sm font-semibold text-gray-600">{data.route.distance}</span>
              <div className="flex-1 border-t border-dashed border-gray-300"></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Destination</p>
              <p className="font-semibold text-gray-900">{data.route.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Load Dimensions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold text-base mb-3.5 flex items-center gap-2">
            <Ruler className="size-4.5 text-gray-600" />
            Load Dimensions
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
             <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Freight Description</p>
             <p className="text-sm font-semibold text-gray-900">{data.freightDescription}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3.5 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Length</p>
              <p className="font-bold text-gray-900 text-lg">{data.loadDimensions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3.5 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Width</p>
              <p className="font-bold text-gray-900 text-lg">{data.loadDimensions.width}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3.5 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Height</p>
              <p className="font-bold text-gray-900 text-lg">{data.loadDimensions.height}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3.5 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1.5">
                <Weight className="size-3.5" />
                Weight
              </p>
              <p className="font-bold text-gray-900 text-lg">{data.loadDimensions.weight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jurisdictions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold text-base mb-3.5">Jurisdictions</h3>
          <div className="flex flex-wrap gap-2">
            {data.jurisdictions.map((jurisdiction, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {jurisdiction}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}