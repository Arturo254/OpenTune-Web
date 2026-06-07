import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141317] text-[#e5e1e7] flex items-center justify-center px-8 py-16">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Text content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
          <div className="inline-flex items-center gap-2 bg-[#4a4359] text-[#bab1ca] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6">
            <span className="material-symbols-outlined text-[16px]">error</span>
            Error 404
          </div>
          <h1 className="text-[72px] md:text-[96px] lg:text-[120px] font-black leading-none text-[#d0bcff] font-['Epilogue'] mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#e9ddff] font-['Epilogue'] mb-3">
            Page not found
          </h2>
          <p className="text-[#cac4d0] text-base md:text-lg mb-8 leading-relaxed">
            Whoops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/en"
              className="inline-flex items-center justify-center gap-2 bg-[#d0bcff] text-[#37265e] font-semibold px-7 py-3.5 rounded-full transition-all hover:brightness-110 active:scale-95 no-underline"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>home</span>
              Go to Home
            </Link>
            <a
              href="https://github.com/Arturo254/OpenTune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#49454f] text-[#cac4d0] font-medium px-7 py-3.5 rounded-full transition-all hover:bg-white/5 active:scale-95 no-underline"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_new</span>
              GitHub
            </a>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-shrink-0 w-full max-w-xs md:max-w-sm lg:max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-[#d0bcff]/10 blur-[80px] rounded-full" />
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
              alt="404 illustration"
              className="relative w-full opacity-80"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
