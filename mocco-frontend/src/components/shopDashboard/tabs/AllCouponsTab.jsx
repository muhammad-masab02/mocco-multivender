import { useState } from "react";
import TableShell from "../shared/TableShell";
import TableActionMenu from "../shared/TableActionMenu";
import TruncateTextCell from "../shared/TruncateTextCell";
import EditCouponModal from "../modals/EditCouponModal";

const AllCouponsTab = ({ sellerCoupons = [], onDeleteCoupon, isLoading }) => {
  const [editingCoupon, setEditingCoupon] = useState(null);

  if (!sellerCoupons.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
        {isLoading ? "Loading coupons..." : "No coupons found."}
      </div>
    );
  }

  return (
    <>
      <TableShell
        columns={[
          "Coupon ID",
          "Coupon Code",
          "Value (%)",
          "Min Amount",
          "Max Amount",
          "Product",
          "Category",
          "Actions",
        ]}
        productLoading={isLoading}
        rows={sellerCoupons.map((item, i) => {
          const actionList = [
            {
              label: "Edit",
              icon: "edit",
              onClick: () => setEditingCoupon(item),
            },
            {
              label: "Delete",
              icon: "delete",
              variant: "danger",
              onClick: () => onDeleteCoupon?.(item._id),
            },
          ];

          return [
            <TruncateTextCell
              key={`coupon-id-${i}`}
              text={item._id}
              maxWidthClass="max-w-36"
              mono
            />,
            <TruncateTextCell
              key={`coupon-code-${i}`}
              text={item.code}
              maxWidthClass="max-w-36"
            />,
            `${item.value}%`,
            item.minAmount ?? "-",
            item.maxAmount ?? "-",
            <TruncateTextCell
              key={`coupon-product-${i}`}
              text={item.productName || item.product?.name || item.product || "All Products"}
              maxWidthClass="max-w-44"
            />,
            <TruncateTextCell
              key={`coupon-category-${i}`}
              text={item.category}
              maxWidthClass="max-w-40"
            />,
            <TableActionMenu key={`coupon-actions-${i}`} actions={actionList} />,
          ];
        })}
      />

      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
        />
      )}
    </>
  );
};

export default AllCouponsTab;
