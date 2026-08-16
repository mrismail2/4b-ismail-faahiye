/* ============================================================
   KAABE — Edge Function: casuumaadda macalinka + emailka

   Sababta Function loo isticmaalayo: emailka lama diri karo app-ka
   gudihiisa. Furaha `service_role` iyo furaha adeegga emailka waa in ay
   SERVER-ka ku jiraan — haddii app-ka la geeyo, qof kastaa wuu soo
   qaadan karaa, RLS oo dhanna wuu dhaafi karaa.

   Waxa uu qabtaa:
     1. Wuxuu xaqiijiyaa qofka wacaya inuu SUPER ADMIN yahay
     2. `create_invite()` ayuu ku abuuraa casuumaadda (koodhka)
     3. Emailka ayuu macalinka u diraa (Resend)

   Habaynta:
     supabase secrets set RESEND_API_KEY=...
     supabase secrets set KAABE_FROM_EMAIL="KAABE <no-reply@iskuulkaaga.so>"
     supabase functions deploy invite-teacher

   Haddii RESEND_API_KEY la banayo, casuumaadda weli waa la abuurayaa,
   `emailed: false` ayuuna soo celinayaa — app-ku wuxuu maamulaha tusayaa
   koodhka si uu gacanta u diro.
   ============================================================ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

function inviteEmail(opts: {
  fullName: string;
  schoolName: string;
  code: string;
  classes: string[];
  invitedBy: string;
}) {
  const classLine = opts.classes.length
    ? `<p style="margin:0 0 16px;color:#313131">Fasalada laguu qoondeeyay: <strong>${opts.classes.join(', ')}</strong></p>`
    : '';

  return `
<!doctype html>
<html lang="so"><body style="margin:0;padding:24px;background:#FBFBFB;font-family:Inter,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:20px;padding:32px;border:1px solid #E8EBF0">
    <div style="width:56px;height:56px;border-radius:18px;background:#005CE6;color:#fff;font-size:26px;font-weight:800;text-align:center;line-height:56px">K</div>
    <h1 style="margin:20px 0 8px;font-size:24px;color:#171717">Ku soo dhawoow KAABE</h1>
    <p style="margin:0 0 16px;color:#313131;line-height:1.6">
      Salaan <strong>${opts.fullName}</strong>,<br>
      ${opts.invitedBy} wuxuu kuugu casumay inaad macalin ka noqoto
      <strong>${opts.schoolName}</strong>.
    </p>
    ${classLine}
    <p style="margin:0 0 8px;color:#6B7280;font-size:13px">Koodhkaaga casuumaadda:</p>
    <div style="border:1px dashed #005CE6;background:#D9E7FB;border-radius:14px;padding:20px;text-align:center;margin-bottom:20px">
      <span style="font-size:30px;font-weight:800;letter-spacing:5px;color:#0045AD">${opts.code}</span>
    </div>
    <ol style="margin:0 0 20px;padding-left:20px;color:#313131;line-height:1.8">
      <li>Fur app-ka KAABE</li>
      <li>Dooro <strong>"Koodh casuumaad"</strong></li>
      <li>Koodhka geli, kadibna <strong>fure sirta ah oo adiga kuu gaar ah</strong> samayso</li>
    </ol>
    <p style="margin:0;color:#6B7280;font-size:12px;line-height:1.6">
      Koodhku wuxuu shaqaynayaa 14 maalmood, hal mar oo keliya ayuuna
      shaqaynayaa. Emailkan haddii aanad sugayn, iska indho tir.
    </p>
  </div>
</body></html>`.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST oo keliya.' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('Authorization') ?? '';

  if (!authHeader) return json({ error: 'Marka hore soo gal.' }, 401);

  /* 1. Qofka wacaya yaa ah? Token-kiisa ayaa la isticmaalayaa, sidaas
        RLS-ku wuu khusayaa — ma aha service-role. */
  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: auth, error: authErr } = await caller.auth.getUser();
  if (authErr || !auth?.user) return json({ error: 'Soo galitaanku ma saxna.' }, 401);

  const { data: me, error: meErr } = await caller
    .from('profiles').select('role, school_id, full_name').eq('id', auth.user.id).single();

  if (meErr || !me) return json({ error: 'Profile lama helin.' }, 403);

  /* MUHIIM: maamulaha guud OO KELIYA ayaa casuumi kara */
  if (me.role !== 'super_admin') {
    return json({ error: 'Maamulaha guud oo keliya ayaa casuumi kara.' }, 403);
  }

  const body = await req.json().catch(() => null);
  const fullName = String(body?.full_name ?? '').trim();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const classIds: string[] = Array.isArray(body?.class_ids) ? body.class_ids : [];

  if (!fullName) return json({ error: 'Magaca macalinka waa qasab.' }, 400);
  if (!email.includes('@')) return json({ error: 'Emailka macalinka ma saxna.' }, 400);

  /* 2. Casuumaadda abuur — RPC-ga ayaa koodhka soo saara */
  const { data: invite, error: inviteErr } = await caller.rpc('create_invite', {
    p_full_name: fullName,
    p_email: email,
    p_class_ids: classIds,
  });

  if (inviteErr) return json({ error: inviteErr.message }, 400);

  /* 3. Magacyada fasalada (emailka ayaa lagu qorayaa) — service-role
        ayaa halkan loo isticmaalayaa akhris kooban. */
  const admin = createClient(url, serviceKey);
  const { data: classRows } = await admin
    .from('classes').select('name').in('id', classIds.length ? classIds : ['00000000-0000-0000-0000-000000000000']);
  const { data: school } = await admin
    .from('schools').select('name').eq('id', me.school_id).single();

  /* 4. Emailka dir */
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('KAABE_FROM_EMAIL') ?? 'KAABE <onboarding@resend.dev>';

  if (!resendKey) {
    /* Adeegga emailka lama habayn — casuumaaddu way jirtaa, koodhkana
       waa la soo celinayaa si maamuluhu gacanta u diro. */
    return json({ emailed: false, code: invite.code, reason: 'mail_not_configured' });
  }

  const mail = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Ku soo dhawoow KAABE — ${school?.name ?? 'iskuulka'}`,
      html: inviteEmail({
        fullName,
        schoolName: school?.name ?? 'iskuulka',
        code: invite.code,
        classes: (classRows ?? []).map((c: { name: string }) => c.name),
        invitedBy: me.full_name,
      }),
    }),
  });

  if (!mail.ok) {
    const detail = await mail.text();
    /* Emailku wuu dhacay, laakiin casuumaaddu way jirtaa — koodhka soo
       celi si aan shaqadu u lumin. */
    return json({ emailed: false, code: invite.code, reason: detail.slice(0, 200) });
  }

  return json({ emailed: true, code: invite.code });
});
