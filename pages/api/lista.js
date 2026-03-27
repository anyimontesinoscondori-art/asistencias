import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("asistencia")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      return res
        .status(500)
        .json({ msg: "Error obteniendo lista", error: error.message });
    }

    res.json(data);
  } catch (err) {
    let urlHost = "";
    try {
      urlHost = new URL(supabaseUrl).host;
    } catch (_) {
      urlHost = "invalid_url";
    }
    return res.status(500).json({
      msg: "Error obteniendo lista",
      error: err?.message || "fetch failed",
      code: err?.cause?.code || "",
      urlHost
    });
  }
}
