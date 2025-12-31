export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  content: string;
  filename: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    return (await response.json()) as BlogPost[];
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return [];
  }
}
