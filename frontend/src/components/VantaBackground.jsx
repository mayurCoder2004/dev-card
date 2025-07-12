import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xffc107,           // Amber
          backgroundColor: 0x0a0a0a, // Deep black-gray
          points: 12.0,
          maxDistance: 25.0,
          spacing: 18.0
        })
      );
    }

    const handleResize = () => {
      if (vantaEffect && typeof vantaEffect.resize === "function") {
        vantaEffect.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        transition: 'opacity 1s ease-in-out',
      }}
    />
  );
};

export default VantaBackground;
