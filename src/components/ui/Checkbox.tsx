import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors duration-200 peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/50"></div>
          <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
        </div>
        {label && <span className="text-sm text-black">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
