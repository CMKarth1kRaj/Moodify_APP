import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface MarqueeTextProps {
  children: ReactNode;
  className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ children, className }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const hasOverflow = textRef.current.scrollWidth > containerRef.current.clientWidth;
                if (hasOverflow !== isOverflowing) {
                   setIsOverflowing(hasOverflow);
                }
            }
        };

        // Use a ResizeObserver for more reliable overflow detection
        const resizeObserver = new ResizeObserver(checkOverflow);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        checkOverflow();

        return () => {
            resizeObserver.disconnect();
        };
    }, [children, isOverflowing]);

    return (
        <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
            <span ref={textRef} className={isOverflowing ? 'marquee inline-block' : 'inline-block'}>
                {children}
            </span>
             {/* Duplicate the text for a seamless loop, only if overflowing */}
            {isOverflowing && (
                <span className="marquee inline-block">
                    {children}
                </span>
            )}
        </div>
    );
};

export default MarqueeText;
