import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Plus, Trash2, AlertTriangle, MapPin } from 'lucide-react';
import { RouteSurveyData, RouteObservation } from '../RouteSurveyForm';

interface RouteSurveyObservationsProps {
  data: RouteSurveyData;
  updateData: (updates: Partial<RouteSurveyData>) => void;
  readOnly?: boolean;
}

const OBSERVATION_CATEGORIES = [
  { value: 'height', label: 'Height Clearance', icon: '↕️' },
  { value: 'width', label: 'Width Constraints', icon: '↔️' },
  { value: 'turning', label: 'Turning Radius / Length', icon: '↩️' },
  { value: 'parking', label: 'Parking / Pull-off Areas', icon: '🅿️' },
  { value: 'restrictions', label: 'Time-based Restrictions', icon: '⏰' }
];

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'minor', label: 'Minor', color: 'bg-blue-100 text-blue-700 border-blue-200' }
];

export default function RouteSurveyObservations({ 
  data, 
  updateData, 
  readOnly 
}: RouteSurveyObservationsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newObservation, setNewObservation] = useState<Partial<RouteObservation>>({
    category: 'height',
    location: '',
    measurement: '',
    description: '',
    severity: 'moderate'
  });

  const handleAddObservation = () => {
    if (!newObservation.location || !newObservation.description) {
      alert('Please fill in location and description');
      return;
    }

    const observation: RouteObservation = {
      id: Date.now().toString(),
      category: newObservation.category as RouteObservation['category'],
      location: newObservation.location,
      measurement: newObservation.measurement,
      description: newObservation.description,
      severity: newObservation.severity as RouteObservation['severity']
    };

    updateData({
      observations: [...data.observations, observation]
    });

    // Reset form
    setNewObservation({
      category: 'height',
      location: '',
      measurement: '',
      description: '',
      severity: 'moderate'
    });
    setIsAdding(false);
  };

  const handleDeleteObservation = (id: string) => {
    updateData({
      observations: data.observations.filter(obs => obs.id !== id)
    });
  };

  const getCategoryLabel = (category: string) => {
    return OBSERVATION_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  const getSeverityColor = (severity?: string) => {
    return SEVERITY_LEVELS.find(s => s.value === severity)?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <h3 className="font-semibold text-blue-900 mb-1.5 text-sm">Route Observations</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Document all notable obstacles, clearances, and route conditions. Include measurements where applicable.
        </p>
      </div>

      {/* Existing Observations - Grouped by Category */}
      {data.observations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-base text-gray-900">Recorded Observations</h3>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#155DFC] text-white">
              {data.observations.length}
            </span>
          </div>
          
          {data.observations.map((observation) => (
            <div key={observation.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#155DFC] text-white">
                      {getCategoryLabel(observation.category)}
                    </span>
                    {observation.severity && (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(observation.severity)}`}>
                        {observation.severity === 'critical' ? '🔴 Critical' : observation.severity === 'moderate' ? '🟡 Moderate' : '🟢 Minor'}
                      </span>
                    )}
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => handleDeleteObservation(observation.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors active:scale-95 flex-shrink-0"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5 font-medium">Location</p>
                      <p className="font-semibold text-gray-900 text-sm">{observation.location}</p>
                    </div>
                  </div>

                  {observation.measurement && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1 font-medium">Measurement</p>
                      <p className="font-bold text-blue-900 text-base">{observation.measurement}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Description</p>
                    <p className="text-sm text-gray-900 leading-relaxed">{observation.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Observation */}
      {!readOnly && (
        <>
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-5 px-4 hover:border-[#155DFC] hover:bg-blue-50/50 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 text-gray-600 hover:text-[#155DFC] font-semibold"
            >
              <Plus className="size-6" />
              Add Observation
            </button>
          ) : (
            <div className="bg-white border-2 border-[#155DFC] rounded-xl shadow-lg">
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                <h3 className="font-semibold text-base text-gray-900">New Observation</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-900 mb-2 block">Category *</Label>
                    <Select
                      value={newObservation.category}
                      onValueChange={(value) => 
                        setNewObservation({ ...newObservation, category: value as RouteObservation['category'] })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OBSERVATION_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-900 mb-2 block">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., I-40 Exit 125, Main St Bridge"
                      value={newObservation.location}
                      onChange={(e) => 
                        setNewObservation({ ...newObservation, location: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Measurement */}
                  <div>
                    <Label htmlFor="measurement" className="text-sm font-semibold text-gray-900 mb-2 block">Measurement (Optional)</Label>
                    <Input
                      id="measurement"
                      placeholder="e.g., 13'6&quot;, 14' width, 50' radius"
                      value={newObservation.measurement}
                      onChange={(e) => 
                        setNewObservation({ ...newObservation, measurement: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Severity */}
                  <div>
                    <Label htmlFor="severity" className="text-sm font-semibold text-gray-900 mb-2 block">Severity Level</Label>
                    <Select
                      value={newObservation.severity}
                      onValueChange={(value) => 
                        setNewObservation({ ...newObservation, severity: value as RouteObservation['severity'] })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-900 mb-2 block">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the observation in detail..."
                      value={newObservation.description}
                      onChange={(e) => 
                        setNewObservation({ ...newObservation, description: e.target.value })
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setNewObservation({
                          category: 'height',
                          location: '',
                          measurement: '',
                          description: '',
                          severity: 'moderate'
                        });
                      }}
                      className="flex-1 h-12"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddObservation}
                      className="flex-1 h-12 bg-[#155DFC] hover:bg-blue-700 text-white"
                    >
                      <Plus className="size-4.5 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {data.observations.length === 0 && !isAdding && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertTriangle className="size-12 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-amber-900 mb-1.5 text-base">No Observations Added</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Add route observations to document clearances, obstacles, and conditions.
          </p>
        </div>
      )}
    </div>
  );
}