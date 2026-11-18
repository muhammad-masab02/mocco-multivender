// Create token and save in cookies - Generic function for all entity types (user, shop, admin, etc.)

export const getIsProduction = (req) => {
  if (
    process.env.VERCEL === "1" ||
    String(process.env.NODE_ENV || "").toLowerCase() === "production"
  ) {
    return true;
  }
  if (req) {
    const proto = req.headers?.["x-forwarded-proto"];
    const origin = req.headers?.origin || "";
    if (proto === "https" || req.secure || origin.startsWith("https://")) {
      return true;
    }
  }
  return false;
};

export const getCookieOptions = (req) => {
  const isProduction = getIsProduction(req);
  return {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
};

export const getClearCookieOptions = (req) => {
  const isProduction = getIsProduction(req);
  return {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
};

// Robust cookie clearer for both cross-site production and local development
export const clearAuthCookie = (res, cookieName, req) => {
  const isProduction = getIsProduction(req);

  const clearOptions = {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };

  res.cookie(cookieName, "", clearOptions);
};

const sendToken = (payload, statusCode, res, entityName = "user", req = null) => {
  // Handle case where payload might not have getJwtToken method
  if (!payload || typeof payload.getJwtToken !== "function") {
    return res.status(500).json({
      success: false,
      message: "Invalid payload: Must have getJwtToken method",
    });
  }

  const token = payload.getJwtToken();
  const options = getCookieOptions(req);

  // Convert payload to plain object and remove sensitive fields
  const payloadObj = payload.toObject ? payload.toObject() : payload;
  delete payloadObj.password;

  // Set the primary entity cookie (e.g. admin_token, seller_token, user_token)
  res.cookie(`${entityName}_token`, token, options);

  // When admin logs in, ensure user_token is cleared so only admin_token is stored in cookies
  if (entityName === "admin") {
    clearAuthCookie(res, "user_token", req);
  }

  // Return token directly in the JSON response body alongside the entity object
  res.status(statusCode).json({
    success: true,
    token,
    [entityName]: payloadObj,
  });
};

export default sendToken;
