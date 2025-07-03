"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Mail, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSession } from "@/lib"
import { log } from "node:console"
import { Logger } from "tslog"
import { logger } from "better-auth"

export function InviteClientButton() {
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const { data: session } = useSession()


  const generateInviteLink = async () => {
    setIsLoading(true)
    try {
      logger.info("Session debug:", session)
      const response = await fetch("/api/invites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setInviteLink(`${window.location.origin}/sign-up/${data.token}`)
      console.log("Session debug:", session)
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email du client"
            className="input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={generateInviteLink}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? "Génération..." : "Inviter le client"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Ce lien est à usage unique et expirera dans 24 heures.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 