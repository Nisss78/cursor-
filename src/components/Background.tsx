import React from 'react';

interface BackgroundProps {
  imageUrl: string | null;
}

export const Background: React.FC<BackgroundProps> = ({ imageUrl }) => {
  const defaultBackground = 'avatar-chat-hub-78/public/背景.png';


  return (
    <div className="absolute inset-0 z-0">
      <img
      src={imageUrl || defaultBackground}        alt="背景"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
