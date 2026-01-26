import { ReactNode, useId } from "react";
import Link from "next/link";

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
    const checkboxId = useId(); // Unique ID for each dropdown
    const chevronId = `chevron-${checkboxId}`;

    return (
        <div className="relative group">
            <input type="checkbox" id={checkboxId} className="hidden peer" />
            <label
                htmlFor={checkboxId}
                className="hover:bg-[#6F9805] text-white p-2 rounded-sm transition-colors duration-200 flex items-center justify-between gap-3 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="text-base leading-[110%]">{label}</span>
                </div>
                <span
                    id={chevronId}
                    className="w-4 h-4 transition-transform duration-300 ease-in-out"
                >
                    {/* You can replace this with a proper chevron icon */}
                    &gt;
                </span>
            </label>

            {/* Menu dropdown */}
            <div className="hidden peer-checked:block mt-1 border-white/20 pl-2 transition-all duration-300 ease-in-out">
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