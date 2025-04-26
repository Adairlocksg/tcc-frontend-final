"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShareIcon, CopyIcon, CheckIcon } from "lucide-react"
import { generateInviteLink } from "@/lib/invitations"

interface ShareInviteButtonProps {
  groupId: string
}

export function ShareInviteButton({ groupId }: ShareInviteButtonProps) {
  const [inviteLink, setInviteLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateLink = async () => {
    setIsLoading(true)
    try {
      const link = await generateInviteLink(groupId)
      setInviteLink(link)
    } catch (error) {
      console.error("Failed to generate invite link:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleGenerateLink}>
          <ShareIcon className="mr-2 h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Group</DialogTitle>
          <DialogDescription>Share this link with people you want to invite to your group.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-link">Invite Link</Label>
            <div className="flex space-x-2">
              <Input id="invite-link" value={inviteLink} readOnly placeholder={isLoading ? "Generating link..." : ""} />
              <Button size="icon" onClick={handleCopy} disabled={!inviteLink || isLoading}>
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => window.open(`mailto:?subject=Join my expense group&body=${encodeURIComponent(inviteLink)}`)}
          >
            Share via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

