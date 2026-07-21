const http = require("http");

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      })
      .on("error", reject);
  });
}

(async () => {
  const pages = [
    "http://localhost:3000/",
    "http://localhost:3000/blog",
    "http://localhost:3000/contact-us",
    "http://localhost:3000/works/weroi",
    "http://localhost:3000/portfolio-page",
    "http://localhost:3000/about-me",
  ];

  const forbidden = [
    /Pixelr/i,
    /teachable/i,
    /Then you're in the right place/i,
    />hire me</,
    /preloader-text">REVOX/,
    />REVOX</,
    /hi\.revox/i,
    /t\.me\//i,
    /CSEC/i,
    /#1500ff/i,
    /UNLOCKING SCALABLE/i,
    /Shikhon/i,
    /SilverLine|NeuroNet/i,
    /Trusted by 1M|>1M</,
  ];

  let failed = 0;
  for (const url of pages) {
    const { status, body } = await get(url);
    const hits = forbidden.filter((re) => re.test(body)).map((re) => re.toString());
    const okBits = {
      Zachary: /Zachary/i.test(body),
      HireMe: />Hire Me</.test(body) || /Hire Me/.test(body),
    };
    console.log(
      status,
      url,
      hits.length ? "FAIL " + hits.join(",") : "OK",
      okBits
    );
    if (status !== 200 || hits.length) failed++;
  }

  const home = await get("http://localhost:3000/");
  console.log("--- home checks ---");
  console.log("$399", home.body.includes("$399"));
  console.log("Custom Plan", home.body.includes("Custom Plan"));
  console.log("Domus", home.body.includes("Domus"));
  console.log("WehFiGo", home.body.includes("WehFiGo"));
  console.log("theme", (home.body.match(/--theme:\s*#[A-Fa-f0-9]+/) || [])[0]);
  console.log("preloader", (home.body.match(/preloader-text">[^<]+/) || [])[0]);
  console.log(
    "Hire Me hrefs",
    [...home.body.matchAll(/href="([^"]+)" class="theme-btn">Hire Me/g)].map(
      (m) => m[1]
    )
  );

  const weroi = await get("http://localhost:3000/works/weroi");
  console.log("weroi Founder", weroi.body.includes("Founder"));
  console.log("weroi FastAPI", weroi.body.includes("FastAPI"));

  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
