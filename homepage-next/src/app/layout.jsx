import MatrixRain from '../components/MatrixRain';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './globals.css';

// Every page below sets metadata.title as the full "<Title> — zkvm.host"
// string directly rather than relying on Next's title.template merging --
// that mechanism did not reliably apply to the <title> tag in this
// static-export setup (og:title picked up a manually-suffixed string fine;
// the plain <title> tag did not inherit the template). Explicit per-page
// titles are more reliable here.
export const metadata = {
  metadataBase: new URL('https://www.zkvm.host'),
  title: 'zkvm.host — Open-Source STARK Proving Infrastructure',
  description:
    'A real, open-source STARK-provable zero-knowledge virtual machine written in Rust, built on Winterfell. A custom instruction set, a from-scratch AIR, a CLI, an HTTP proving service, and MCP tools.',
  robots: 'index, follow',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: { siteName: 'zkvm.host' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-gray-200 font-sans overflow-x-hidden">
        <MatrixRain />

        <div
          className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)' }}
        />

        <Nav />

        {children}

        <Footer />
      </body>
    </html>
  );
}
