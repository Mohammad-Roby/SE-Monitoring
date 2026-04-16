export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json"
    };

    // Handle preflight (penting)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (url.pathname === "/upload" && request.method === "POST") {
      return new Response(JSON.stringify({ status: "ok" }), { headers });
    }

    if (url.pathname === "/check") {
      const kdtk = url.searchParams.get("kdtk");

      return new Response(JSON.stringify({
        kdtk,
        issues: []
      }), { headers });
    }

    return new Response("OK", { headers });
  }
};
