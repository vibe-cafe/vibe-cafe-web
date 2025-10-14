import fs from 'node:fs';
import path from 'node:path';
import BackButton from '@/components/BackButton';
import PlacesList from './PlacesList';

type Place = {
  id: string;
  title: string;
  description?: string;
  address_text: string;
  latitude?: number;
  longitude?: number;
  cost_per_person?: number;
  opening_hours?: string;
  link?: string;
  image?: string;
};

export const dynamic = 'force-static';

function loadPlaces(): Place[] {
  const root = process.cwd();
  const jsonPath = path.resolve(root, 'data', 'places.json');
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Place[];
    return raw.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  }
  return [];
}

export default function PlacesPage() {
  const places = loadPlaces();

  return (
    <main className="min-h-screen bg-black text-white">
      <BackButton />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Vibe Places
          </h1>
          <p className="text-zinc-300 mt-2">适合 Vibe Friends 的创作空间</p>
          <hr className="mt-6 border-zinc-800" />
        </header>

        <section aria-label="地点列表">
          <PlacesList places={places} />
        </section>
      </div>
    </main>
  );
}
