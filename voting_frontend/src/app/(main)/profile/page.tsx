"use client";

import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Vote,
  CheckCircle2,
  Clock,
  Lock,
  TrendingUp,
  ChevronRight,
  Award,
  Eye,
  Users,
  Fingerprint,
  Settings,
  Smartphone,
  Mail,
  Camera,
  Loader2,
} from "lucide-react";
import { getProfile, updateProfilePicture } from "@/app/_apis/routes/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Vote, label: "Total votes cast", value: "47" },
  { icon: CheckCircle2, label: "Elections won", value: "31" },
  { icon: Eye, label: "Elections observed", value: "12" },
  { icon: TrendingUp, label: "Participation streak", value: "9 mo" },
];

const VOTE_HISTORY = [
  {
    id: 1,
    title: "National Student Union — President",
    org: "Delhi University",
    date: "Apr 10, 2026",
    voted: true,
    result: "Won",
  },
  {
    id: 2,
    title: "Board of Directors — 3 Seats",
    org: "TechCorp India",
    date: "Mar 28, 2026",
    voted: true,
    result: "Won",
  },
  {
    id: 3,
    title: "City Council Referendum",
    org: "Mumbai Civic Body",
    date: "Feb 14, 2026",
    voted: true,
    result: "Lost",
  },
  {
    id: 4,
    title: "Community Budget Allocation",
    org: "Koramangala DAO",
    date: "Jan 5, 2026",
    voted: false,
    result: "Missed",
  },
  {
    id: 5,
    title: "Annual Faculty Senate Vote",
    org: "IIT Bombay",
    date: "Dec 12, 2025",
    voted: true,
    result: "Won",
  },
];

const ACTIVE_ELECTIONS = [
  {
    id: 1,
    title: "Municipal Water Board — Chairman",
    org: "Pune Municipal Corporation",
    deadline: "Apr 18, 2026",
    daysLeft: 5,
    voted: false,
  },
  {
    id: 2,
    title: "Open Source Foundation — Steering Committee",
    org: "FOSS India",
    deadline: "Apr 22, 2026",
    daysLeft: 9,
    voted: true,
  },
];

const ACTIVITY = [
  {
    text: "Voted in National Student Union election",
    time: "2 days ago",
    icon: Vote,
  },
  {
    text: "Identity re-verified via Aadhaar",
    time: "1 week ago",
    icon: Fingerprint,
  },
  { text: "Earned Civic Champion badge", time: "2 weeks ago", icon: Award },
  {
    text: "Joined Board of Directors election",
    time: "3 weeks ago",
    icon: Users,
  },
  {
    text: "Profile verified by VoteFlow",
    time: "1 month ago",
    icon: ShieldCheck,
  },
];

