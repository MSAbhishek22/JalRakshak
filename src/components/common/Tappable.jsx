import React from 'react';

/**
 * Tappable Component
 * Provides tactile micro-interactions:
 * - active:scale-95 smooth scale-down
 * - Light haptic vibration (10ms) on touch devices
 * - Ripple/glow feedback
 * - Accessible keyboard trigger (Enter/Space)
 */
export default function Tappable({
  children,
  onClick,
  className = '',
  style = {},
  disabled = false,
  as: Component = 'button',
  type = 'button',
  ariaLabel,
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (err) {
        // Ignore haptic errors on unsupported platforms
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (Component !== 'button' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    transition-all duration-150 ease-out
    active:scale-95 select-none
    disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
  `.trim();

  const elementProps = {
    className: `${baseClasses} ${className}`.trim(),
    style,
    onClick: handleClick,
    disabled: Component === 'button' ? disabled : undefined,
    'aria-disabled': disabled ? 'true' : undefined,
    'aria-label': ariaLabel,
    onKeyDown: Component !== 'button' ? handleKeyDown : undefined,
    tabIndex: Component !== 'button' ? (disabled ? -1 : 0) : undefined,
    role: Component !== 'button' ? 'button' : undefined,
    type: Component === 'button' ? type : undefined,
    ...props
  };

  return <Component {...elementProps}>{children}</Component>;
}
