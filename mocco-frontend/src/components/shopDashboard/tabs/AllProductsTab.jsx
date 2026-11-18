import { useState } from "react";
import toast from "react-hot-toast";
import TableShell from "../shared/TableShell";
import TableActionMenu from "../shared/TableActionMenu";
import TruncateTextCell from "../shared/TruncateTextCell";
import EditProductOrEventModal from "../modals/EditProductOrEventModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteProduct,
  toggleFeatured,
} from "../../../services/store/actions/product";

const AllProductsTab = ({ sellerProducts = [], productLoading = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local optimistic state for isFeatured per product id
  const [featuredState, setFeaturedState] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  const handlePreviewRoute = (productId) => {
    if (!productId) return;
    navigate(`/product-detail/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await dispatch(deleteProduct(productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const handleToggleFeatured = async (productId, currentIsFeatured) => {
    setFeaturedState((prev) => ({
      ...prev,
      [productId]: !currentIsFeatured,
    }));
    try {
      await dispatch(toggleFeatured(productId));
      toast.success(!currentIsFeatured ? "Product marked as featured!" : "Product unfeatured.");
    } catch (error) {
      setFeaturedState((prev) => ({
        ...prev,
        [productId]: currentIsFeatured,
      }));
      toast.error(error?.message || "Failed to update featured status");
    }
  };

  const productsToRender = Array.isArray(sellerProducts) ? sellerProducts : [];

  const rows =
    productsToRender.length > 0
      ? productsToRender.map((item, i) => {
          const productId = item?._id;
          const isFeatured =
            productId in featuredState
              ? featuredState[productId]
              : !!item?.isFeatured;

          const actionList = [
            {
              label: "Preview",
              icon: "preview",
              onClick: () => handlePreviewRoute(productId),
            },
            {
              label: "Edit",
              icon: "edit",
              onClick: () => setEditingProduct(item),
            },
            {
              label: isFeatured ? "Unfeature" : "Mark Featured",
              icon: "feature",
              active: isFeatured,
              onClick: () => handleToggleFeatured(productId, isFeatured),
            },
            {
              label: "Delete",
              icon: "delete",
              variant: "danger",
              onClick: () => handleDeleteProduct(productId),
            },
          ];

          return [
            <TruncateTextCell
              key={`product-id-${i}`}
              text={productId || `69abd7d0${i}88124dd5a`}
              maxWidthClass="max-w-36"
              mono
            />,
            <TruncateTextCell
              key={`product-name-${i}`}
              text={item?.name || "Unnamed Product"}
              maxWidthClass="max-w-48"
            />,
            `US$ ${item?.discount_price ?? item?.price ?? 0}`,
            item?.stock ?? 0,
            item?.total_sell ?? 0,
            <span
              key={`product-status-${i}`}
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isFeatured
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isFeatured ? "Featured" : "Standard"}
            </span>,
            <TableActionMenu key={`product-actions-${i}`} actions={actionList} />,
          ];
        })
      : [
          [
            productLoading
              ? "Loading products..."
              : "No products found for this shop.",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
          ],
        ];

  return (
    <>
      <TableShell
        columns={[
          "Product Id",
          "Name",
          "Price",
          "Stock",
          "Sold",
          "Status",
          "Actions",
        ]}
        rows={rows}
        productLoading={productLoading}
      />

      {editingProduct && (
        <EditProductOrEventModal
          item={editingProduct}
          mode="product"
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
};

export default AllProductsTab;
