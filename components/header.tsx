"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/ui/CustomDialog";
import { FcGoogle } from "react-icons/fc";
import {
  Menu,
  X,
  Plus,
  CreditCard,
  Map,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { initializeUser, getUser } from "@/service/UserService";
import {
  syncUserAuth,
  setUserCookie,
  setUserStorage,
  clearUserAuth,
  type User,
} from "@/lib/auth-utils";

interface TokenInfo {
  access_token: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect logged-in users from home page
  useEffect(() => {
    if (user && pathname === "/") {
      router.replace("/my-trips");
    }
  }, [user, pathname, router]);

  const checkUserAndCredits = useCallback(async () => {
    const userData = syncUserAuth();
    if (userData) {
      const firestoreUser = await getUser(userData.email);
      if (firestoreUser) {
        const updatedUser = {
          ...userData,
          credits: firestoreUser.credits,
          plan: firestoreUser.plan,
        };
        setUserStorage(updatedUser);
        setUserCookie(updatedUser);
        setUser(updatedUser);

        // Redirect to /my-trips if on home page
        if (window.location.pathname === "/") {
          router.replace("/my-trips");
        }
      } else {
        setUser(userData);
      }
    }
  }, [router]);

  useEffect(() => {
    checkUserAndCredits();
    const creditCheckInterval = setInterval(checkUserAndCredits, 10000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkUserAndCredits();
      }
    };

    const handleCreditUpdate = () => {
      checkUserAndCredits();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("creditUpdate", handleCreditUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("creditUpdate", handleCreditUpdate);
      clearInterval(creditCheckInterval);
    };
  }, [checkUserAndCredits]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isMobileMenuOpen]);

  const login = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response as TokenInfo),
    onError: (error) => console.error("Login Failed:", error),
    scope: "email profile",
  });

  const GetUserProfile = async (tokenInfo: TokenInfo) => {
    try {
      const response = await axios.get<User>(
        `https://www.googleapis.com/oauth2/v1/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );

      const googleUser = response.data;
      const firestoreUser = await initializeUser(googleUser);

      if (!firestoreUser) {
        throw new Error("Failed to initialize user");
      }

      const userWithCredits = {
        ...googleUser,
        credits: firestoreUser.credits,
        plan: firestoreUser.plan,
      };

      setUserStorage(userWithCredits);
      setUserCookie(userWithCredits);
      setUser(userWithCredits);
      setOpenDialog(false);
      setIsMobileMenuOpen(false);

      // Redirect to /my-trips after successful login
      router.replace("/my-trips");

      window.dispatchEvent(new Event("auth-change"));
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleLogout = () => {
    clearUserAuth();
    setUser(null);
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  // Navigation items - Note: Home now points to /my-trips for logged-in users
  const navItems = user
    ? [
        // { href: "/my-trips", label: "Home", icon: Home },
        { href: "/create-trip", label: "Create Trip", icon: Plus },
        { href: "/my-trips", label: "My Trips", icon: Map },
        { href: "/pricing", label: "Credits", icon: CreditCard },
      ]
    : [];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen ${
          isDesktopSidebarCollapsed ? "w-20" : "w-64"
        } flex-col border-r border-border/40 bg-background/80 backdrop-blur-md z-30 transition-all duration-300`}
      >
        <div className="relative">
          <div className="p-6">
            <Link
              href={user ? "/my-trips" : "/"}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="transition-transform duration-200 hover:scale-110"
              />
              {!isDesktopSidebarCollapsed && (
                <span className="text-foreground font-bold text-lg">
                  Trip Genie
                </span>
              )}
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 bg-background border border-border/40"
            onClick={() =>
              setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
            }
          >
            {isDesktopSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-4">
          {user ? (
            <div className="space-y-6">
              <div className="px-2">
                <div
                  className={`flex ${
                    isDesktopSidebarCollapsed
                      ? "justify-center"
                      : "items-center gap-3"
                  } mb-2`}
                >
                  <Image
                    src={user.picture}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-primary"
                    alt={user.name}
                  />
                  {!isDesktopSidebarCollapsed && (
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
                {!isDesktopSidebarCollapsed && (
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-4"
                    asChild
                  >
                    <Link href="/pricing">💰 {user.credits ?? 0} Credits</Link>
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={`w-full ${
                        isDesktopSidebarCollapsed
                          ? "justify-center"
                          : "justify-start gap-2"
                      } ${
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                      asChild
                    >
                      <Link href={item.href} title={item.label}>
                        <Icon className="h-4 w-4" />
                        {!isDesktopSidebarCollapsed && item.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              🚀 Sign Up
            </Button>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-border/40">
            <Button
              variant="ghost"
              className={`w-full ${
                isDesktopSidebarCollapsed
                  ? "justify-center"
                  : "justify-start gap-2"
              }`}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isDesktopSidebarCollapsed && "Logout"}
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/40 z-40">
        <div className="h-full flex justify-between items-center px-4">
          <Link
            href={user ? "/my-trips" : "/"}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="transition-transform duration-200"
            />
            <span className="text-foreground font-bold text-lg">
              Trip Genie
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-border/40">
            <Link
              href={user ? "/my-trips" : "/"}
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image src="/logo.png" alt="Logo" width={36} height={36} />
              <span className="text-foreground font-bold text-lg">
                Trip Genie
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {user ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={user.picture}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-primary"
                    alt={user.name}
                  />
                  <p className="mt-2 font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button
                    variant="outline"
                    className="w-full justify-center mt-4"
                    asChild
                  >
                    <Link href="/pricing">💰 {user.credits ?? 0} Credits</Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setOpenDialog(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                🚀 Sign Up
              </Button>
            )}
          </div>

          {user && (
            <div className="p-4 border-t border-border/40">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}

      <CustomDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Sign in with Google"
        description="Sign in to Trip Genie with Google for a seamless travel planning experience."
      >
        <Button
          onClick={() => login()}
          className="w-full mt-5 flex gap-4 items-center bg-background hover:bg-accent text-foreground"
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </Button>
      </CustomDialog>
    </>
  );
}
