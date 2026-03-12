export function Footer() {
  return (
    <footer className="bg-[#0f2233] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center gap-4">
        <p className="text-white/40 text-xs tracking-widest uppercase font-semibold">
          © {new Date().getFullYear()} PakiPark. All Rights Reserved.
        </p>
        <span className="text-white/20 text-xs">|</span>
        <a href="#" className="text-white/40 text-xs tracking-widest uppercase font-semibold hover:text-[#ee6b20] transition-colors underline underline-offset-2">
          Terms of Use
        </a>
        <span className="text-white/20 text-xs">|</span>
        <a href="#" className="text-white/40 text-xs tracking-widest uppercase font-semibold hover:text-[#ee6b20] transition-colors underline underline-offset-2">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}