'use client';

import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  value?: string;
  className?: string;
}

export default function SignatureCanvasComponent({ 
  onSignatureChange, 
  value, 
  className = '' 
}: SignatureCanvasProps) {
  const sigPad = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (value && sigPad.current) {
      sigPad.current.fromDataURL(value);
    }
  }, [value]);

  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      onSignatureChange('');
    }
  };

  const handleEnd = () => {
    if (sigPad.current) {
      const signature = sigPad.current.toDataURL();
      onSignatureChange(signature);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Digital Signature *
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Please sign above. This signature indicates your agreement to all terms and conditions.
        </p>
      </div>
      
      <div className="border border-gray-200 rounded bg-white relative overflow-hidden" style={{ width: '100%', height: '150px' }}>
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            width: 800,
            height: 150,
            className: 'cursor-crosshair',
            style: { 
              display: 'block',
              margin: '0',
              padding: '0',
              border: 'none',
              outline: 'none',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              touchAction: 'none',
              transform: 'scale(0.5)',
              transformOrigin: 'top left'
            }
          }}
          onEnd={handleEnd}
          backgroundColor="white"
          penColor="black"
          velocityFilterWeight={0.7}
          minWidth={2}
          maxWidth={3}
          dotSize={2}
        />
      </div>
      
      <button
        type="button"
        onClick={clear}
        className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Clear Signature
      </button>
    </div>
  );
}
