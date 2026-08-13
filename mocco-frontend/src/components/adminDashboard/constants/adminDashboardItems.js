import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Tag,
  ShoppingBag,
  Wallet,
  Settings,
} from "lucide-react";

export const adminDashboardItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    color: "blue",
  },
  {
    id: "all-orders",
    label: "All Orders",
    icon: ShoppingBag,
    color: "cyan",
  },
  {
    id: "all-users",
    label: "All Users",
    icon: Users,
    color: "emerald",
  },
  {
    id: "all-sellers",
    label: "All Sellers",
    icon: Store,
    color: "orange",
  },
  {
    id: "all-products",
    label: "All Products",
    icon: Package,
    color: "purple",
  },
  {
    id: "all-events",
    label: "All Events",
    icon: Tag,
    color: "pink",
  },
  {
    id: "withdraw-requests",
    label: "Withdraw Requests",
    icon: Wallet,
    color: "amber",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "slate",
  },
];
