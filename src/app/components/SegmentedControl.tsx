import React from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
  badge?: number;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="relative h-12 bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
      {options.map((option, index) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 h-full rounded-md transition-all font-medium text-sm ${
              isActive
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm'
                : 'text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              {option.label}
              {option.badge !== undefined && option.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {option.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
