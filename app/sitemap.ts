import { promises as fs } from 'fs';
import path from 'path';

// Primary routes
const siteStructure = [{ route: 'blog', dir: path.join(process.cwd(), 'app', 'blog') }];

// Utility function to get slugs and last modified timestamps from a directory
async function getSlugs(dir: string, filePattern = '.mdx') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively get slugs if there are nested directories (e.g., /blog/123)
      const nestedSlugs = await getSlugs(entryPath, filePattern);
      nestedSlugs.forEach((nestedSlug) => slugs.push(nestedSlug));
    } else if (entry.isFile() && entry.name.endsWith(filePattern)) {
      // Capture the filename without extension as the slug
      const slug = path.basename(entry.name, filePattern);

      // Get the last modified time of the file
      const { mtime } = await fs.stat(entryPath);
      slugs.push({ slug, lastModified: mtime.toISOString() });
    }
  }

  return slugs;
}

// Main sitemap function
export default async function sitemap() {
  const allRoutes = await Promise.all(
    siteStructure.map(async ({ route, dir }) => {
      const slugs = await getSlugs(dir);
      return slugs.map(({ slug, lastModified }) => ({
        url: `https://windsornguyen.com/${route}/${slug}`,
        lastModified,
      }));
    })
  );

  // Flatten the array of routes and return
  return allRoutes.flat();
}
