// Enable client side rendering only
'use client'; 

import { useEffect, useState } from 'react';

// Import AnimatedCursor dynamically 
import dynamic from 'next/dynamic'

const AnimatedCursor = dynamic(() => import('react-animated-cursor'), { ssr: false })

export default function Cursor() {

  // State to track if hovered over clickable element
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {

    // List of clickable element selectors
    const clickableElements = ['a', 'button', 'input', 'select'];

    // Set isHovering state on mouse enter/leave
    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    // Add event listeners to each clickable element 
    clickableElements.forEach((selector) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        element.addEventListener('mouseenter', onMouseEnter);
        element.addEventListener('mouseleave', onMouseLeave);  
      });
    });

    // Clean up event listeners on unmount
    return () => {
      clickableElements.forEach((selector) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
          element.removeEventListener('mouseenter', onMouseEnter);
          element.removeEventListener('mouseleave', onMouseLeave);
        });
      });
    };

  }, []);

  // Render animated cursor
  return (
    <AnimatedCursor
      innerSize={isHovering ? 14 : 10} // Adjust size on hover
      outerSize={18}
      color={isHovering ? '255, 0, 0' : '255, 105, 180'} 
      outerAlpha={0.3}
      innerScale={1.5} 
      outerScale={2}
      trailingSpeed={10} 
    />
  );
}
