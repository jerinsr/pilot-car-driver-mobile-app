import { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Camera, Mic, MapPin, Upload, Trash2, File, Image, Volume2, AlertCircle } from 'lucide-react';
import { RouteSurveyData, SurveyAttachment } from '../RouteSurveyForm';

interface RouteSurveyAttachmentsProps {
  data: RouteSurveyData;
  updateData: (updates: Partial<RouteSurveyData>) => void;
  readOnly?: boolean;
}

export default function RouteSurveyAttachments({ 
  data, 
  updateData, 
  readOnly 
}: RouteSurveyAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleFileUpload = (type: 'map' | 'photo') => {
    // Simulate file upload
    const newAttachment: SurveyAttachment = {
      id: Date.now().toString(),
      type: type,
      name: type === 'map' ? `Map Screenshot ${data.attachments.filter(a => a.type === 'map').length + 1}` : `Photo ${data.attachments.filter(a => a.type === 'photo').length + 1}`,
      timestamp: new Date().toISOString()
    };

    updateData({
      attachments: [...data.attachments, newAttachment]
    });

    alert(`${type === 'map' ? 'Map screenshot' : 'Photo'} uploaded successfully!`);
  };

  const handleVoiceNote = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording start
      setTimeout(() => {
        setIsRecording(false);
        const newAttachment: SurveyAttachment = {
          id: Date.now().toString(),
          type: 'voice',
          name: `Voice Note ${data.attachments.filter(a => a.type === 'voice').length + 1}`,
          timestamp: new Date().toISOString()
        };

        updateData({
          attachments: [...data.attachments, newAttachment]
        });

        alert('Voice note recorded successfully!');
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const handleDeleteAttachment = (id: string) => {
    updateData({
      attachments: data.attachments.filter(att => att.id !== id)
    });
  };

  const getAttachmentIcon = (type: SurveyAttachment['type']) => {
    switch (type) {
      case 'map':
        return MapPin;
      case 'photo':
        return Camera;
      case 'voice':
        return Volume2;
      default:
        return File;
    }
  };

  const getAttachmentColor = (type: SurveyAttachment['type']) => {
    switch (type) {
      case 'map':
        return 'bg-blue-100 text-blue-700';
      case 'photo':
        return 'bg-green-100 text-green-700';
      case 'voice':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const mapCount = data.attachments.filter(a => a.type === 'map').length;
  const photoCount = data.attachments.filter(a => a.type === 'photo').length;
  const voiceCount = data.attachments.filter(a => a.type === 'voice').length;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <h3 className="font-semibold text-blue-900 mb-1.5 text-sm">Attachments</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Attach map screenshots, photos of obstacles or clearances, and voice notes to support your survey findings.
        </p>
      </div>

      {/* Upload Actions - Clean 3-button layout */}
      {!readOnly && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleFileUpload('map')}
            className="bg-white border-2 border-[#155DFC] rounded-xl py-6 px-3 hover:bg-blue-50 transition-all active:scale-95 flex flex-col items-center gap-2.5 shadow-sm"
          >
            <div className="bg-blue-50 rounded-full p-3">
              <MapPin className="size-6 text-[#155DFC]" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Map</span>
          </button>
          <button
            onClick={() => handleFileUpload('photo')}
            className="bg-white border-2 border-green-500 rounded-xl py-6 px-3 hover:bg-green-50 transition-all active:scale-95 flex flex-col items-center gap-2.5 shadow-sm"
          >
            <div className="bg-green-50 rounded-full p-3">
              <Camera className="size-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Photo</span>
          </button>
          <button
            onClick={handleVoiceNote}
            className={`border-2 rounded-xl py-6 px-3 transition-all active:scale-95 flex flex-col items-center gap-2.5 shadow-sm ${
              isRecording 
                ? 'bg-red-50 border-red-400' 
                : 'bg-white border-purple-500 hover:bg-purple-50'
            }`}
          >
            <div className={`rounded-full p-3 ${isRecording ? 'bg-red-100' : 'bg-purple-50'}`}>
              <Mic className={`size-6 ${isRecording ? 'text-red-600 animate-pulse' : 'text-purple-600'}`} />
            </div>
            <span className={`text-xs font-semibold ${isRecording ? 'text-red-700' : 'text-gray-900'}`}>
              {isRecording ? 'Recording...' : 'Voice'}
            </span>
          </button>
        </div>
      )}

      {/* Upload Count */}
      {data.attachments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Uploaded</span>
            <span className="text-2xl font-bold text-[#155DFC]">{data.attachments.length}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-blue-600" />
              <span>{mapCount} Maps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="size-3.5 text-green-600" />
              <span>{photoCount} Photos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Volume2 className="size-3.5 text-purple-600" />
              <span>{voiceCount} Voice</span>
            </div>
          </div>
        </div>
      )}

      {/* Attachments List */}
      {data.attachments.length > 0 ? (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-900 px-1">Uploaded Files</h3>
          {data.attachments.map((attachment) => {
            const Icon = getAttachmentIcon(attachment.type);
            return (
              <div
                key={attachment.id}
                className="bg-white flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className={`p-2.5 rounded-xl ${getAttachmentColor(attachment.type)}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm">{attachment.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(attachment.timestamp).toLocaleString()}
                  </p>
                </div>
                {!readOnly && (
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors active:scale-95 flex-shrink-0"
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !readOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1 text-sm">No Attachments Yet</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Visual documentation enhances survey quality. Add photos, maps, or voice notes using the buttons above.
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* Hidden file input for future implementation */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          // Handle actual file upload here
          console.log('Files selected:', e.target.files);
        }}
      />
    </div>
  );
}