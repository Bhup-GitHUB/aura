import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'text';
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;

    if (!button || !text) return;

    const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3" });
    
    const textXTo = gsap.quickTo(text, "x", { duration: 0.2, ease: "power3" });
    const textYTo = gsap.quickTo(text, "y", { duration: 0.2, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.3);
      yTo(y * 0.3);
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const baseStyles = "relative overflow-hidden px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-colors duration-300 group";
  
  const variants = {
    primary: "bg-luxury-gold text-luxury-black hover:bg-white",
    outline: "border border-luxury-gold/30 text-luxury-gold hover:border-luxury-gold hover:text-white",
    text: "text-white hover:text-luxury-gold px-4"
  };

  return (
    <button 
      ref={buttonRef}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span ref={textRef} className="relative z-10 inline-block">
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
      )}
    </button>
  );
};