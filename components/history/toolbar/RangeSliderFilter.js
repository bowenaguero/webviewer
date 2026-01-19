'use client';

import { memo, useCallback } from 'react';
import { Slider } from '../../ui/slider';

const RangeSliderFilter = memo(function RangeSliderFilter({ label, bounds, value, isActive, onChange }) {
  const handleInputChange = useCallback(
    (index, inputValue) => {
      const num = parseInt(inputValue, 10);
      if (isNaN(num)) return;
      const clamped = Math.max(bounds.min, Math.min(bounds.max, num));
      const newValue = [...value];
      newValue[index] = clamped;
      if (index === 0 && clamped > value[1]) newValue[1] = clamped;
      if (index === 1 && clamped < value[0]) newValue[0] = clamped;
      onChange(newValue);
    },
    [bounds.min, bounds.max, value, onChange],
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className={isActive ? 'text-gray-200' : 'text-gray-400'}>
          {label}
        </span>
        <div className="flex items-center gap-1 tabular-nums">
          <input
            type="number"
            value={value[0]}
            min={bounds.min}
            max={bounds.max}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="w-12 px-1 py-0.5 text-right text-gray-300 bg-gray-800 border border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-600">–</span>
          <input
            type="number"
            value={value[1]}
            min={bounds.min}
            max={bounds.max}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="w-12 px-1 py-0.5 text-right text-gray-300 bg-gray-800 border border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <Slider
        value={value}
        min={bounds.min}
        max={bounds.max}
        step={1}
        onValueChange={onChange}
      />
    </div>
  );
});

export default RangeSliderFilter;
