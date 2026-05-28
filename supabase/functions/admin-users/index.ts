import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization") ?? "";

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userRes, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userRes.user) return json({ error: "Unauthorized" }, 401);
  const callerId = userRes.user.id;

  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", callerId)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) return json({ error: "Forbidden" }, 403);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* empty */
  }
  const action = body.action as string;

  try {
    if (action === "list") {
      const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
      if (error) return json({ error: error.message }, 500);
      const ids = data.users.map((u) => u.id);
      const { data: roles } = await admin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const adminSet = new Set(
        (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
      );
      return json({
        users: data.users.map((u) => ({
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          confirmed: !!u.email_confirmed_at,
          isAdmin: adminSet.has(u.id),
        })),
      });
    }

    if (action === "invite") {
      const email = String(body.email ?? "")
        .trim()
        .toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);
      const origin = req.headers.get("origin") ?? "";
      const redirectTo = origin ? `${origin}/reset-password` : undefined;
      const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo,
      });
      if (error) return json({ error: error.message }, 400);
      if (body.makeAdmin && invited.user) {
        await admin
          .from("user_roles")
          .upsert({ user_id: invited.user.id, role: "admin" }, { onConflict: "user_id,role" });
      }
      return json({ ok: true });
    }

    if (action === "setAdmin") {
      const userId = String(body.userId ?? "");
      if (!userId) return json({ error: "Missing userId" }, 400);
      if (body.admin) {
        const { error } = await admin
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
        if (error) return json({ error: error.message }, 500);
      } else {
        if (userId === callerId)
          return json({ error: "Et voi poistaa omia adminoikeuksiasi" }, 400);
        const { error } = await admin
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) return json({ error: error.message }, 500);
      }
      return json({ ok: true });
    }

    if (action === "delete") {
      const userId = String(body.userId ?? "");
      if (!userId) return json({ error: "Missing userId" }, 400);
      if (userId === callerId) return json({ error: "Et voi poistaa omaa tiliäsi" }, 400);
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Server error" }, 500);
  }
});
