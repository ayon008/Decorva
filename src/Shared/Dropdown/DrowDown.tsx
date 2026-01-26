"use client";
import { ReactNode, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface DropdownItem {
    label: string;
    href: string;
    prefix?: ReactNode; // Optional prefix icon or text
}

interface DropdownProps {
    label: string;
    icon: ReactNode;
    items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, icon, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const chevronRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!contentRef.current || !chevronRef.current) return;

        const fullHeight = contentRef.current.scrollHeight;

        // Animation de la hauteur
        gsap.to(contentRef.current, {
            height: isOpen ? fullHeight : 0,
            duration: 0.4,
            ease: "power2.out",
            overflow: "hidden"
        });

        // Animation de la rotation du chevron
        gsap.to(chevronRef.current, {
            rotate: isOpen ? 90 : 0,
            duration: 0.4,
            ease: "power1.inOut"
        });
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative group">
            <button
                onClick={toggleDropdown}
                className="w-full hover:bg-[#6F9805] text-white p-2 rounded-sm transition-colors duration-200 flex items-center justify-between gap-3 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="text-base leading-[110%]">{label}</span>
                </div>
                <span
                    ref={chevronRef}
                    className="w-4 h-4 inline-flex items-center justify-center"
                >
                    <ChevronRight className="w-4 h-4" />
                </span>
            </button>

            {/* Menu dropdown */}
            <div 
                ref={contentRef}
                className="mt-1 pl-2 overflow-hidden h-0"
            >
                {items.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="hover:bg-[#6F9805] text-white p-2 rounded-sm transition-colors duration-200 flex items-center gap-3"
                    >
                        <span>{item.prefix || "-"}</span>
                        <span className="text-sm leading-[110%]">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;