import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Metodo no permitido" });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const { adminSecret } = req.body || {};
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ msg: "Clave admin incorrecta" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("asistencia").delete().neq("id", "");
  if (error) {
    return res.status(500).json({ msg: "Error borrando", error: error.message });
  }

  res.json({ msg: "Registros borrados" });
}
