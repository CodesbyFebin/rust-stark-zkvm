import PageHero from '../../components/PageHero';
import PlaygroundDemo from '../../components/PlaygroundDemo';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'zkvm.host Proof Playground',
  description: 'An in-browser, simulated walk through the real proving pipeline stages using real zkasm opcodes. Does not generate an actual STARK proof.',
  url: 'https://www.zkvm.host/playground',
  isPartOf: { '@type': 'WebSite', name: 'zkvm.host', url: 'https://www.zkvm.host/' },
};

const TITLE = 'Proof Playground — zkvm.host';
const DESCRIPTION = 'Run a tiny program with real opcodes in your browser and watch the real proving pipeline stages animate -- simulated, not a real proof.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.zkvm.host/playground' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://www.zkvm.host/playground' },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function Playground() {
  return (
    <section className="relative py-32 px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <div className="max-w-5xl mx-auto">
        <PageHero
          eyebrow="Proof Playground (Simulated)"
          title="BUILD."
          accent="PROVE. VERIFY."
          dek="Enter a tiny program using real opcodes (INIT/ADD/SUB/MUL). This runs the arithmetic in your browser and animates the real pipeline stages -- it does not generate or verify an actual STARK proof."
        />

        <PlaygroundDemo />
      </div>
    </section>
  );
}
