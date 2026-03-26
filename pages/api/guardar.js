import { createClient } from "@supabase/supabase-js";
import { tokenActual } from "./token";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { nombre, token } = req.body;

  if (token !== tokenActual) {
    return res.json({ msg: "QR expirado ❌" });
  }

  const hoy = new Date().toISOString().split("T")[0];

  const { data: existente } = await supabase
    .from("asistencia")
    .select("*")
    .eq("nombre", nombre)
    .eq("fecha", hoy);

  if (existente.length > 0) {
    return res.json({ msg: "Ya registrado ❌" });
  }

  const now = new Date();

  await supabase.from("asistencia").insert([
    {
      nombre,
      fecha: hoy,
      hora: now.toTimeString().split(" ")[0],
      token
    }
  ]);

  res.json({ msg: "Registrado ✅" });
}