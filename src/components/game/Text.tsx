import React from 'react';
import { Text as DreiText } from '@react-three/drei';
import { Color } from 'three';

interface TextProps {
  children: React.ReactNode;
  position: [number, number, number];
  fontSize?: number;
  color?: string | Color;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  fontWeight?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  position,
  fontSize = 1,
  color = 'white',
  anchorX = 'center',
  anchorY = 'middle',
  fontWeight = 'normal',
}) => {
  return (
    <DreiText
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      fontWeight={fontWeight}
    >
      {children}
    </DreiText>
  );
};

export default Text;
