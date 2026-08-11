const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";
const serverHost = backendUrl.replace(/\/api\/v1\/?$/, "");

/**
 * Safely resolves an image URL string.
 * Supports Cloudinary URLs (https://res.cloudinary.com/...), Data URIs,
 * external HTTP URLs, and legacy local uploads (/uploads/...).
 *
 * @param {string} url - Image path or URL
 * @param {string} fallback - Fallback image URL if path is missing
 * @returns {string} Fully resolved image URL
 */
export const getImageUrl = (
  url,
  fallback = "https://dummyimage.com/200x200/e2e8f0/64748b.png&text=Mocco"
) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Return absolute Cloudinary / external / base64 URLs directly
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  // Handle legacy local uploads path
  if (cleanUrl.startsWith("/")) {
    return `${serverHost}${cleanUrl}`;
  }

  return `${serverHost}/${cleanUrl}`;
};
