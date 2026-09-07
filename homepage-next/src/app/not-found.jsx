import Link from 'next/link';

export const metadata = {
  title: '404 — zkvm.host',
};

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center font-mono">
        <div className="text-[#00ff41] text-5xl mb-4">404</div>
        <p className="text-gray-400 text-sm mb-8">This route doesn&apos;t exist -- but the real project does.</p>
        <Link href="/" className="px-6 py-2 bg-[#00ff41] text-black font-bold text-xs hover:bg-[#00ff41]/80 transition-colors">
          BACK TO HOME
        </Link>
      </div>
    </section>
  );
}
