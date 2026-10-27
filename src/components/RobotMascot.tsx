import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface RobotMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
  mood?: 'happy' | 'thinking' | 'waving' | 'neutral';
}

/**
 * MediPal — An original, friendly healthcare robot mascot.
 * Designed to be gender-neutral, warm, and professional.
 * NOT a copy of any existing character.
 */
const RobotMascot: React.FC<RobotMascotProps> = ({
  size = 80,
  className = '',
  animate = true,
  mood = 'happy',
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const bodyFill = isDark ? '#f1f5f9' : '#ffffff';
  const bodyStroke = isDark ? '#475569' : '#cbd5e1';
  const accentColor = '#14b8a6';
  const highlightColor = '#0ea5e9';
  const eyeColor = isDark ? '#0f172a' : '#1e293b';
  const cheekColor = isDark ? 'rgba(20, 184, 166, 0.2)' : 'rgba(20, 184, 166, 0.15)';

  return (
    <div className={`robot-container ${animate ? 'animate-float' : ''} ${className}`}>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MediPal healthcare robot mascot"
      >
        {/* Antenna */}
        <line x1="50" y1="8" x2="50" y2="20" stroke={bodyStroke} strokeWidth="2" strokeLinecap="round" />
        <circle
          cx="50"
          cy="6"
          r="4"
          fill={accentColor}
          className={animate ? 'animate-glow' : ''}
        />
        <circle cx="50" cy="6" r="2" fill={highlightColor} opacity="0.8" />

        {/* Head — rounded rectangle with soft corners */}
        <rect
          x="25"
          y="20"
          width="50"
          height="38"
          rx="18"
          ry="18"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="1.5"
        />

        {/* Face visor — subtle curved area */}
        <rect
          x="32"
          y="28"
          width="36"
          height="22"
          rx="11"
          ry="11"
          fill={isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.8)'}
          stroke={bodyStroke}
          strokeWidth="0.5"
        />

        {/* Eyes — friendly LED dots */}
        <g className={animate ? 'animate-blink' : ''} style={{ transformOrigin: '50px 39px' }}>
          {/* Left eye */}
          <circle cx="41" cy="39" r="3.5" fill={eyeColor} />
          <circle cx="42" cy="37.5" r="1" fill="white" opacity="0.8" />

          {/* Right eye */}
          <circle cx="59" cy="39" r="3.5" fill={eyeColor} />
          <circle cx="60" cy="37.5" r="1" fill="white" opacity="0.8" />
        </g>

        {/* Mouth — friendly smile */}
        {mood === 'happy' && (
          <path
            d="M 44 46 Q 50 50 56 46"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === 'thinking' && (
          <circle cx="55" cy="47" r="2" stroke={accentColor} strokeWidth="1.5" fill="none" />
        )}
        {mood === 'waving' && (
          <path
            d="M 44 46 Q 50 51 56 46"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === 'neutral' && (
          <line x1="45" y1="47" x2="55" y2="47" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Cheeks — subtle blush circles */}
        <circle cx="35" cy="44" r="3" fill={cheekColor} />
        <circle cx="65" cy="44" r="3" fill={cheekColor} />

        {/* Neck connector */}
        <rect x="44" y="58" width="12" height="6" rx="3" fill={bodyFill} stroke={bodyStroke} strokeWidth="1" />

        {/* Body — rounded rectangle, wider than head */}
        <rect
          x="22"
          y="64"
          width="56"
          height="44"
          rx="20"
          ry="20"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="1.5"
        />

        {/* Chest medical cross */}
        <g transform="translate(50, 82)">
          <rect x="-6" y="-2" width="12" height="4" rx="1" fill={accentColor} />
          <rect x="-2" y="-6" width="4" height="12" rx="1" fill={accentColor} />
        </g>

        {/* Chest indicator light */}
        <circle cx="50" cy="96" r="2.5" fill={highlightColor} opacity="0.6" className={animate ? 'animate-pulse-soft' : ''} />

        {/* Left arm */}
        <g className={mood === 'waving' && animate ? 'animate-wave' : ''} style={{ transformOrigin: '22px 74px' }}>
          <rect x="10" y="70" width="12" height="24" rx="6" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
          <circle cx="16" cy="96" r="5" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        </g>

        {/* Right arm */}
        <rect x="78" y="70" width="12" height="24" rx="6" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <circle cx="84" cy="96" r="5" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />

        {/* Feet/base */}
        <ellipse cx="38" cy="112" rx="10" ry="5" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <ellipse cx="62" cy="112" rx="10" ry="5" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />

        {/* Subtle shadow under robot */}
        <ellipse cx="50" cy="120" rx="25" ry="3" fill={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(20, 184, 166, 0.08)'} />
      </svg>
    </div>
  );
};

export default RobotMascot;
