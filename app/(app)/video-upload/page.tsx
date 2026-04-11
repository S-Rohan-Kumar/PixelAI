"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  Film, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard 
} from "lucide-react";
import toast from "react-hot-toast";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 70MB limit");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      
      toast.success("Video uploaded successfully!");
      router.push("/home"); 
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Upload Video</h1>
        <p className="text-slate-400 text-sm">
          Share your masterpieces with the PixelAI community. AI will optimize your bitrate automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-blue-500" />
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your video a catchy name"
            className="w-full bg-[#121418] border border-white/5 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-700"
            required
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <LayoutDashboard size={14} className="text-blue-500" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What is this video about?"
            className="w-full bg-[#121418] border border-white/5 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-700 resize-none"
          />
        </div>

        {/* Video File Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Film size={14} className="text-blue-500" />
            Video File
          </label>
          <div className="relative group">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className={`border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center bg-[#090b0e]/50 ${
              file ? "border-blue-500/40 bg-blue-500/5" : "border-white/5 hover:border-white/10"
            }`}>
              {file ? (
                <>
                  <CheckCircle2 className="text-blue-500 mb-4" size={40} />
                  <p className="text-blue-400 font-bold text-sm">{file.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#121418] rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
                    <Upload className="text-slate-600 group-hover:text-blue-400" size={28} />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-600 mt-2">MP4, WebM or Ogg (Max 70MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={22} />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <Upload size={22} />
              <span>Publish Video</span>
            </>
          )}
        </button>
      </form>
      
      {/* Informational Footer */}
      <div className="mt-8 flex items-center justify-center gap-6 text-slate-600">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter">
            <AlertCircle size={12} />
            Secure Upload
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter">
            <CheckCircle2 size={12} />
            Auto-Optimization
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;