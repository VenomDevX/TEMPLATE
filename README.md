# TEMPLATE

Drop-in animated backgrounds and text effects for React + Tailwind sites. Each folder has a `preview/` Vite app you can run to see it live.

| Folder | What it is |
|---|---|
| `SMOKE BACKGROUND/BLACK SMOKE BACKGROUND` | Dark WebGL smoke with aurora, particles and mouse-reactive swirl (`SmoothDarkThemeBackground`) |
| `SMOKE BACKGROUND/WHITE SMOKE BACKGROUND` | Light-theme version (`SmoothLightThemeBackground`) |
| `VERTICAL ANIMATION` | Scroll-driven vertical text reveal (`TextReveal`, uses framer-motion) |

## Use it

Copy the component folder into your project, then:

```tsx
import SmoothDarkThemeBackground from './BLACK SMOKE BACKGROUND';

export default function Page() {
  return (
    <>
      <SmoothDarkThemeBackground />
      <main>{/* your content */}</main>
    </>
  );
}
```

## Preview locally

```bash
cd "SMOKE BACKGROUND/BLACK SMOKE BACKGROUND/preview"
npm install
npm run dev
```

Live showcase: [venmo-studio.vercel.app](https://venmo-studio.vercel.app/)
