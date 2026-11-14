import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadSeller } from "../services/store/actions/seller";
import { getProducts } from "../services/store/actions/product";
import { getEvents } from "../services/store/actions/event";
import MyShopSidebar from "../components/myShop/MyShopSidebar";
import MyShopHeader from "../components/myShop/MyShopHeader";
import ShopProductCard from "../components/myShop/ShopProductCard";
import ShopEventCard from "../components/myShop/ShopEventCard";
import {
  ShopProductCardSkeleton,
  ShopEventCardSkeleton,
} from "../components/common/skeletons";
import ShopEmptyState from "../components/myShop/ShopEmptyState";
import EditShopModal from "../components/myShop/EditShopModal";
import { backendUrl, initialFormState } from "../components/myShop/utils";

const MyShop = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller } = useSelector((state) => state.seller);
  const { products: storeProducts, isLoading: isProductsLoading } = useSelector(
    (state) => state.product,
  );
  const { events: storeEvents, isLoading: isEventsLoading } = useSelector(
    (state) => state.event,
  );

  const [activeTab, setActiveTab] = useState("products");
  const [shopView, setShopView] = useState(() => initialFormState({}));
  const [isShopLoading, setIsShopLoading] = useState(true);

  const isOwner = seller?._id === sellerId;

  // Load shop products and events on mount
  useEffect(() => {
    if (sellerId) {
      dispatch(getProducts(sellerId));
      dispatch(getEvents(sellerId));
    }
  }, [dispatch, sellerId]);

  const [shopReviews, setShopReviews] = useState([]);

  // Load shop profile and aggregated reviews from API
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        setIsShopLoading(true);
        const { data } = await axios.get(`${backendUrl}/shop/info/${sellerId}`);
        if (data?.shop) {
          setShopView(initialFormState(data.shop));
        }
        if (Array.isArray(data?.reviews)) {
          setShopReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch shop details", error);
      } finally {
        setIsShopLoading(false);
      }
    };
    if (sellerId) fetchShopInfo();
  }, [sellerId, isOwner, seller]);

  const sellerProducts = useMemo(() => {
    return Array.isArray(storeProducts) ? storeProducts : [];
  }, [storeProducts]);

  const eventItems = Array.isArray(storeEvents) ? storeEvents : [];

  const reviewItems = useMemo(() => {
    if (shopReviews.length > 0) return shopReviews;

    // Fallback: local extraction if needed
    return sellerProducts.flatMap((product) => {
      const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
      return reviews.map((review, index) => ({
        _id: `${product?._id || index}-review-${index}`,
        itemName: product?.name || "Product",
        itemType: "product",
        comment: review?.comment || "No comment",
        rating: Number(review?.rating || 0),
        user: review?.user,
        createdAt: review?.createdAt,
      }));
    });
  }, [shopReviews, sellerProducts]);

  const totalProducts = sellerProducts.length;
  const totalEvents = eventItems.length;
  const totalReviews = reviewItems.length;

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/shop/logout`, {
        withCredentials: true,
      });

      if (data?.success) {
        window.alert("Logged out successfully.");
        dispatch(loadSeller());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to logout right now.";
      window.alert(message);
    }
  };

  const handleEditClick = () => {
    navigate("/shop-dashboard/?tab=settings");
  };

  if (isShopLoading) {
    return (
      <div className="flex justify-center py-20">Loading shop profile...</div>
    );
  }

  return (
    <>
      <section className="relative w-full rounded-3xl border border-slate-200/90 bg-linear-to-b from-slate-50 via-slate-100 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -left-10 -top-14 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-4 h-64 border-4 w-64 rounded-full bg-rose-100/60 blur-3xl" />

        <div className="relative grid grid-cols-1 items-start gap-6 xl:grid-cols-[320px_1fr] xl:gap-7">
          <MyShopSidebar
            displayShop={shopView}
            totalProducts={totalProducts}
            sellerCreatedAt={shopView?.createdAt}
            onEditClick={handleEditClick}
            onLogout={handleLogout}
            isOwner={isOwner}
          />

          <main className="space-y-10">
            <MyShopHeader
              displayShop={shopView}
              totalProducts={totalProducts}
              totalEvents={totalEvents}
              totalReviews={totalReviews}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOwner={isOwner}
            />

            {activeTab === "products" && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {isProductsLoading && sellerProducts.length === 0 ? (
                  <ShopProductCardSkeleton count={6} />
                ) : sellerProducts.length > 0 ? (
                  sellerProducts.map((product) => (
                    <ShopProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full">
                    <ShopEmptyState
                      title="No products found"
                      subtitle="This shop hasn't listed any products yet."
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {isEventsLoading && eventItems.length === 0 ? (
                  <ShopEventCardSkeleton count={6} />
                ) : eventItems.length > 0 ? (
                  eventItems.map((event) => (
                    <ShopEventCard key={event._id} event={event} />
                  ))
                ) : (
                  <div className="col-span-full">
                    <ShopEmptyState
                      title="No events found"
                      subtitle="This shop doesn't have any active events."
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <>
                {reviewItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {reviewItems.map((review, i) => {
                      const userName = review?.user?.name || "Verified Buyer";
                      const userAvatar = review?.user?.avatar?.url || review?.user?.avatar;
                      const formattedDate = review?.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently";

                      return (
                        <article
                          key={review._id || review.id || i}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-4"
                        >
                          <div>
                            {/* Product/Event info badge */}
                            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2 min-w-0">
                                {review.itemImage && (
                                  <img
                                    src={review.itemImage}
                                    alt={review.itemName}
                                    className="h-8 w-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mr-1.5">
                                    {review.itemType === "event" ? "Event" : "Product"}
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 truncate inline-block max-w-[180px] sm:max-w-xs align-bottom">
                                    {review.itemName || review.productName}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400 shrink-0">
                                {formattedDate}
                              </span>
                            </div>

                            {/* Rating and Comment */}
                            <div className="mt-3 flex items-center gap-1.5">
                              <div className="flex text-amber-400 text-sm">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    className={
                                      s <= Math.round(review.rating || 5)
                                        ? "text-amber-400"
                                        : "text-slate-200"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-slate-600 ml-1">
                                {Number(review.rating || 0).toFixed(1)}
                              </span>
                            </div>

                            <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>

                          {/* Reviewer User info */}
                          <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600">
                              {userAvatar ? (
                                <img
                                  src={userAvatar}
                                  alt={userName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                userName[0]?.toUpperCase() || "U"
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{userName}</p>
                              <p className="text-[10px] text-slate-400">Verified Buyer</p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <ShopEmptyState
                    title="No reviews yet"
                    subtitle="This shop hasn't received any reviews yet."
                  />
                )}
              </>
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default MyShop;
