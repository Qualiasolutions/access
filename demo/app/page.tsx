import Image from 'next/image';
import Link from 'next/link';
import VoiceAgent from './components/VoiceAgent';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Image
              src="https://images.squarespace-cdn.com/content/v1/65bf52f873aac538961445c5/19d16cc5-aa83-437c-9c2a-61de5268d5bf/Untitled+design+-+2025-01-19T070746.544.png?format=1500w"
              alt="Qualia Solutions"
              width={80}
              height={27}
              className="object-contain sm:w-[100px]"
            />
            <nav className="flex gap-0.5 sm:gap-1">
              <Link href="/" className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-teal-50 text-teal-700 font-medium rounded-lg">
                Demo
              </Link>
              <Link href="/leads" className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Leads
              </Link>
              <Link href="/calendar" className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Calendrier
              </Link>
            </nav>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Acces Croisieres et Voyages</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-10 max-w-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
            Sophie, votre conseillere voyage
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
            Assistant vocal intelligent pour Acces Croisieres et Voyages. Parlez naturellement en francais ou anglais.
          </p>
        </div>

        {/* Voice Agent */}
        <div className="w-full max-w-3xl">
          <VoiceAgent />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-100 bg-white/50">
        <div className="max-w-lg mx-auto">
          {/* Demo disclaimer */}
          <div className="bg-amber-50/80 border border-amber-200/50 rounded-lg px-3 py-2 mb-4">
            <p className="text-[10px] md:text-xs text-amber-700 text-center leading-relaxed">
              <span className="font-semibold">Demo</span> — Demonstration uniquement. Aucune reservation reelle traitee.
            </p>
          </div>

          {/* Powered by */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Powered by
            </p>
            <a
              href="https://qualiasolutions.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="https://images.squarespace-cdn.com/content/v1/65bf52f873aac538961445c5/19d16cc5-aa83-437c-9c2a-61de5268d5bf/Untitled+design+-+2025-01-19T070746.544.png?format=1500w"
                alt="Qualia Solutions"
                width={80}
                height={26}
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
