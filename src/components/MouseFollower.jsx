import React, { useEffect, useRef } from 'react';

const MouseFollower = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    
    const handleMouseMove = (e) => {
      if (circle) {
        const x = e.clientX;
        const y = e.clientY;
        circle.style.transform = `translate(${x}px, ${y}px)`;
        circle.style.opacity = '1';
      }
    };

    // Set initial position
    handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={circleRef} className="mouse-circle" />;
};

export default MouseFollower;
