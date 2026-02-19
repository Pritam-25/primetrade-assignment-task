export const getBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
