import { createClient } from "@supabase/supabase-js";
import { verifyQrToken } from "../../lib/qrToken";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const { nombre, token } = req.body || {};

  if (!nombre || !token) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  const verif = verifyQrToken(token);
  if (!verif.ok) {
    return res.status(400).json({ msg: "QR expirado o invalido" });
  }

  const hoy = new Date().toISOString().split("T")[0];

  const { data: existente, error: errorExistente } = await supabase
    .from("asistencia")
    .select("*")
    .eq("nombre", nombre)
    .eq("fecha", hoy);

  if (errorExistente) {
    return res.status(500).json({
      msg: "Error consultando asistencia",
      error: errorExistente.message
    });
  }

  if (existente.length > 0) {
    return res.json({ msg: "Ya registrado" });
  }

  const now = new Date();

  const { error: errorInsert } = await supabase.from("asistencia").insert([
    {
      nombre,
      fecha: hoy,
      hora: now.toTimeString().split(" ")[0],
      token
    }
  ]);

  if (errorInsert) {
    return res.status(500).json({
      msg: "Error guardando asistencia",
      error: errorInsert.message
    });
  }

  res.json({ msg: "Registrado" });
}
