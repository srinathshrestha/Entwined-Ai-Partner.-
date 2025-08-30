"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Lock, Palette, Save, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Hue gradient options for user profiles
const PROFILE_GRADIENTS = [
  { id: "sunset", name: "Sunset", gradient: "from-orange-400 via-red-500 to-pink-500" },
  { id: "ocean", name: "Ocean", gradient: "from-blue-400 via-blue-500 to-cyan-500" },
  { id: "forest", name: "Forest", gradient: "from-green-400 via-emerald-500 to-teal-500" },
  { id: "purple", name: "Purple", gradient: "from-purple-400 via-violet-500 to-purple-600" },
  { id: "golden", name: "Golden", gradient: "from-yellow-400 via-orange-500 to-red-500" },
  { id: "mint", name: "Mint", gradient: "from-emerald-400 via-cyan-500 to-blue-500" },
  { id: "rose", name: "Rose", gradient: "from-pink-400 via-rose-500 to-red-500" },
  { id: "cosmic", name: "Cosmic", gradient: "from-indigo-400 via-purple-500 to-pink-500" },
];

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  gradientId: string;
  joinedAt?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    gradientId: "sunset",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [emailUpdate, setEmailUpdate] = useState({
    newEmail: "",
    password: "",
  });
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          gradientId: profile.gradientId,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!emailUpdate.newEmail || !emailUpdate.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailUpdate),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Verification email sent! Please check your inbox.");
        setShowEmailDialog(false);
        setEmailUpdate({ newEmail: "", password: "" });
      } else {
        toast.error(data.error || "Failed to update email");
      }
    } catch (error) {
      toast.error("Error updating email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password updated successfully!");
        setShowPasswordDialog(false);
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const selectedGradient = PROFILE_GRADIENTS.find(g => g.id === profile.gradientId) || PROFILE_GRADIENTS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedGradient.gradient} flex items-center justify-center`}>
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="bg-transparent text-white text-lg font-semibold">
                        {profile.name.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Badge variant="secondary">{selectedGradient.name} Theme</Badge>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Display */}
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center justify-between">
                    <Input value={profile.email} disabled className="bg-muted" />
                    <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-2">
                          <Mail className="h-4 w-4 mr-1" />
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Email Address</DialogTitle>
                          <DialogDescription>
                            We&apos;ll send a verification email to your new address.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newEmail">New Email Address</Label>
                            <Input
                              id="newEmail"
                              type="email"
                              value={emailUpdate.newEmail}
                              onChange={(e) => setEmailUpdate(prev => ({ ...prev, newEmail: e.target.value }))}
                              placeholder="Enter new email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="emailPassword">Current Password</Label>
                            <Input
                              id="emailPassword"
                              type="password"
                              value={emailUpdate.password}
                              onChange={(e) => setEmailUpdate(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Enter your password"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEmailUpdate} disabled={loading}>
                            <Shield className="h-4 w-4 mr-2" />
                            Send Verification
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                        <DialogDescription>
                          Choose a strong password to keep your account secure.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwords.current}
                              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwords.new}
                              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwords.confirm}
                              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                              placeholder="Confirm new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePasswordUpdate} disabled={loading}>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Save Button */}
                <Button onClick={handleProfileUpdate} disabled={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Profile Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {PROFILE_GRADIENTS.map((gradient) => (
                    <motion.div
                      key={gradient.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all ${
                        profile.gradientId === gradient.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setProfile(prev => ({ ...prev, gradientId: gradient.id }))}
                    >
                      <div className={`w-full h-16 rounded-md bg-gradient-to-br ${gradient.gradient} mb-2`} />
                      <p className="text-sm font-medium text-center">{gradient.name}</p>
                      {profile.gradientId === gradient.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
