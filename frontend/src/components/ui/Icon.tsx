interface IconProps {
  src: string;
  className?: string;
  alt?: string;
}

export function Icon({ src, className = '', alt = '' }: IconProps) {
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      style={{ display: 'inline-block' }}
    />
  );
}