const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const removeDirs = ['app', 'components', 'content', 'lib', 'brand'];
const keepInPublic = new Set(['revox-mirror']);

// Remove old app source (backed up already)
for (const d of removeDirs) {
  const p = path.join(root, d);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log('Removed', d);
  }
}

// Clear public except revox-mirror
const pub = path.join(root, 'public');
for (const name of fs.readdirSync(pub)) {
  if (!keepInPublic.has(name)) {
    fs.rmSync(path.join(pub, name), { recursive: true, force: true });
    console.log('Removed public/' + name);
  }
}

// Create minimal Next app that iframes the mirror (pixel-faithful, all JS works)
const appDir = path.join(root, 'app');
fs.mkdirSync(appDir, { recursive: true });

fs.writeFileSync(
  path.join(appDir, 'layout.tsx'),
  `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revox – Personal Portfolio (Local Preview)",
  description: "Local pixel preview of the Revox theme demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, height: "100%" }}>
      <body style={{ margin: 0, height: "100%", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
`
);

fs.writeFileSync(
  path.join(appDir, 'page.tsx'),
  `export default function Home() {
  return (
    <iframe
      title="Revox demo preview"
      src="/revox-mirror/revox.baseecom.com/index.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
    />
  );
}
`
);

fs.writeFileSync(
  path.join(appDir, 'globals.css'),
  `html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
`
);

console.log('Minimal app created');
