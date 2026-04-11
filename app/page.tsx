import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">PixelAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/social-share" 
            className="px-5 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-slate-200 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            ✨ Now with AI Smart-Cropping
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Stop wasting hours <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              resizing images.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            PixelAI uses advanced neural networks to automatically detect subjects and resize your photos for Instagram, Twitter, and LinkedIn in one click.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/social-share" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              Start Creating Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-lg text-slate-300">
              Watch Demo
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              Trusted by <span className="text-slate-300 font-bold">2,000+</span> creators
            </p>
          </div>
        </div>

        {/* Feature Preview (Right Side) */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-30 animate-pulse" />
          <div className="relative bg-slate-900 border border-slate-800 rounded-[2rem] p-4 shadow-2xl overflow-hidden">
             {/* Mock UI for Social Formats */}
             <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-xs">Instagram 1:1</div>
                <div className="aspect-[4/5] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-xs">Portrait 4:5</div>
                <div className="aspect-[16/9] col-span-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-xs">Twitter 16:9</div>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 PixelAI. Powered by Cloudinary & Next.js.
        </div>
      </footer>
    </div>
  );
}