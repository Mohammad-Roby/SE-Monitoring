export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/upload" && request.method==="POST"){
      return new Response(JSON.stringify({status:"ok"}));
    }

    if (url.pathname === "/check"){
      const kdtk = url.searchParams.get("kdtk");
      return new Response(JSON.stringify({kdtk, issues:[]}));
    }

    return new Response("OK");
  }
}