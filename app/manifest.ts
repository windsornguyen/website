import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Windsor Nguyen',
    short_name: 'Windsor',
    description: "Win's personal website",
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#1a1a1a',
    theme_color: '#333333',
    id: 'windsor-nguyen-personal-website',
    scope: '/',
    categories: ['researcher'],
    icons: [
      {
        src: '/pwa/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/pwa/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    prefer_related_applications: false,
    dir: 'ltr',
    lang: 'en',
    display_override: ['standalone', 'browser'],
    shortcuts: [
      {
        name: 'Blog',
        url: '/blog',
        description: 'Read my thoughts and insights on various topics',
      },
    ],
  };
}
