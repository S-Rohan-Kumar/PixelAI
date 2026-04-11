"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { 
  Upload, 
  Download, 
  Smartphone, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon 
} from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, selectedFormat]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current || !selectedFormat) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Page Header Container */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 px-3 py-1 w-fit rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles size={12} className="animate-pulse" />
          AI-Powered Transform
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Social Share Pro
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Upload once, resize for every platform. PixelAI uses smart-cropping to keep your subjects perfectly centered.
        </p>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: Configuration Controls */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Step 1: Upload */}
          <div className="bg-[#121418] border border-white/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              Source Image
            </h3>
            <div className="relative group border-2 border-dashed border-white/5 hover:border-blue-500/40 rounded-xl p-8 transition-all bg-[#090b0e]/50 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <Upload className="mx-auto mb-3 text-slate-600 group-hover:text-blue-400 transition-colors" size={28} />
              <p className="text-sm font-semibold text-slate-300">
                {isUploading ? "Uploading..." : "Click to select"}
              </p>
              <p className="text-[10px] text-slate-600 mt-2">Maximum file size: 10MB</p>
            </div>
          </div>

          {/* Step 2: Format Selection */}
          <div className={`bg-[#121418] border border-white/5 rounded-2xl p-6 shadow-sm transition-all duration-500 ${!uploadedImage ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              Platform Format
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(Object.keys(socialFormats) as SocialFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedFormat === format
                      ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20"
                      : "bg-[#090b0e] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={14} className={selectedFormat === format ? "text-white" : "text-slate-600"} />
                    {format}
                  </div>
                  <span className="text-[10px] opacity-40 font-mono">{socialFormats[format].aspectRatio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={!uploadedImage || isTransforming || !selectedFormat}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 group"
          >
            {isTransforming ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Download Final Asset
              </>
            )}
          </button>
        </div>

        {/* Right Side: Preview Canvas */}
        <div className="xl:col-span-8 relative min-h-[500px] bg-[#090b0e] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          {!uploadedImage ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#121418] border border-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <ImageIcon className="text-slate-800" size={32} />
              </div>
              <p className="text-slate-600 text-sm font-medium tracking-wide">
                Preview will appear here
              </p>
            </div>
          ) : (
            <div className={`relative transition-all duration-700 ${isTransforming ? "scale-95 blur-md opacity-40" : "scale-100 blur-0 opacity-100"}`}>
              <CldImage
                width={selectedFormat ? socialFormats[selectedFormat].width : 1000}
                height={selectedFormat ? socialFormats[selectedFormat].height : 1000}
                src={uploadedImage}
                sizes="100vw"
                alt="AI Transformation"
                crop="fill"
                aspectRatio={selectedFormat ? socialFormats[selectedFormat].aspectRatio : "1:1"}
                gravity="auto"
                ref={imageRef}
                onLoadingComplete={() => setIsTransforming(false)}
                className="max-h-[60vh] rounded-lg shadow-2xl border border-white/10 object-contain"
              />
            </div>
          )}

          {isTransforming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#090b0e]/40 backdrop-blur-sm">
              <Loader2 className="text-blue-500 animate-spin" size={40} />
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                AI Smart Cropping...
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-6 text-[9px] text-slate-700 font-mono uppercase tracking-widest">
            Render Mode: Hardware Accelerated
          </div>
        </div>
      </div>
    </div>
  );
}