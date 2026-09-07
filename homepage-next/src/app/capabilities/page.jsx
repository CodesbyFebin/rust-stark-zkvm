import Link from 'next/link';
import PageHero from '../../components/PageHero';
import CapabilitiesBoard from '../../components/CapabilitiesBoard';
import { REPO } from '../../lib/constants';
import { ITEMS } from '../../lib/capabilities-data';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'zkVM Capability Status',
  description: 'Every real capability of rust-stark-zkvm, honestly labeled implemented, roadmap, research, or not planned -- no item marked done unless it actually is.',
  url: 'https://www.zkvm.host/capabilities',
};

const TITLE = 'Capability Status — zkvm.host';
const DESCRIPTION = 'Every real capability of this zkVM, honestly labeled implemented, roadmap, research, or not planned. Searchable and filterable -- no item marked done unless it actually is.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.zkvm.host/capabilities' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://www.zkvm.host/capabilities' },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function Capabilities() {
  return (
    <section className="relative py-32 px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <div className="max-w-5xl mx-auto">
        <PageHero
          eyebrow="Capability Status"
          title="WHAT'S ACTUALLY"
          accent="BUILT"
          dek={`${ITEMS.length} real capabilities, each labeled honestly. Nothing here is marked done unless it is -- and nothing marked "not planned" is quietly reframed as coming soon.`}
        />

        <CapabilitiesBoard />

        <div className="mt-16 text-center font-mono text-xs text-gray-500">
          Every item here is sourced from real docs already on this site --{' '}
          <Link href="/roadmap" className="text-[#00ff41] underline">Roadmap</Link>,{' '}
          <Link href="/threat-model" className="text-[#00ff41] underline">Threat Model</Link>,{' '}
          <Link href="/onchain-verifier" className="text-[#00ff41] underline">On-Chain Verifier</Link>,{' '}
          <Link href="/recursion" className="text-[#00ff41] underline">Recursion</Link> -- nothing new was invented for this page,
          it&apos;s just a browsable index of claims made elsewhere.
          Full source: <a className="text-[#00ff41] underline" href={REPO}>GitHub</a>.
        </div>
      </div>
    </section>
  );
}
