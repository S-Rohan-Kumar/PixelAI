"use client";

import React, { useState, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Zap } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize as formatSizeLib } from "filesize"; 
import { Video } from "@prisma/client";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const formatFilesize = useCallback((size: number | string) => {
    return formatSizeLib(Number(size));
  }, []);

  const getThumbnailURL = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 300,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getPreviewURL = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_5:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  return (
    <div
      className="group bg-[#181a1f] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container */}
      <div className="relative aspect-video bg-[#090b0e] overflow-hidden">
        {isHovered && !previewError ? (
          <video
            src={getPreviewURL(video.publicId)}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover transition-transform duration-700 scale-105"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <img
            src={getThumbnailURL(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
            <Clock size={10} className="text-blue-400" />
            {formatDuration(video.duration)}
          </div>
        </div>

        {compressionPercentage > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 rounded-lg text-[10px] font-black text-white shadow-lg flex items-center gap-1">
            <Zap size={10} fill="white" />
            {compressionPercentage}% SAVED
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[#121418] p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-1 text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">
              <FileUp size={10} /> Original
            </div>
            <div className="text-xs font-mono text-slate-300">
              {formatFilesize(video.originalSize)}
            </div>
          </div>
          <div className="bg-[#121418] p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-1 text-[9px] text-blue-500 uppercase font-bold tracking-widest mb-1">
              <FileDown size={10} /> Optimized
            </div>
            <div className="text-xs font-mono text-blue-400">
              {formatFilesize(video.compressedSize)}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-slate-600 font-medium">
            {dayjs(video.createdAt).fromNow()}
          </span>
          <button
            onClick={() => onDownload(getCldVideoUrl({ src: video.publicId }), video.title)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5 hover:border-blue-500 active:scale-95"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;