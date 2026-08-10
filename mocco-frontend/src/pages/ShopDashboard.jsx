import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ShopDashboardContent from "../components/shopDashboard/ShopDashboardContent";
import { dashboardItems } from "../components/shopDashboard/constants/dashboardItems";
import { getProducts } from "../services/store/actions/product";
import { getEvents } from "../services/store/actions/event";
import { deleteCoupon, getCoupons } from "../services/store/actions/coupon";
import { getShopOrders } from "../services/store/actions/order";
import { getDashboardStats } from "../services/store/actions/seller";

const formatMoney = (amount = 0) => `$${Number(amount || 0).toFixed(2)}`;

const pakistanBanks = [
  "UBL - United Bank Limited",
  "HBL - Habib Bank Limited",
  "NBP - National Bank of Pakistan",
  "MCB - MCB Bank Limited",
  "ABL - Allied Bank Limited",
  "Standard Chartered Bank Pakistan",
  "Faysal Bank Limited",
  "Bank Alfalah Limited",
  "Askari Bank Limited",
  "JS Bank Limited",
  "Soneri Bank Limited",
  "Bank Al Habib Limited",
  "Dubai Islamic Bank Pakistan Limited",
  "Meezan Bank Limited",
  "BankIslami Pakistan Limited",
];

const ShopDashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { stats, statsLoading, statsError } = useSelector(
    (state) => state.seller,
  );
  const { products, isLoading: productLoading } = useSelector(
    (state) => state.product,
  );
  const { events } = useSelector((state) => state.event);
  const { coupons, getLoading: couponLoading } = useSelector(
    (state) => state.coupon,
  );
  const { shopOrders, shopOrdersLoading } = useSelector((state) => state.order);

  // Fetch all seller data on mount
  useEffect(() => {
    if (seller?._id) {
      dispatch(getProducts(seller._id));
      dispatch(getEvents(seller._id));
      dispatch(getCoupons(seller._id));
      dispatch(getShopOrders());
      dispatch(getDashboardStats());
    }
  }, [seller?._id, dispatch]);

  const [withdrawInput, setWithdrawInput] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");

  const queryTab = new URLSearchParams(location.search).get("tab");
  const activeView = dashboardItems.some((item) => item.id === queryTab)
    ? queryTab
    : "dashboard";

  const sellerEvents = useMemo(() => {
    return Array.isArray(events) ? events : [];
  }, [events]);

  const sellerCoupons = useMemo(
    () =>
      Array.isArray(coupons)
        ? coupons.map((coupon) => {
            const matchedProduct = products?.find(
              (product) =>
                String(product._id) ===
                String(coupon.product?._id || coupon.product),
            );

            return {
              ...coupon,
              productName:
                matchedProduct?.name || coupon.product?.name || "Product",
            };
          })
        : [],
    [coupons, products],
  );

  const handleDeleteCoupon = async (couponId) => {
    if (!couponId) return;

    const shouldDelete = window.confirm("Delete this coupon?");
    if (!shouldDelete) return;

    try {
      await dispatch(deleteCoupon(couponId));
    } catch (error) {
      window.alert(error?.message || "Failed to delete coupon");
    }
  };

  // ── Derived dashboard stats from real backend data ─────────────────────────
  const totalOrders =
    stats?.totalOrders ?? (Array.isArray(shopOrders) ? shopOrders.length : 0);

  const pendingOrders =
    stats?.pendingOrders ??
    (() => {
      const terminalStatuses = new Set([
        "Delivered",
        "Cancelled",
        "Refund Success",
        "Returned",
      ]);
      return Array.isArray(shopOrders)
        ? shopOrders.filter((o) => !terminalStatuses.has(o.status)).length
        : 0;
    })();

  const averageOrderValue =
    stats?.averageOrderValue ??
    (() => {
      const orders = Array.isArray(shopOrders) ? shopOrders : [];
      return orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) /
            orders.length
        : 0;
    })();

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalSold = stats?.totalSold ?? 0;
  const availableBalance = stats?.availableBalance ?? 0;
  const recentOrders = stats?.recentOrders ?? [];

  // ── Withdraw logic ─────────────────────────────────────────────────────────
  const withdrawAmount = Number(withdrawInput || 0);
  const fee = withdrawAmount * 0.1;
  const userReceives = Math.max(withdrawAmount - fee, 0);

  const canSubmitWithdraw =
    !!selectedBankAccountId &&
    withdrawAmount > 0 &&
    withdrawAmount <= availableBalance;

  const handleAddBankAccount = (payload) => {
    const accountNumber = String(payload?.accountNumber || "").replace(
      /\s+/g,
      "",
    );
    const pin = String(payload?.pin || "").trim();

    if (!/^\d{8,30}$/.test(accountNumber)) {
      window.alert("Account number must be between 8 and 30 digits.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      window.alert("PIN must be exactly 4 digits.");
      return;
    }

    const nextAccount = {
      id: `bank-${Date.now()}`,
      bankName: payload.bankName,
      accountHolderName: payload.accountHolderName,
      accountMasked: `**** **** ${accountNumber.slice(-4)}`,
    };

    setBankAccounts((prev) => [...prev, nextAccount]);
    setSelectedBankAccountId(nextAccount.id);
    setShowBankModal(false);
  };

  const handleDeleteBankAccount = (accountId) => {
    const nextAccounts = bankAccounts.filter((item) => item.id !== accountId);
    setBankAccounts(nextAccounts);

    if (selectedBankAccountId === accountId) {
      setSelectedBankAccountId(nextAccounts[0]?.id || "");
    }
  };

  const handleSubmitWithdrawRequest = () => {
    if (!canSubmitWithdraw) return;

    const selectedAccount = bankAccounts.find(
      (account) => account.id === selectedBankAccountId,
    );

    if (!selectedAccount) return;

    setWithdrawals((prev) => [
      {
        id: `w-${Date.now()}`,
        amount: Number(withdrawAmount.toFixed(2)),
        fee: Number(fee.toFixed(2)),
        netAmount: Number(userReceives.toFixed(2)),
        bankName: selectedAccount.bankName,
        accountHolderName: selectedAccount.accountHolderName,
        accountLast4: selectedAccount.accountMasked.slice(-4),
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setWithdrawInput("");
  };

  return (
    <ShopDashboardContent
      activeView={activeView}
      seller={seller}
      sellerProducts={products}
      productLoading={productLoading}
      sellerEvents={sellerEvents}
      sellerCoupons={sellerCoupons}
      couponLoading={couponLoading}
      onDeleteCoupon={handleDeleteCoupon}
      orders={Array.isArray(shopOrders) ? shopOrders : []}
      shopOrdersLoading={shopOrdersLoading}
      withdrawals={withdrawals}
      availableBalance={availableBalance}
      pendingOrders={pendingOrders}
      averageOrderValue={averageOrderValue}
      totalRevenue={totalRevenue}
      totalSold={totalSold}
      recentOrders={recentOrders}
      stats={stats}
      statsLoading={statsLoading}
      statsError={statsError}
      bankAccounts={bankAccounts}
      selectedBankAccountId={selectedBankAccountId}
      withdrawInput={withdrawInput}
      withdrawAmount={withdrawAmount}
      fee={fee}
      userReceives={userReceives}
      canSubmitWithdraw={canSubmitWithdraw}
      showBankModal={showBankModal}
      formatMoney={formatMoney}
      pakistanBanks={pakistanBanks}
      onOpenBankModal={() => setShowBankModal(true)}
      onCloseBankModal={() => setShowBankModal(false)}
      onSelectBankAccount={setSelectedBankAccountId}
      onChangeWithdrawInput={setWithdrawInput}
      onDeleteBankAccount={handleDeleteBankAccount}
      onSubmitWithdrawRequest={handleSubmitWithdrawRequest}
      onAddBankAccount={handleAddBankAccount}
    />
  );
};

export default ShopDashboard;
