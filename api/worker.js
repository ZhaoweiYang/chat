// DAO MESSAGE API - Cloudflare Worker + KV
// Endpoints:
//   POST /dev/register     { mnemonic }
//   POST /dev/login        { mnemonic }
//   GET  /dev/profile      (header: X-Dev-Id)
//   PUT  /dev/usdt         { address } (header: X-Dev-Id)
//   POST /tpl/submit       { ...template } (header: X-Dev-Id)
//   GET  /tpl/my           (header: X-Dev-Id)
//   DELETE /tpl/:id        (header: X-Dev-Id)
//   GET  /tpl/approved     ?platform=Android
//   GET  /tpl/:id
//   POST /admin/login      { password }
//   GET  /admin/templates   ?status=pending (header: X-Admin-Token)
//   GET  /admin/stats       (header: X-Admin-Token)
//   PUT  /admin/review/:id  { approved: true/false } (header: X-Admin-Token)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Dev-Id, X-Admin-Token",
  "Content-Type": "application/json"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

function err(msg, status = 400) {
  return json({ error: msg }, status);
}

// Simple hash for mnemonic → devId
function mnemonicToId(mnemonic) {
  let hash = 0;
  for (let i = 0; i < mnemonic.length; i++) {
    hash = ((hash << 5) - hash) + mnemonic.charCodeAt(i);
    hash |= 0;
  }
  return "dev_" + Math.abs(hash).toString(16).padStart(8, "0");
}

// KV helpers
async function kvGet(DB, key) {
  const val = await DB.get(key);
  return val ? JSON.parse(val) : null;
}

async function kvSet(DB, key, val) {
  await DB.put(key, JSON.stringify(val));
}

async function getList(DB, key) {
  return (await kvGet(DB, key)) || [];
}

