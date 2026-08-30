import React from 'react';

interface GyfLogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'monochrome';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

export const GyfIcon: React.FC<{ size?: number | string; className?: string; color?: string }> = ({ 
  size = 40, 
  className = '', 
  color = '#2C3292' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Global Youth Foundation Icon"
    >
      {/* Blue Rounded Square Badge */}
      <rect width="240" height="240" rx="54" fill={color} />
      
      {/* Stylized Clasped Hands / Youth Unity Symbol */}
      <g fill="#FFFFFF">
        {/* Arm and Wrist Base */}
        <path
          d="M60 240C62 215 72 188 88 165C74 158 64 148 58 135C50 119 51 98 62 82C72 67 89 59 107 60C116 61 124 64 130 70C132 58 140 48 152 46C163 44 173 50 177 60C182 72 178 86 170 94C180 97 187 106 189 116C191 130 183 143 172 150C177 172 179 205 180 240H140C140 212 138 186 134 168C127 172 118 174 109 174C95 194 86 216 84 240H60Z"
          fill="#FFFFFF"
          opacity="0.0"
        />
        {/* Hand Clasp Silhouette */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M58 240 C58 208 72 180 87 158 C74 152 64 142 58 128 C50 110 52 88 64 72 C75 58 93 50 111 52 C120 53 128 57 135 63 C138 52 146 44 157 43 C169 42 180 49 184 61 C187 70 185 81 180 88 C189 92 195 101 197 111 C200 128 190 144 176 152 C181 178 183 210 184 240 H146 C145 214 143 190 139 174 C132 177 124 178 116 177 C100 196 90 217 88 240 H58 Z M98 84 C88 84 80 90 77 99 C74 107 75 117 80 123 C85 130 94 133 103 131 C101 124 102 116 106 109 C111 100 119 94 128 92 C124 87 117 84 109 84 C105 84 102 84 98 84 Z M136 84 C130 84 124 88 120 94 C116 100 116 108 119 114 C123 121 130 125 138 124 C146 123 153 118 155 110 C157 102 155 94 149 89 C145 86 141 84 136 84 Z M158 64 C153 64 149 67 147 72 C146 75 146 79 148 82 C152 80 157 80 162 82 C166 79 168 74 167 69 C165 66 162 64 158 64 Z"
          fill="#FFFFFF"
        />
        {/* Inner Contours of Hands Intertwined */}
        <path
          d="M86 156C72 150 63 138 60 123C56 104 64 85 80 75C94 66 112 67 124 77C120 86 119 96 122 106C112 108 103 114 98 122C90 135 91 148 96 158C92 158 89 157 86 156Z"
          fill="#FFFFFF"
        />
        <path
          d="M126 62C136 50 154 48 166 58C176 66 177 81 169 92C162 101 150 105 139 102C136 94 136 85 140 77C137 72 132 67 126 62Z"
          fill="#FFFFFF"
        />
        <path
          d="M136 108C148 108 158 116 160 128C162 142 153 154 139 157C130 159 120 154 116 146C124 140 128 131 129 121C131 117 133 112 136 108Z"
          fill="#FFFFFF"
        />
        {/* Unity Wrist Pillar */}
        <path
          d="M68 240C70 216 78 194 92 174C102 186 116 193 131 194C137 207 141 223 143 240H68Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};

export const GyfLogo: React.FC<GyfLogoProps> = ({
  className = '',
  variant = 'color',
  showTagline = true,
  size = 'md',
  iconOnly = false,
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 32,
    md: 42,
    lg: 52,
    xl: 64,
  };

  const currentIconSize = iconSizes[size];

  const brandColor = variant === 'white' ? '#FFFFFF' : '#2C3292';
  const textColor = variant === 'white' ? 'text-white' : variant === 'monochrome' ? 'text-slate-900' : 'text-[#2C3292]';
  const taglineColor = variant === 'white' ? 'text-blue-100' : 'text-[#2C3292]';

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <GyfIcon size={currentIconSize} color={variant === 'white' ? '#FFFFFF' : '#2C3292'} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Badge Icon */}
      <GyfIcon size={currentIconSize} color={variant === 'white' ? '#FFFFFF' : '#2C3292'} />

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight ${textColor} ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'
        }`} style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
          <span className="block font-black tracking-tight leading-tight">Global Youth</span>
          <span className="block font-black tracking-tight -mt-0.5 leading-tight">Foundation</span>
        </div>

        {showTagline && (
          <div className={`text-[10px] sm:text-[11px] font-semibold tracking-wide mt-0.5 ${taglineColor} opacity-95 whitespace-nowrap`}>
            Empowering Youth • Inspiring Change
          </div>
        )}
      </div>
    </div>
  );
};
