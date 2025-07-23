"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import axios from "axios";
import { initializeUser } from "@/service/UserService";

interface SignInRequiredProps {
  message?: string;
  onSignIn?: () => void;
}

export default function SignInRequired({
  message = "Please sign in to view this content",
  onSignIn,
}: SignInRequiredProps) {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await axios.get<{
          email: string;
          name: string;
          picture: string;
        }>("https://www.googleapis.com/oauth2/v1/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
            Accept: "application/json",
          },
        });

        const user = await initializeUser({
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
        });

        if (user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...userInfo.data,
              credits: user.credits,
              plan: user.plan,
            })
          );
          onSignIn?.();
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Failed to sign in. Please try again.");
      }
    },
    onError: () => {
      toast.error("Sign in failed. Please try again.");
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Sign In Required</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => login()}
        className="flex items-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </Button>
    </div>
  );
}
