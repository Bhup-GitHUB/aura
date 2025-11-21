import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="relative group mb-6">
      <select
        {...props}
        className={`peer w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors duration-300 appearance-none ${className}`}
      >
        <option value="" disabled className="bg-luxury-black text-white">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-luxury-black text-white">
            {option.label}
          </option>
        ))}
      </select>
      <label className="absolute left-0 -top-3.5 text-xs text-luxury-gold font-bold tracking-widest uppercase transition-all pointer-events-none">
        {label}
      </label>
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-500 peer-focus:w-full"></div>
      <div className="absolute right-0 bottom-3 pointer-events-none">
        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

