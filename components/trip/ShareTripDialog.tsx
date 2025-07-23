"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Twitter, Phone, Lock, Globe } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
// import { getUser } from "@/service/UserService";

interface ShareTripDialogProps {
  tripId: string;
  location: string;
}

// interface UserData {
//   email: string;
//   plan: "FREE" | "PRO" | "PREMIUM";
// }

export default function ShareTripDialog({
  tripId,
  location,
}: ShareTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO" | "PREMIUM">("FREE");
  const shareableLink = `${window.location.origin}/shared-trips/${tripId}`;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.plan) {
      setUserPlan(userData.plan);
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success(
        "Link copied to clipboard!" +
          (userPlan === "FREE"
            ? " Note: Only signed-in users can view this trip"
            : "")
      );
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  }, [shareableLink, userPlan]);

  const handleSocialShare = useCallback(
    (platform: "twitter" | "whatsapp") => {
      const text = `Check out my travel itinerary for ${location}!`;
      const url = encodeURIComponent(shareableLink);

      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${url}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          `${text}\n${shareableLink}`
        )}`,
      };

      window.open(urls[platform], "_blank");
    },
    [location, shareableLink]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full md:w-auto">
          <Share2 className="mr-2 h-4 w-4" />
          Share Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share trip to {location}</DialogTitle>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            {userPlan === "FREE" ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Only signed-in users can view this trip</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Anyone with the link can view this trip</span>
              </>
            )}
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input value={shareableLink} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleSocialShare("twitter")}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleSocialShare("whatsapp")}
            >
              <Phone className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
