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
    id: "allOrders",
    label: "All Orders",
    icon: ShoppingBag,
    color: "cyan",
  },
  {
    id: "allUsers",
    label: "All Users",
    icon: Users,
    color: "emerald",
  },
  {
    id: "allSellers",
    label: "All Sellers",
    icon: Store,
    color: "orange",
  },
  {
    id: "allProducts",
    label: "All Products",
    icon: Package,
    color: "purple",
  },
  {
    id: "allEvents",
    label: "All Events",
    icon: Tag,
    color: "pink",
  },
  {
    id: "withdraw",
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
