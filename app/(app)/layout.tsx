"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClerkProvider, useClerk, useUser } from "@clerk/nextjs";
import {
  Video,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserCircle,
  ExternalLink,
} from "lucide-react";

const sidebarItems = [
  { label: "Home Page", href: "/home", icon: LayoutDashboard },
  { label: "Social Share", href: "/social-share", icon: ImageIcon },
  { label: "Video Upload", href: "/video-upload", icon: Video },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();      // For the logout button functionality
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-[#0f1115] text-slate-200 flex">
        {/* SIDEBAR - Darker than content */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#090b0e] border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section matching the Icon in image */}
            <div className="p-8 mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <ImageIcon className="text-blue-400 w-7 h-7" />
              </div>
            </div>

            {/* Navigation Items - Pill style with margins */}
            <nav className="flex-1 px-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[15px] font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-6">
              <button className="flex items-center gap-4 text-slate-500 hover:text-red-400 transition-colors px-4 py-2">
                <LogOut className="w-5 h-5" />
                <span className="text-[15px] font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA - Lighter shade than sidebar */}
        <main
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
        >
          {/* HEADER - Transparent with contrast items */}
          <header className="w-full px-12 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-slate-400"
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </button>
              <h2 className="text-2xl font-bold text-slate-200 tracking-tight">
                PixelAI Showcase
              </h2>
            </div>

            {/* Profile Section in the Top Right */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                {/* Dynamic User Avatar / Icon */}
                <div className="w-8 h-8 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Dynamic User Name or Email */}
                <span className="text-sm font-medium text-slate-400">
                  {!isLoaded ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    user?.username ||
                    user?.primaryEmailAddress?.emailAddress ||
                    "Guest"
                  )}
                </span>
              </div>

              {/* Sign Out Button Icon */}
              <button
                onClick={handleSignOut}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* PAGE WRAPPER - Matches the dark card style */}
          <div className="px-12 pb-12 flex-1">
            <div className="bg-[#181a1f] min-h-[calc(100vh-140px)] rounded-3xl border border-white/5 p-12 shadow-2xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
