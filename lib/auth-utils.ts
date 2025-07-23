/**
 * Helper functions for handling user authentication
 */

export type PlanType = "FREE" | "PRO" | "PREMIUM";

export interface User {
  email: string;
  name: string;
  picture: string;
  credits?: number;
  plan?: PlanType;
}

export const getUserFromCookie = (): User | null => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (cookie) {
      return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    }
  } catch (e) {
    console.error("Error parsing user cookie:", e);
  }
  return null;
};

export const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Error parsing localStorage user:", e);
    return null;
  }
};

export const setUserCookie = (user: User): void => {
  try {
    const cookieStr = encodeURIComponent(JSON.stringify(user));
    document.cookie = `user=${cookieStr}; path=/; max-age=2592000; samesite=lax; secure`;
  } catch (e) {
    console.error("Error setting user cookie:", e);
  }
};

export const setUserStorage = (user: User): void => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Error setting localStorage user:", e);
  }
};

export const clearUserAuth = (): void => {
  localStorage.removeItem("user");
  document.cookie =
    "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax; secure";
};

export const syncUserAuth = (): User | null => {
  const cookieUser = getUserFromCookie();
  const storageUser = getUserFromStorage();

  if (cookieUser && !storageUser) {
    setUserStorage(cookieUser);
    return cookieUser;
  }

  if (!cookieUser && storageUser) {
    setUserCookie(storageUser);
    return storageUser;
  }

  return cookieUser || storageUser || null;
};
