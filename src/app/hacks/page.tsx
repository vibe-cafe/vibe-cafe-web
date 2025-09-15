import fs from 'node:fs';
import path from 'node:path';
import BackButton from '@/components/BackButton';
import ProjectWall from './ProjectWall';
import { marked } from 'marked';

// CSV types removed

type Project = {
  id: string;
  title: string;
  descriptionHtml: string;
  teamName: string;
  imageDataUrls: string[];
  githubUrl?: string;
  xhsUrl?: string;
};

export const dynamic = 'force-static';

// CSV helpers removed; using JSON + public images

function loadProjects(): Project[] {
  const root = process.cwd();
  const jsonPath = path.resolve(root, 'data', 'hacks', 'projects.json');
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Array<{
      id: string;
      title: string;
      description: string;
      team_name: string;
      images: string[];
      github_url?: string;
      xiaohongshu_project_sharing_url?: string;
    }>;
    const projects = raw.map((r) => {
      const descriptionHtml = marked.parse(r.description || '');
      return {
        id: r.id,
        title: r.title || 'Untitled',
        descriptionHtml: typeof descriptionHtml === 'string' ? descriptionHtml : '',
        teamName: r.team_name || '',
        imageDataUrls: Array.isArray(r.images) ? r.images : [],
        githubUrl: r.github_url || undefined,
        xhsUrl: r.xiaohongshu_project_sharing_url || undefined,
      } as Project;
    });
    projects.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
    return projects;
  }

  // If JSON missing, return empty list
  return [];
}

export default function HacksPage() {
  const projects = loadProjects();

  return (
    <main className="min-h-screen bg-black text-white">
      <BackButton />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Vibe Hacks #01
          </h1>
          <p className="text-zinc-300 mt-2">24h Vibe Coding 黑客松项目墙</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-700">主题</span>
              <span>用 Vibe Coding 优化 Vibe Coding</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-700">主办</span>
              <span>
                <a className="hover:underline text-zinc-200" href="https://vibecafe.ai" target="_blank" rel="noopener noreferrer">VibeFriends</a>
                <span className="mx-1">×</span>
                <a className="hover:underline text-zinc-200" href="https://segmentfault.com" target="_blank" rel="noopener noreferrer">SegmentFault</a>
              </span>
            </span>
          </div>
          <hr className="mt-6 border-zinc-800" />
        </header>

        <section aria-label="项目列表">
          <div className="mb-4 text-sm text-zinc-400">共 {projects.length} 个项目</div>
          <ProjectWall projects={projects} />
        </section>
      </div>
    </main>
  );
}
