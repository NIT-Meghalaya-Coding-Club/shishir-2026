import type { SVGProps } from 'react';

type BlossomProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: number | string;
};

export default function Blossom({ className = '', size, style, ...props }: BlossomProps) {
  const sizeStyle =
    size === undefined ? style : { ...style, width: size, height: size };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={sizeStyle}
      {...props}
      aria-hidden="true"
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.2"
          rx="3.6"
          ry="5"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill="#E0FBFC" />
      <circle cx="12" cy="12" r="0.9" fill="#EE6C4D" />
    </svg>
  );
}
