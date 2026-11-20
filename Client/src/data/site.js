export const site = {
  name: import.meta.env.VITE_APP_NAME ?? 'CINOVA',
  tagline: import.meta.env.VITE_APP_TAGLINE ?? 'Cinema. Reimagined.',
}

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Series', to: '/series' },
  { label: 'Genres', to: '/genres' },
  { label: 'Trending', to: '/trending' },
]
