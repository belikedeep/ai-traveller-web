import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

export default function CustomDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-sm border-border/40 shadow-xl max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <p>{description}</p>
            {children}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
