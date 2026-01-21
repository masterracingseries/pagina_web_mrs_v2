
import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, fallbackIcon, ...props }) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    console.error(`Error cargando imagen en: ${src}`);
    setError(true);
  };

  if (error || !src) {
    return (
      <div className={`bg-gray-800 flex flex-col items-center justify-center text-gray-500 p-4 border border-dashed border-gray-600 ${className}`}>
        {fallbackIcon || <ImageIcon size={24} />}
        <span className="text-[8px] uppercase font-black mt-2 text-center opacity-50">Img missing</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
};

export default SafeImage;
