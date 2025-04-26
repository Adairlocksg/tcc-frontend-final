"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, SettingsIcon, LogOutIcon, CreditCard, Bell, Shield, Edit2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    joinedDate: "January 2023",
    avatar: null,
  }

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container pb-20">
      <div className="relative mb-8 mt-6 flex flex-col items-center">
        <div className="absolute inset-0 -z-10 h-40 bg-gradient-to-b from-primary/20 to-background"></div>

        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback className="bg-primary/10 text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground">Member since {user.joinedDate}</p>

        <Button
          variant="outline"
          size="sm"
          className="mt-4 flex items-center gap-1"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-3 w-3" />
          Edit Profile
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-4">
          {isEditing ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="h-1 w-12 rounded-full bg-primary"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{user.joinedDate}</p>
                    </div>
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <Button variant="destructive" className="w-full flex items-center justify-center gap-2">
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-expenses" className="flex-1">
                    New expenses
                  </Label>
                  <Switch id="new-expenses" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="group-invites" className="flex-1">
                    Group invitations
                  </Label>
                  <Switch id="group-invites" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="monthly-summary" className="flex-1">
                    Monthly summary
                  </Label>
                  <Switch id="monthly-summary" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Privacy</h3>
                  <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-profile" className="flex-1">
                    Show profile to group members
                  </Label>
                  <Switch id="show-profile" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-expenses" className="flex-1">
                    Show my expenses to group members
                  </Label>
                  <Switch id="show-expenses" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-gradient-to-br from-teal-800/70 to-emerald-700/70 text-white">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-white/80">Total Expenses</p>
                <p className="text-3xl font-bold">R$ 3,450.75</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-sky-800/70 to-blue-700/70 text-white">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-white/80">Active Groups</p>
                <p className="text-3xl font-bold">3</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-rose-800/70 to-pink-700/70 text-white">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-white/80">This Month</p>
                <p className="text-3xl font-bold">R$ 1,234.56</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium">Expense Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm">Food</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-600" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm">Transportation</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm">Entertainment</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-pink-600" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm">Others</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-amber-600" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

