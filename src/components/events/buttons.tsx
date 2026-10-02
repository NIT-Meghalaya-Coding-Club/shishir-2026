import React, { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: string; // The text to animate
  icon?: ReactNode; // Optional icon
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  children,
  icon,
  href,
  onClick,
  className = "",
  target,
  rel,
  type = "button"
}: AnimatedButtonProps) {
  const letters = children.split("");

  const content = (
    <div className="relative flex items-center justify-center">
      {/* Invisible placeholder for size */}
      <span className="invisible flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span className="flex">
          {letters.map((char, i) => (
            <span key={i}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>
      </span>

      {/* Mother 1 */}
      <span className="flex overflow-hidden absolute gap-2">
        {icon && (
          <span
            style={{ transition: 'transform 0.1s' }}
            className="translate-y-0 group-hover:translate-y-[1.2em] flex items-center"
          >
            {icon}
          </span>
        )}
        <span className="flex">
          {letters.map((char, i) => {
            const time = icon ? 0.15 + i * 0.035 : 0.1 + i * 0.035;
            return (
              <span
                key={i}
                style={{ transition: `transform ${time}s` }}
                className="translate-y-0 group-hover:translate-y-[1.2em] flex items-center"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      </span>

      {/* Mother 2 */}
      <span className="flex overflow-hidden absolute gap-2">
        {icon && (
          <span
            style={{ transition: 'transform 0.1s' }}
            className="-translate-y-[1.2em] group-hover:translate-y-0 flex items-center"
          >
            {icon}
          </span>
        )}
        <span className="flex">
          {letters.map((char, i) => {
            const time = icon ? 0.15 + i * 0.035 : 0.1 + i * 0.035;
            return (
              <span
                key={i}
                style={{ transition: `transform ${time}s` }}
                className="-translate-y-[1.2em] group-hover:translate-y-0 flex items-center"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      </span>
    </div>
  );

  const baseClasses = `group flex justify-center items-center cursor-pointer rounded-full ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
