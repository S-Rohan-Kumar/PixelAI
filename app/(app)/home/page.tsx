"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import { Loader2, Zap, Film } from "lucide-react";
import { Video } from "@prisma/client";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Film className="text-blue-500" size={32} />
            Public Feed
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Explore what the <span className="text-blue-400 font-semibold">PixelAI</span> community is creating.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#121418] border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-300 shadow-xl">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
          Trending Now
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <div className="absolute inset-0 blur-2xl bg-blue-500/20 animate-pulse" />
          </div>
          <p className="text-slate-500 font-medium animate-pulse tracking-wide">
            Scanning the airwaves...
          </p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#090b0e]/50 rounded-[2rem] border-2 border-dashed border-white/5">
          <Film className="text-slate-800 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">No videos found.</p>
          <p className="text-slate-600 text-sm">Be the first to upload a masterpiece!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onDownload={handleDownload} 
            />
          ))}
        </div>
      )}
    </div>
  );
}