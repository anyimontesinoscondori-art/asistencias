import { createClient } from "@supabase/supabase-js";
import { verifyQrToken } from "../../lib/qrToken";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { nombre, token, deviceId } = req.body || {};

  if (!nombre || !token || !deviceId) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  const verif = verifyQrToken(token);
  if (!verif.ok) {
    return res.status(400).json({ msg: "QR expirado o invalido" });
  }

  const hoy = new Date().toISOString().split("T")[0];

  try {
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

    const { data: existenteDevice, error: errorDevice } = await supabase
      .from("asistencia")
      .select("*")
      .eq("device_id", deviceId)
      .eq("fecha", hoy);

    if (errorDevice) {
      return res.status(500).json({
        msg: "Error verificando dispositivo",
        error: errorDevice.message
      });
    }

    if (existenteDevice.length > 0) {
      return res.json({ msg: "Este celular ya registro hoy" });
    }

    const now = new Date();

    const { error: errorInsert } = await supabase.from("asistencia").insert([
      {
        nombre,
        fecha: hoy,
        hora: now.toTimeString().split(" ")[0],
        token,
        device_id: deviceId
      }
    ]);

    if (errorInsert) {
      return res.status(500).json({
        msg: "Error guardando asistencia",
        error: errorInsert.message
      });
    }

    res.json({ msg: "Registrado" });
  } catch (err) {
    let urlHost = "";
    try {
      urlHost = new URL(supabaseUrl).host;
    } catch (_) {
      urlHost = "invalid_url";
    }
    return res.status(500).json({
      msg: "Error guardando asistencia",
      error: err?.message || "fetch failed",
      code: err?.cause?.code || "",
      urlHost
    });
  }
}
