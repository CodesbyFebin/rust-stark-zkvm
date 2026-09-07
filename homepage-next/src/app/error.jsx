'use client';

const REPO = 'https://github.com/CodesbyFebin/rust-stark-zkvm';

export default function Error() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono flex items-center justify-center px-6">
      <div className="max-w-md text-center border border-[#00ff41]/30 bg-black/80 p-8">
        <div className="text-[#00ff41] text-xl mb-3">zkvm.host</div>
        <p className="text-sm text-gray-400 mb-6">
          This page hit a rendering error. The actual project isn&apos;t affected —
          the source and docs are always on GitHub.
        </p>
        <a
          href={REPO}
          className="inline-block px-6 py-2 border border-[#00ff41]/40 text-[#00ff41] text-xs hover:bg-[#00ff41]/10"
        >
          VIEW ON GITHUB
        </a>
      </div>
    </div>
  );
}
