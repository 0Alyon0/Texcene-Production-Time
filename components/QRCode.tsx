
import React, { useRef, useEffect } from 'react';

interface QRCodeProps {
  text: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && window.QRCode) {
      window.QRCode.toCanvas(canvasRef.current, text, { width: 160 }, (error: Error) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return <canvas ref={canvasRef} />;
};
