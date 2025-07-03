"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Mail, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function InviteClientButton() {
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const generateInviteLink = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/invites/generate", {
        method: "POST",
      })
      const data = await response.json()
      setInviteLink(`${window.location.origin}/sign-up/${data.token}`)
    } catch (error) {
      console.error("Erreur lors de la génération du lien:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Mail className="h-4 w-4 mr-2" />
          Inviter un client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter un nouveau client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Lien d'invitation</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                placeholder="Cliquez sur générer pour créer un lien"
                className="flex-1"
              />
              {inviteLink && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={generateInviteLink}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Génération..." : "Générer un nouveau lien"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Ce lien est à usage unique et expirera dans 24 heures.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 