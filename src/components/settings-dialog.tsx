"use client"

import { useRef, useState } from "react"
import { BellRing, Download, RotateCcw, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_SETTINGS } from "@/lib/constants"
import { useHydrated } from "@/hooks/use-hydrated"
import type { AppSettings } from "@/lib/types"

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: AppSettings
  onUpdateSettings: (patch: Partial<AppSettings>) => void
  onRestoreSample: () => void
  onClearLogs: () => void
  onExport: () => void
  onImport: (file: File) => Promise<void> | void
}

function permissionLabel(permission: NotificationPermission | "unsupported") {
  if (permission === "unsupported") return "Not supported in this browser"
  if (permission === "granted") return "Browser alerts are on"
  if (permission === "denied") return "Blocked — enable them in browser settings"
  return "Not enabled yet"
}

function readPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported"
  }
  return Notification.permission
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
  onRestoreSample,
  onClearLogs,
  onExport,
  onImport,
}: SettingsDialogProps) {
  const hydrated = useHydrated()
  const fileRef = useRef<HTMLInputElement>(null)
  const [permissionOverride, setPermissionOverride] = useState<
    NotificationPermission | "unsupported" | null
  >(null)
  const permission = permissionOverride ?? (hydrated ? readPermission() : "default")

  async function enableNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermissionOverride("unsupported")
      toast.error("Notifications are not available in this browser.")
      return
    }
    const result = await Notification.requestPermission()
    setPermissionOverride(result)
    onUpdateSettings({ notificationsGranted: result === "granted" })
    if (result === "granted") {
      toast.success("Browser reminders are enabled.")
      new Notification("Nichi · reminders ready", {
        body: settings.reminderMessage,
      })
    } else if (result === "denied") {
      toast.error("Permission was denied. You can still use the in-app banner.")
    }
  }

  function sendTest() {
    toast(settings.reminderMessage, {
      description: "This is how the in-app reminder looks.",
    })
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Nichi · test reminder", {
        body: settings.reminderMessage,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Targets & reminders</DialogTitle>
          <DialogDescription>
            Daily goal, exam date, notifications, and JSON backup. Everything
            stays on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3">
            <div>
              <p className="text-sm font-medium">Daily reminder</p>
              <p className="text-xs text-muted-foreground">
                In-app toast plus browser notification when allowed
              </p>
            </div>
            <Switch
              checked={settings.reminderEnabled}
              onCheckedChange={(checked) =>
                onUpdateSettings({ reminderEnabled: checked })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="reminder-time">Reminder time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(event) =>
                  onUpdateSettings({ reminderTime: event.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="daily-goal">Daily target (minutes)</Label>
              <Input
                id="daily-goal"
                type="number"
                min={15}
                max={600}
                value={settings.dailyGoalMinutes}
                onChange={(event) =>
                  onUpdateSettings({
                    dailyGoalMinutes: Number(event.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="exam-name">Exam name</Label>
              <Input
                id="exam-name"
                value={settings.examName}
                onChange={(event) =>
                  onUpdateSettings({ examName: event.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="exam-date">Exam date</Label>
              <Input
                id="exam-date"
                type="date"
                value={settings.examDate}
                onChange={(event) =>
                  onUpdateSettings({ examDate: event.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reminder-message">Reminder message</Label>
            <Textarea
              id="reminder-message"
              value={settings.reminderMessage}
              onChange={(event) =>
                onUpdateSettings({ reminderMessage: event.target.value })
              }
            />
          </div>

          <div className="rounded-xl border px-3 py-3">
            <p className="text-sm font-medium">Browser notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {permissionLabel(permission)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={enableNotifications}>
                <BellRing data-icon="inline-start" />
                Enable alerts
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={sendTest}>
                Send test
              </Button>
            </div>
          </div>

          <div className="rounded-xl border px-3 py-3">
            <p className="text-sm font-medium">Backup</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Export or import logs and settings as JSON
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={onExport}>
                <Download data-icon="inline-start" />
                Export JSON
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                <Upload data-icon="inline-start" />
                Import JSON
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ""
                  if (!file) return
                  await onImport(file)
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onRestoreSample()
                toast.success("Sample history restored.")
              }}
            >
              <RotateCcw data-icon="inline-start" />
              Restore sample
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onClearLogs()
                onUpdateSettings({ ...DEFAULT_SETTINGS, lastNotifiedDate: null })
                toast.success("All sessions cleared.")
              }}
            >
              <Trash2 data-icon="inline-start" />
              Clear all logs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
