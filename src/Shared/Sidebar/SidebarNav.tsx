"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  CreditCard,
  Home,
  Package,
  Package2,
  Settings,
  Star,
  TicketPercent,
  Truck,
  Users2,
} from "lucide-react";
import Dropdown from "@/Shared/Dropdown/DrowDown";

export default function SidebarNav() {
  const pathname = usePathname();

  const baseLink =
    "text-white p-2 rounded-sm transition-colors duration-200 flex items-center gap-3";
  const activeLink = "bg-[#6F9805]";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex flex-col gap-2 mt-2">
      <Link
        className={`${baseLink} hover:bg-[#6F9805] ${isActive("/") ? activeLink : ""}`}
        href={"/"}
      >
        <Home className="w-4 h-4" />
        <span className="text-base leading-[110%]">Home</span>
      </Link>

      <Dropdown
        label="Products"
        icon={<Package className="w-4 h-4" />}
        items={[
          { label: "All Products", href: "/dashboard/products/all" },
          { label: "Add Product", href: "/dashboard/products/add" },
          { label: "Categories", href: "/dashboard/products/categories" },
          { label: "Attributes", href: "/dashboard/products/attributes" },
          { label: "Variations", href: "/dashboard/products/variations" },
          { label: "Inventory", href: "/dashboard/products/inventory" },
        ]}
      />

      <Dropdown
        label="Orders"
        icon={<Package2 className="w-4 h-4" />}
        items={[
          { label: "All Orders", href: "/dashboard/orders/all" },
          { label: "Pending", href: "/dashboard/orders/pending" },
          { label: "Processing", href: "/dashboard/orders/processing" },
          { label: "Shipped", href: "/dashboard/orders/shipped" },
          { label: "Completed", href: "/dashboard/orders/completed" },
          { label: "Cancelled / Returned", href: "/dashboard/orders/cancelled" },
        ]}
      />

      <Dropdown
        label="Customers"
        icon={<Users2 className="w-4 h-4" />}
        items={[
          { label: "All customers", href: "/dashboard/customers/all" },
          { label: "Customer details", href: "/dashboard/customers/details" },
          { label: "Order history", href: "/dashboard/orders/history" },
          { label: "Total spent", href: "/dashboard/orders/spent" },
          {
            label: "Last order date",
            href: "/dashboard/orders/last-order-date",
          },
        ]}
      />

      <Dropdown
        label="Coupons"
        icon={<TicketPercent className="w-4 h-4" />}
        items={[
          { label: "Active coupons", href: "/dashboard/coupons/active" },
          { label: "Expired coupons", href: "/dashboard/coupons/expired" },
          { label: "Create coupon", href: "/dashboard/coupons/create" },
        ]}
      />

      <Dropdown
        label="Shipping"
        icon={<Truck className="w-4 h-4" />}
        items={[
          { label: "Shipping Zones", href: "/dashboard/shipping/zones" },
          { label: "Shipping methods", href: "/dashboard/shipping/methods" },
          { label: "Rates", href: "/dashboard/shipping/rates" },
        ]}
      />

      <Dropdown
        label="Payments"
        icon={<CreditCard className="w-4 h-4" />}
        items={[
          { label: "Payment methods", href: "/dashboard/payments" },
          { label: "Transactions", href: "/dashboard/payments/transactions" },
          { label: "Failed payments", href: "/dashboard/payments/failed" },
        ]}
      />

      <Dropdown
        label="Reviews"
        icon={<Star fill="#ecc94b" className="w-4 h-4" />}
        items={[
          { label: "Pending approval", href: "/dashboard/reviews/pending" },
          { label: "Approved", href: "/dashboard/reviews/approved" },
          { label: "Spam", href: "/dashboard/reviews/spam" },
        ]}
      />

      <Dropdown
        label="Analytics"
        icon={<ChartBar className="w-4 h-4" />}
        items={[
          { label: "Sales report", href: "/dashboard/analytics/sales-report" },
          {
            label: "Product performance",
            href: "/dashboard/analytics/product-performance",
          },
          {
            label: "Customer analytics",
            href: "/dashboard/analytics/customer-analytics",
          },
        ]}
      />

      <Dropdown
        label="Settings"
        icon={<Settings className="w-4 h-4" />}
        items={[
          { label: "General", href: "/dashboard/settings/general" },
          { label: "Store info", href: "/dashboard/settings/store-info" },
          { label: "Taxes", href: "/dashboard/settings/taxes" },
          { label: "Shipping", href: "/dashboard/settings/shipping" },
          { label: "Payments", href: "/dashboard/settings/payments" },
          {
            label: "Roles & permissions",
            href: "/dashboard/settings/roles-permissions",
          },
        ]}
      />
    </nav>
  );
}

