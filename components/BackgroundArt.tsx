import React from 'react';

const BackgroundArt: React.FC = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b1e] via-[#121638] to-[#1a0e2a]" />

      {/* Subtle texture / image overlay (replace URL with your own /public asset if you like) */}
      <img
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2400&auto=format&fit=crop"
        className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
        alt=""
      />

      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 h-[48rem] w-[48rem] rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-[42rem] w-[42rem] rounded-full bg-violet-400/20 blur-3xl" />

      {/* Light beams */}
      <div className="absolute -rotate-12 top-0 left-1/3 h-[120%] w-1 bg-white/10 blur-sm" />
      <div className="absolute rotate-12 top-0 left-2/3 h-[120%] w-1 bg-white/10 blur-sm" />
    </div>
  );
};

export default BackgroundArt;
