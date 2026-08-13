// Create token and save in cookies - Generic function for all entity types (user, shop, admin, etc.)

export const getIsProduction = () => {
  return (
    process.env.VERCEL === "1" ||
    String(process.env.NODE_ENV || "").toLowerCase() === "production"
  );
};

export const getCookieOptions = () => {
  const isProduction = getIsProduction();
  return {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
};

export const getClearCookieOptions = () => {
  const isProduction = getIsProduction();
  return {
    expires: new Date(0),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
};

const sendToken = (payload, statusCode, res, entityName = "user") => {
  // Handle case where payload might not have getJwtToken method
  if (!payload || typeof payload.getJwtToken !== "function") {
    return res.status(500).json({
      success: false,
      message: "Invalid payload: Must have getJwtToken method",
    });
  }

  const token = payload.getJwtToken();
  const options = getCookieOptions();

  // Convert payload to plain object and remove sensitive fields
  const payloadObj = payload.toObject ? payload.toObject() : payload;
  delete payloadObj.password;

  // Use dynamic entity name in response (user, shop, admin, etc.)
  res.status(statusCode).cookie(`${entityName}_token`, token, options).json({
    success: true,
    [entityName]: payloadObj,
  });
};

export default sendToken;
