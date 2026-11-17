import DashboardTab from "./tabs/DashboardTab";
import AllProductsTab from "./tabs/AllProductsTab";
import CreateProductTab from "./tabs/CreateProductTab";
import AllEventsTab from "./tabs/AllEventsTab";
import CreateEventTab from "./tabs/CreateEventTab";
import AllCouponsTab from "./tabs/AllCouponsTab";
import CreateCouponTab from "./tabs/CreateCouponTab";
import OrdersTab from "./tabs/OrdersTab";
import WithdrawTab from "./tabs/WithdrawTab";
import InboxTab from "./tabs/InboxTab";
import RefundsTab from "./tabs/RefundsTab";
import ShopSettingsTab from "./tabs/ShopSettingsTab";

const ShopDashboardContent = ({
  activeView,
  seller,
  sellerProducts,
  productLoading,
  sellerEvents,
  sellerCoupons,
  couponLoading,
  onDeleteCoupon,
  orders,
  shopOrdersLoading,
  withdrawals,
  availableBalance,
  pendingOrders,
  averageOrderValue,
  totalRevenue,
  totalSold,
  recentOrders,
  stats,
  statsLoading,
  statsError,
  bankAccounts,
  selectedBankAccountId,
  withdrawInput,
  withdrawAmount,
  fee,
  userReceives,
  canSubmitWithdraw,
  showBankModal,
  formatMoney,
  pakistanBanks,
  onOpenBankModal,
  onCloseBankModal,
  onSelectBankAccount,
  onChangeWithdrawInput,
  onDeleteBankAccount,
  onSubmitWithdrawRequest,
  onAddBankAccount,
}) => {
  if (activeView === "dashboard") {
    return (
      <DashboardTab
        seller={seller}
        sellerProducts={sellerProducts}
        sellerEvents={sellerEvents}
        orders={orders}
        shopOrdersLoading={shopOrdersLoading}
        withdrawals={withdrawals}
        pendingOrders={pendingOrders}
        averageOrderValue={averageOrderValue}
        totalRevenue={totalRevenue}
        totalSold={totalSold}
        availableBalance={availableBalance}
        recentOrders={recentOrders}
        stats={stats}
        statsLoading={statsLoading}
        statsError={statsError}
        formatMoney={formatMoney}
      />
    );
  }

  if (activeView === "allProducts") {
    return (
      <AllProductsTab
        sellerProducts={sellerProducts}
        productLoading={productLoading}
      />
    );
  }

  if (activeView === "createProduct") {
    return <CreateProductTab />;
  }

  if (activeView === "allEvents") {
    return <AllEventsTab sellerEvents={sellerEvents} />;
  }

  if (activeView === "createEvent") {
    return <CreateEventTab />;
  }

  if (activeView === "allCoupons") {
    return (
      <AllCouponsTab
        sellerCoupons={sellerCoupons}
        isLoading={couponLoading}
        onDeleteCoupon={onDeleteCoupon}
      />
    );
  }

  if (activeView === "createCoupon") {
    return <CreateCouponTab />;
  }

  if (activeView === "allOrders") {
    return <OrdersTab />;
  }

  if (activeView === "refunds") {
    return <RefundsTab />;
  }

  if (activeView === "withdraw") {
    return (
      <WithdrawTab
        availableBalance={availableBalance}
        bankAccounts={bankAccounts}
        selectedBankAccountId={selectedBankAccountId}
        onSelectBankAccount={onSelectBankAccount}
        withdrawInput={withdrawInput}
        onChangeWithdrawInput={onChangeWithdrawInput}
        formatMoney={formatMoney}
        withdrawAmount={withdrawAmount}
        fee={fee}
        userReceives={userReceives}
        onOpenBankModal={onOpenBankModal}
        onDeleteBankAccount={onDeleteBankAccount}
        onSubmitWithdrawRequest={onSubmitWithdrawRequest}
        canSubmitWithdraw={canSubmitWithdraw}
        withdrawals={withdrawals}
        showBankModal={showBankModal}
        onCloseBankModal={onCloseBankModal}
        onAddBankAccount={onAddBankAccount}
        pakistanBanks={pakistanBanks}
      />
    );
  }

  if (activeView === "settings") {
    return <ShopSettingsTab />;
  }

  if (activeView === "inbox") {
    return <InboxTab />;
  }

  // Fallback: render some default content or an error message if the activeView doesn't match any known tab
  return (
    <div className="p-4">
      <p>Content not found :(</p>
    </div>
  );
};

export default ShopDashboardContent;
