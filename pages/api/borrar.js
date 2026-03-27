import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Metodo no permitido" });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.from("asistencia").delete().neq("id", null);
  if (error) {
    return res.status(500).json({
      msg: "Error borrando",
      error: error.message
    });
  }

  res.json({ msg: "Registros borrados" });
}
