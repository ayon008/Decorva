import React from 'react'

const Skeleton = ({ className = '', animate = true, }: { className?: string, animate?: boolean }) => {
    const anim = animate ? 'skeleton-wave' : '';
    return (
        <span
            aria-hidden
            className={`inline-block bg-gray-200 rounded animate-pulse ${anim} ${className}`}
        />
    );
}

export default Skeleton;