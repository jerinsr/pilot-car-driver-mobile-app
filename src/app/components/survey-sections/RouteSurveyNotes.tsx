import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { FileText, AlertCircle } from 'lucide-react';
import { RouteSurveyData } from '../RouteSurveyForm';

interface RouteSurveyNotesProps {
  data: RouteSurveyData;
  updateData: (updates: Partial<RouteSurveyData>) => void;
  readOnly?: boolean;
}

export default function RouteSurveyNotes({ 
  data, 
  updateData, 
  readOnly 
}: RouteSurveyNotesProps) {
  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <h3 className="font-semibold text-blue-900 mb-1.5 text-sm flex items-center gap-2">
          <FileText className="size-4" />
          PC Surveyor Notes
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Provide detailed notes about the route survey. Include recommendations, safety concerns, 
          timing suggestions, or any other information that would be helpful for the carrier.
        </p>
      </div>

      {/* Notes Editor */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <Label htmlFor="surveyor-notes" className="text-base font-semibold mb-3 block">
            Survey Notes *
          </Label>
          
          {readOnly ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[200px]">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {data.surveyorNotes || 'No notes provided'}
              </p>
            </div>
          ) : (
            <Textarea
              id="surveyor-notes"
              value={data.surveyorNotes}
              onChange={(e) => updateData({ surveyorNotes: e.target.value })}
              placeholder="Enter your detailed survey notes here...&#10;&#10;Topics to cover:&#10;• Overall route assessment&#10;• Best time of day for travel&#10;• Weather considerations&#10;• Traffic patterns&#10;• Specific route instructions&#10;• Communication protocols&#10;• Emergency contacts&#10;• Any special concerns or recommendations"
              rows={12}
              className="resize-none text-sm"
            />
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>
                {data.surveyorNotes.length} characters
              </span>
            </div>
            {!readOnly && data.surveyorNotes.length < 100 && (
              <span className="text-xs text-amber-600 font-medium">
                Minimum 100 characters recommended
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Character Count Warning */}
      {!readOnly && data.surveyorNotes.length < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1 text-sm">More Detail Recommended</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                Detailed notes help ensure a safe and successful trip. Consider adding more information 
                about route conditions, timing, and recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}