import React from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo-dark.png';
import logoIcon from '../../assets/logo-icon.png';

/**
 * LearnEase Pro - Brand Logo
 * Displays the official LearnEase PRO logo with icon, graduation cap, book, play button,
 * typography, PRO badge, and "Learn • Practice • Grow" tagline.
 * Features automated dark-mode support with crisp contrasting text.
 */
export const LogoIcon = ({ size = 38, className = '' }) => (
  <img
    src={logoIcon}
    alt="LearnEase Pro Icon"
    style={{ height: size, width: 'auto' }}
    className={`object-contain ${className}`}
    draggable={false}
  />
);

const Logo = ({
  size = 'md',
  variant = 'auto', // 'auto' | 'light' | 'dark'
  to = '/',
  clickable = true,
  className = '',
}) => {
  // Height presets for different placements (Navbar, Footer, Auth, Dashboard)
  const heightMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11 lg:h-12',
    lg: 'h-12 sm:h-14 lg:h-[56px]',
    xl: 'h-16 sm:h-20',
  };

  const hClass = heightMap[size] || heightMap.md;

  const content = (
    <div className={`inline-flex items-center select-none transition-transform duration-200 group-hover:scale-[1.02] ${className}`}>
      {/* Light Mode Logo (Visible in light mode or when forced light) */}
      <img
        src={variant === 'dark' ? logoDark : logoLight}
        alt="LearnEase PRO - Learn • Practice • Grow"
        className={`${hClass} w-auto object-contain ${
          variant === 'auto' ? 'dark:hidden' : variant === 'dark' ? 'hidden' : 'block'
        }`}
        draggable={false}
      />

      {/* Dark Mode Logo (Visible in dark mode when auto) */}
      {variant === 'auto' && (
        <img
          src={logoDark}
          alt="LearnEase PRO - Learn • Practice • Grow"
          className={`${hClass} w-auto object-contain hidden dark:block`}
          draggable={false}
        />
      )}
    </div>
  );

  if (!clickable) {
    return <div className="group cursor-default inline-block">{content}</div>;
  }

  return (
    <Link to={to} className="inline-block group focus:outline-hidden cursor-pointer">
      {content}
    </Link>
  );
};

export default Logo;
