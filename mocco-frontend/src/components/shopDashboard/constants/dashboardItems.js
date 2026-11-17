import {
    CalendarDays,
    Gift,
    Inbox,
    LayoutDashboard,
    Package,
    Plus,
    Settings,
    ShoppingBag,
    Tag,
    Ticket,
    Undo2,
    Wallet,
} from "lucide-react";

export const dashboardItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        color: "blue",        // Analytics / overview
    },
    {
        id: "allProducts",
        label: "All Products",
        icon: Package,
        color: "emerald",     // Inventory / products
    },
    {
        id: "createProduct",
        label: "Create Product",
        icon: Plus,
        color: "lime",        // Create / success / add
    },
    {
        id: "allEvents",
        label: "All Events",
        icon: Tag,
        color: "orange",      // Promotions / events
    },
    {
        id: "createEvent",
        label: "Create Event",
        icon: CalendarDays,
        color: "sky",         // Calendar / scheduling
    },
    {
        id: "allCoupons",
        label: "All Coupons",
        icon: Gift,
        color: "pink",        // Discounts / gifts
    },
    {
        id: "createCoupon",
        label: "Create Coupon",
        icon: Ticket,
        color: "indigo",      // Voucher / ticket
    },
    {
        id: "allOrders",
        label: "All Orders",
        icon: ShoppingBag,
        color: "cyan",        // Shopping / orders
    },
    {
        id: "refunds",
        label: "Refunds",
        icon: Undo2,
        color: "red",         // Refund / reverse action
    },
    {
        id: "withdraw",
        label: "Withdraw Money",
        icon: Wallet,
        color: "amber",       // Money / finance
    },
    {
        id: "inbox",
        label: "Shop Inbox",
        icon: Inbox,
        color: "teal",        // Messages / communication
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        color: "purple",      // Configuration / preferences
    },
];
