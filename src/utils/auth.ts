const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const validateToken = (token: string): boolean => {
  try {
    const decoded = atob(token);
    const timestamp = Number(decoded.split(":")[1]);
    return !isNaN(timestamp) && Date.now() - timestamp < TOKEN_EXPIRY_MS;
  } catch {
    return false;
  }
};
