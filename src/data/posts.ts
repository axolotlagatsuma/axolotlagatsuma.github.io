export interface Post {
  id: string;
  title: string;
  date: string;
  securityLevel: "UNCLASSIFIED" | "CLASSIFIED" | "RESTRICTED";
  tags: string[];
  excerpt: string;
  content: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, unknown> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: string = line.slice(colonIdx + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Parse arrays like ["A", "B"]
    if (value.startsWith("[")) {
      try {
        meta[key] = JSON.parse(value);
      } catch {
        meta[key] = value;
      }
    } else {
      meta[key] = value;
    }
  }

  return { meta, content: match[2].trim() };
}

export async function fetchPostIndex(): Promise<string[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}posts/index.json`);
  return res.json();
}

export async function fetchPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}posts/${id}.md`);
    if (!res.ok) return null;
    const raw = await res.text();
    const { meta, content } = parseFrontmatter(raw);
    return {
      id: (meta.id as string) || id,
      title: (meta.title as string) || "",
      date: (meta.date as string) || "",
      securityLevel: (meta.securityLevel as Post["securityLevel"]) || "UNCLASSIFIED",
      tags: (meta.tags as string[]) || [],
      excerpt: (meta.excerpt as string) || "",
      content,
    };
  } catch {
    return null;
  }
}

export async function fetchAllPosts(): Promise<Post[]> {
  const ids = await fetchPostIndex();
  const posts = await Promise.all(ids.map(fetchPost));
  return posts.filter((p): p is Post => p !== null);
}
