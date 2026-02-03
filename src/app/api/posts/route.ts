import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { BlogPost } from '@/util/blogPosts';

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts');

function parsePost(filename: string, text: string): BlogPost {
  const parts = text.split('---');
  if (parts.length < 2) {
    throw new Error(`Invalid post format in ${filename}. Missing '---' separator.`);
  }

  const header = parts[0];
  const content = parts.slice(1).join('---').trim();

  const metadata: Partial<BlogPost> = { filename, content };
  const regex = /(\w+):\s*'([^']*)'/g;

  let match;
  while ((match = regex.exec(header)) !== null) {
    const key = match[1] as keyof BlogPost;
    metadata[key] = match[2] as BlogPost[typeof key];
  }

  if (!metadata.id) {
    metadata.id = filename.replace(/\.md$/, '');
  }

  return metadata as BlogPost;
}

function parseDate(dateStr: string): Date {
  // Parse dates like "Dec 31, 2025" or "Jan 1, 2026"
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export async function GET() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));
    const posts = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(POSTS_DIR, filename);
        const text = await fs.readFile(filePath, 'utf8');
        return parsePost(filename, text);
      })
    );

    // Sort by date descending (newest first)
    posts.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}