// Admin token (simple)
function makeAdminToken() {
  return "admin_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const DB = env.DB;

    try {
      // ==================== Developer ====================

      if (path === "/dev/register" && method === "POST") {
        const { mnemonic } = await request.json();
        if (!mnemonic) return err("Missing mnemonic");

        const devId = mnemonicToId(mnemonic.trim().toLowerCase());
        let dev = await kvGet(DB, `dev:${devId}`);
        if (!dev) {
          dev = { id: devId, usdtAddress: "", createdAt: new Date().toISOString() };
          await kvSet(DB, `dev:${devId}`, dev);
          // Add to developer list
          const devList = await getList(DB, "devList");
          devList.push(devId);
          await kvSet(DB, "devList", devList);
        }
        return json({ devId, dev });
      }

      if (path === "/dev/login" && method === "POST") {
        const { mnemonic } = await request.json();
        if (!mnemonic) return err("Missing mnemonic");

        const devId = mnemonicToId(mnemonic.trim().toLowerCase());
        const dev = await kvGet(DB, `dev:${devId}`);
        if (!dev) return err("Developer not found", 404);
        return json({ devId, dev });
      }

      if (path === "/dev/profile" && method === "GET") {
        const devId = request.headers.get("X-Dev-Id");
        if (!devId) return err("Missing X-Dev-Id", 401);
        const dev = await kvGet(DB, `dev:${devId}`);
        if (!dev) return err("Not found", 404);
        return json(dev);
      }

      if (path === "/dev/usdt" && method === "PUT") {
        const devId = request.headers.get("X-Dev-Id");
        if (!devId) return err("Missing X-Dev-Id", 401);
        const dev = await kvGet(DB, `dev:${devId}`);
        if (!dev) return err("Not found", 404);
        const { address } = await request.json();
        dev.usdtAddress = address || "";
        await kvSet(DB, `dev:${devId}`, dev);
        return json({ ok: true });
      }

      // ==================== Templates ====================

      if (path === "/tpl/submit" && method === "POST") {
        const devId = request.headers.get("X-Dev-Id");
        if (!devId) return err("Missing X-Dev-Id", 401);
        const dev = await kvGet(DB, `dev:${devId}`);
        if (!dev) return err("Developer not found", 404);

        const data = await request.json();
        const tplId = "tpl_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
        const tpl = {
          id: tplId,
          devId,
          name: data.name || "",
          description: data.description || "",
          price: parseFloat(data.price) || 0,
          platforms: data.platforms || [],
          images: data.images || [],
          fileContent: data.fileContent || "",
          status: "pending",
          createdAt: new Date().toISOString(),
          reviewedAt: null
        };

        await kvSet(DB, `tpl:${tplId}`, tpl);

        // Add to template lists
        const allTpls = await getList(DB, "tplList");
        allTpls.push(tplId);
        await kvSet(DB, "tplList", allTpls);

        const devTpls = await getList(DB, `devTpls:${devId}`);
        devTpls.push(tplId);
        await kvSet(DB, `devTpls:${devId}`, devTpls);

        return json({ ok: true, tpl: { ...tpl, fileContent: undefined } });
      }

      if (path === "/tpl/my" && method === "GET") {
        const devId = request.headers.get("X-Dev-Id");
        if (!devId) return err("Missing X-Dev-Id", 401);

        const devTplIds = await getList(DB, `devTpls:${devId}`);
        const tpls = [];
        for (const id of devTplIds) {
          const tpl = await kvGet(DB, `tpl:${id}`);
          if (tpl) tpls.push({ ...tpl, fileContent: undefined, images: undefined });
        }
        return json(tpls);
      }

      if (path.startsWith("/tpl/") && method === "DELETE") {
        const devId = request.headers.get("X-Dev-Id");
        if (!devId) return err("Missing X-Dev-Id", 401);
        const tplId = path.replace("/tpl/", "");
        const tpl = await kvGet(DB, `tpl:${tplId}`);
        if (!tpl) return err("Not found", 404);
        if (tpl.devId !== devId) return err("Forbidden", 403);

        await DB.delete(`tpl:${tplId}`);
        // Remove from lists
        const allTpls = (await getList(DB, "tplList")).filter(id => id !== tplId);
        await kvSet(DB, "tplList", allTpls);
        const devTpls = (await getList(DB, `devTpls:${devId}`)).filter(id => id !== tplId);
        await kvSet(DB, `devTpls:${devId}`, devTpls);

        return json({ ok: true });
      }

      if (path === "/tpl/approved" && method === "GET") {
        const platform = url.searchParams.get("platform") || "";
        const allIds = await getList(DB, "tplList");
        const tpls = [];
        for (const id of allIds) {
          const tpl = await kvGet(DB, `tpl:${id}`);
          if (tpl && tpl.status === "approved") {
            if (!platform || tpl.platforms.includes(platform)) {
              tpls.push({ ...tpl, fileContent: undefined });
            }
          }
        }
        return json(tpls);
      }

      // Get single template (for download - includes fileContent)
      if (path.startsWith("/tpl/") && method === "GET") {
        const tplId = path.replace("/tpl/", "");
        const tpl = await kvGet(DB, `tpl:${tplId}`);
        if (!tpl) return err("Not found", 404);
        return json(tpl);
      }

      // ==================== Admin ====================

      if (path === "/admin/login" && method === "POST") {
        const { password } = await request.json();
        if (password !== env.ADMIN_PASS) return err("Wrong password", 401);
        const token = makeAdminToken();
        await kvSet(DB, `adminToken:${token}`, { createdAt: Date.now() });
        return json({ token });
      }

      // Admin middleware
      if (path.startsWith("/admin/") && path !== "/admin/login") {
        const token = request.headers.get("X-Admin-Token");
        if (!token) return err("Unauthorized", 401);
        const session = await kvGet(DB, `adminToken:${token}`);
        if (!session) return err("Invalid token", 401);
      }

      if (path === "/admin/stats" && method === "GET") {
        const allIds = await getList(DB, "tplList");
        const devList = await getList(DB, "devList");
        let pending = 0, approved = 0, rejected = 0;
        for (const id of allIds) {
          const tpl = await kvGet(DB, `tpl:${id}`);
          if (tpl) {
            if (tpl.status === "pending") pending++;
            else if (tpl.status === "approved") approved++;
            else if (tpl.status === "rejected") rejected++;
          }
        }
        return json({ pending, approved, rejected, developers: devList.length });
      }

      if (path === "/admin/templates" && method === "GET") {
        const status = url.searchParams.get("status") || "";
        const allIds = await getList(DB, "tplList");
        const tpls = [];
        for (const id of allIds) {
          const tpl = await kvGet(DB, `tpl:${id}`);
          if (tpl) {
            if (!status || tpl.status === status) {
              tpls.push({ ...tpl, fileContent: undefined });
            }
          }
        }
        return json(tpls);
      }

      if (path.startsWith("/admin/review/") && method === "PUT") {
        const tplId = path.replace("/admin/review/", "");
        const tpl = await kvGet(DB, `tpl:${tplId}`);
        if (!tpl) return err("Not found", 404);
        const { approved } = await request.json();
        tpl.status = approved ? "approved" : "rejected";
        tpl.reviewedAt = new Date().toISOString();
        await kvSet(DB, `tpl:${tplId}`, tpl);
        return json({ ok: true, status: tpl.status });
      }

      return err("Not found", 404);

    } catch (e) {
      return err("Server error: " + e.message, 500);
    }
  }
};
