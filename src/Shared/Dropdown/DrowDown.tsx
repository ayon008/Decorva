"use client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();

    const isAnyItemActive = useMemo(() => {
        return items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
    }, [items, pathname]);

    const [isOpen, setIsOpen] = useState<boolean>(isAnyItemActive);
    const contentRef = useRef<HTMLDivElement>(null);
    const chevronRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setIsOpen(isAnyItemActive);
    }, [isAnyItemActive]);

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

    const baseItem =
        "text-white p-2 rounded-sm transition-colors duration-200 flex items-center gap-3";
    const activeItem = "bg-[#6F9805]";

    return (
        <div className="relative group">
            <button
                onClick={toggleDropdown}
                className={`w-full text-white p-2 rounded-sm transition-colors duration-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#6F9805] ${isAnyItemActive ? activeItem : ""
                    }`}
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
                        className={`${baseItem} hover:bg-[#6F9805] ${pathname === item.href || pathname.startsWith(item.href + "/") ? activeItem : ""
                            }`}
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