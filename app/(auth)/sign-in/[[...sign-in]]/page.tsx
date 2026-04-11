import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090b0e]">
      <SignIn 
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: 
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "bg-[#121418] border border-white/5 shadow-2xl",
            headerTitle: "text-white font-bold",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: 
              "bg-[#181a1f] border border-white/5 text-white hover:bg-[#22252b]",
            dividerLine: "bg-white/10",
            footerActionLink: "text-blue-400 hover:text-blue-300"
          }
        }}
      />
    </div>
  );
}