"use client";

import { Copy, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useGroupLink } from "@/hooks/use-group-link";

interface GroupLinkDialogProps {
  groupId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function GroupLinkDialog({
  open,
  setOpen,
  groupId,
}: GroupLinkDialogProps) {
  const [copied, setCopied] = useState(false);
  const [doRequest, setDoRequest] = useState(false);
  const { data: link, isLoading, refetch } = useGroupLink(groupId, doRequest);

  const handleGenerateLink = async () => {
    setDoRequest(true);
    await refetch();
    setDoRequest(false);
    setOpen(true);
  };

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGenerateLink}
        disabled={isLoading}
        className="flex items-center text-sm text-muted-foreground"
      >
        Gerar link
        {isLoading && <Loader2 className=" animate-spin" />}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link do grupo</DialogTitle>
            <DialogDescription>
              Compartilhe esse link com pessoas que você queira convidar para
              seu grupo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Link
            </label>
            <div className="flex">
              <Input readOnly value={link} />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-muted-foreground hover:text-primary",
                  copied && "text-green-500"
                )}
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
