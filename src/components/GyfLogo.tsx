import React from 'react';

interface GyfLogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'monochrome';
  showTagline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
  showText?: boolean;
}

export const GyfIcon: React.FC<{ size?: number | string; className?: string; color?: string; variant?: 'color' | 'white' }> = ({ 
  size = 40, 
  className = '', 
  variant = 'color'
}) => {
  const logoSrc = '/GYF_Logo.png';
  return (
    <img
      src={logoSrc}
      alt="Global Youth Foundation"
      className={`object-contain shrink-0 ${className}`}
      style={{
        height: typeof size === 'number' ? `${size}px` : size,
        width: 'auto',
      }}
      referrerPolicy="no-referrer"
    />
  );
};

export const GyfLogo: React.FC<GyfLogoProps> = ({
  className = '',
  variant = 'color',
  size = 'md',
}) => {
  // Height sizing classes for standard usage across the application
  const heightClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-18 sm:h-20',
  };

  const currentHeight = heightClasses[size] || heightClasses.md;
  const logoSrc = '/GYF_Logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Global Youth Foundation (GYF)"
        className={`${currentHeight} w-auto max-w-full object-contain transition-transform duration-200`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