const VERIFICATIONS = [
  { label: "Government ID", icon: Fingerprint, ok: true },
  { label: "Phone number", icon: Smartphone, ok: true },
  { label: "Email address", icon: Mail, ok: true },
  { label: "2FA enabled", icon: Lock, ok: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resultStyles(result: string) {
  if (result === "Won")
    return "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25";
  if (result === "Lost")
    return "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25";
  return "bg-zinc-100 dark:bg-zinc-700/30 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50";
}

// ─── Trust score card ─────────────────────────────────────────────────────────

function TrustScore({ score }: { score: number }) {
  return (
    <Card className="border-zinc-200 dark:border-white/8 bg-white dark:bg-white/4 shadow-none">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Trust score
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            {score}
            <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal">
              /100
            </span>
          </span>
        </div>
        <Progress
          value={score}
          className="h-1.5 bg-zinc-100 dark:bg-white/10 rounded-full
                     [&>div]:bg-emerald-500 [&>div]:rounded-full"
        />
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Verified identity · Consistent participation · No disputes
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const user = userData?.user;

  console.log("User data:", user);

  const [tab, setTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    country: user?.country || "",
  });

  // Mutation for uploading profile picture
  const uploadProfilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,

    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile picture updated successfully!");
      setUploadingImage(false);
    },
    onError: (error: Error | null) => {
      toast.error(error);
      setUploadingImage(false);
    },
  });

  const handleEditProfileClick = () => {
    setEditFormData({
      name: user?.name || "",
      email: user?.email || "",
      country: user?.country || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile
    console.log("Saving profile:", editFormData);
    setIsEditDialogOpen(false);
  };

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image file");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should not exceed 5MB");
          return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append("id", user?._id);
        formData.append("image", file);

        uploadProfilePictureMutation.mutate(formData);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadProfilePictureMutation, user?._id],
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        {/* Emerald gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-700 via-emerald-800 to-zinc-900 opacity-90" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Glow blob */}
        <div className="pointer-events-none absolute -top-16 -left-8 h-72 w-72 rounded-full bg-emerald-400/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-72 rounded-full bg-black/30 blur-[70px]" />

        {/* Hero pills — bottom right */}
        <div className="absolute bottom-5 right-6 hidden sm:flex gap-2.5">
          {["47 votes cast", "9 mo streak", "98 trust score"].map((p) => (
            <span
              key={p}
              className="rounded-full bg-white/10 border border-white/20
                         px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5">
        {/* ── Profile header ───────────────────────────────────────────── */}
        <div className="relative -mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                aria-label="Upload profile image"
                disabled={uploadingImage}
              />

              <button
                onClick={handleAvatarClick}
                disabled={uploadingImage}
                className="relative cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                <Avatar className="h-22 w-22 border-[3px] border-zinc-50 dark:border-zinc-950 shadow-lg">
                  <AvatarImage src={user?.image} alt="Profile picture" />
                  <AvatarFallback className="bg-emerald-600 dark:bg-emerald-700 text-[22px] font-bold text-white">
                    {user?.name
                      ?.split(" ")
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Overlay with camera icon or loader */}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  {uploadingImage ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </div>
              </button>

              {user?.verified && (
                <span
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center
                                 rounded-full border-2 border-zinc-50 dark:border-zinc-950 bg-emerald-500"
                >
                  <ShieldCheck className="h-3 w-3 text-white" />
                </span>
              )}
            </div>

            {/* Meta */}

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 dark:text-white">
                {user?.name}
              </h1>
              <Badge
                className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400
                                  border border-emerald-200 dark:border-emerald-500/25 text-[11px] font-medium px-2.5"
              >
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 ">
            <Button
              onClick={handleEditProfileClick}
              variant="outline"
              size="sm"
              className="border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5
                         text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/10
                         text-xs shadow-none cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Edit profile
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600
                         text-white text-xs shadow-none"
            >
              <Vote className="h-3.5 w-3.5 mr-1.5" />
              Vote now
            </Button>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <Card
              key={s.label}
              className="border-zinc-200 dark:border-white/8 bg-white dark:bg-white/4
                         hover:border-emerald-400/50 dark:hover:border-emerald-600/50
                         transition-colors shadow-none group"
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div
                  className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10
                                flex items-center justify-center"
                >
                  <s.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {s.value}
                </span>
                <span className="text-[11px] text-zinc-500 leading-tight">
                  {s.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mt-7 bg-zinc-200 dark:bg-white/8" />

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <Tabs value={tab} onValueChange={setTab} className="mt-5">
          <TabsList
            className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/8
                       rounded-xl p-1 gap-0.5"
          >
            {["overview", "history", "activity"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-lg px-5 py-2 text-[13px] capitalize
                           text-zinc-500 dark:text-zinc-400
                           data-[state=active]:bg-emerald-600 dark:data-[state=active]:bg-emerald-700
                           data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Overview ────────────────────────────────────────────── */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              {/* Active elections */}
              <div className="flex flex-col gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Active elections
                </h2>
                {ACTIVE_ELECTIONS.map((el) => (
                  <Card
                    key={el.id}
                    className="border-zinc-200 dark:border-white/8 bg-white dark:bg-white/4
                               hover:border-emerald-400/50 dark:hover:border-emerald-600/50
                               transition-colors shadow-none"
                  >
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">
                          {el.title}
                        </p>
                        <p className="text-[12px] text-zinc-500">{el.org}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          <span className="text-[12px] text-zinc-500">
                            {el.deadline}
                          </span>
                          {el.daysLeft <= 5 && !el.voted && (
                            <Badge
                              className="bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400
                                              border border-red-200 dark:border-red-500/25 text-[10px] px-2 font-medium"
                            >
                              {el.daysLeft}d left
                            </Badge>
                          )}
                          {el.voted && (
                            <Badge
                              className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400
                                              border border-emerald-200 dark:border-emerald-500/25 text-[10px] px-2 font-medium"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                              Voted
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!el.voted && (
                        <Button
                          size="sm"
                          className="shrink-0 bg-emerald-600 hover:bg-emerald-700
                                     dark:bg-emerald-700 dark:hover:bg-emerald-600
                                     text-white text-[12px] shadow-none"
                        >
                          Vote
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Trust &amp; security
                </h2>
                <TrustScore score={user?.trustScore} />

                <Card className="border-zinc-200 dark:border-white/8 bg-white dark:bg-white/4 shadow-none">
                  <CardContent className="p-5 flex flex-col gap-1">
                    <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 mb-3">
                      Verification status
                    </p>
                    {VERIFICATIONS.map((v) => (
                      <div
                        key={v.label}
                        className="flex items-center justify-between py-2
                                   border-b border-zinc-100 dark:border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                          <v.icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
                          {v.label}
                        </div>
                        <Badge
                          className={
                            v.ok
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 text-[10px] px-2"
                              : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25 text-[10px] px-2"
                          }
                        >
                          {v.ok ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── History ─────────────────────────────────────────────── */}
          <TabsContent value="history" className="mt-6">
            <div className="flex flex-col gap-2">
              {VOTE_HISTORY.map((v) => (
                <Card
                  key={v.id}
                  className="border-zinc-200 dark:border-white/8 bg-white dark:bg-white/4
                             hover:border-emerald-400/50 dark:hover:border-emerald-600/50
                             transition-colors shadow-none"
                >
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          v.voted
                            ? "bg-emerald-50 dark:bg-emerald-500/15"
                            : "bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <Vote
                          className={`h-4 w-4 ${
                            v.voted
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-400 dark:text-zinc-600"
                          }`}
                        />
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-zinc-900 dark:text-white">
                          {v.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {v.org}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge
                        className={`text-[10px] px-2 ${resultStyles(v.result)}`}
                      >
                        {v.result}
                      </Badge>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                        {v.date}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Activity ────────────────────────────────────────────── */}
          <TabsContent value="activity" className="mt-6">
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                                 bg-emerald-50 dark:bg-emerald-500/10
                                 border border-emerald-200 dark:border-emerald-500/25"
                    >
                      <a.icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </span>
                    {i < ACTIVITY.length - 1 && (
                      <div className="w-px flex-1 bg-zinc-200 dark:bg-white/8 my-1.5" />
                    )}
                  </div>
                  <div className="pb-6 pt-0.5 flex flex-col gap-0.5">
                    <p className="text-[13px] text-zinc-800 dark:text-zinc-200">
                      {a.text}
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Edit Profile Dialog ──────────────────────────────────── */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md border-zinc-200 dark:border-white/8 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Edit Profile
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  placeholder="Enter your full name"
                  className="border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5
                             text-zinc-900 dark:text-white placeholder:text-zinc-400
                             dark:placeholder:text-zinc-600"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  placeholder="Enter your email address"
                  className="border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5
                             text-zinc-900 dark:text-white placeholder:text-zinc-400
                             dark:placeholder:text-zinc-600"
                />
              </div>

              {/* Country Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Country
                </label>
                <Input
                  type="text"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditFormChange}
                  placeholder="Enter your country"
                  className="border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5
                             text-zinc-900 dark:text-white placeholder:text-zinc-400
                             dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300
                           hover:bg-zinc-50 dark:hover:bg-white/5 shadow-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 
                           dark:hover:bg-emerald-600 text-white shadow-none"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-16" />
      </div>
    </div>
  );
}
