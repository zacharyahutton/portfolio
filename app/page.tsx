/** Fallback only — `/` is rewritten to the mirrored Revox theme via next.config. */
export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 48, background: "#060606", color: "#fff" }}>
      <h1>Zachary Hutton</h1>
      <p>
        If you see this, the Revox rewrite missed. Open{" "}
        <a href="/revox-mirror/revox.baseecom.com/index.html" style={{ color: "#BFF747" }}>
          /revox-mirror/revox.baseecom.com/index.html
        </a>
        .
      </p>
    </main>
  );
}
