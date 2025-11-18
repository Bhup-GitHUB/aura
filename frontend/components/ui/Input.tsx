import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="relative group mb-6">
      <input
        {...props}
        className={`peer w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-luxury-gold transition-colors duration-300 ${className}`}
        placeholder={label}
      />
      <label className="absolute left-0 -top-3.5 text-xs text-luxury-gold font-bold tracking-widest uppercase transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-luxury-gold peer-focus:font-bold peer-focus:tracking-widest pointer-events-none">
        {label}
      </label>
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-500 peer-focus:w-full"></div>
    </div>
  );
};