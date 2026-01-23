import React from 'react'

const Skeleton = ({ className = '', style = {}, animate = true }: { className?: string, style?: React.CSSProperties, animate?: boolean }) => {
    const anim = animate ? 'animate-pulse' : '';
    return <span aria-hidden className={`inline-block ${className} bg-gray-100 rounded ${anim}`} style={style} />;
}

export default Skeleton;