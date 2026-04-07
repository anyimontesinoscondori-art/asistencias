import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function formatHoraAmPm(hora) {
  if (!hora) return "";

  const [rawHours = "0", minutes = "00", seconds = "00"] = hora.split(":");
  const hours24 = Number(rawHours);

  if (!Number.isFinite(hours24)) return hora;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${minutes}:${seconds} ${period}`;
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

const CSV_SEPARATOR = ";";
const UTF8_BOM = "\uFEFF";

export default async function handler(req, res) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ msg: "Falta configurar Supabase" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("asistencia")
      .select("*")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (error) {
      return res
        .status(500)
        .json({ msg: "Error exportando asistencia", error: error.message });
    }

    let csv = `${UTF8_BOM}Nombre${CSV_SEPARATOR}Fecha${CSV_SEPARATOR}Hora\n`;

    data.forEach((r) => {
      csv += [
        escapeCsvValue(r.nombre),
        escapeCsvValue(r.fecha),
        escapeCsvValue(formatHoraAmPm(r.hora))
      ].join(CSV_SEPARATOR);
      csv += "\n";
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=asistencia.csv");
    res.send(csv);
  } catch (err) {
    let urlHost = "";
    try {
      urlHost = new URL(supabaseUrl).host;
    } catch (_) {
      urlHost = "invalid_url";
    }
    return res.status(500).json({
      msg: "Error exportando asistencia",
      error: err?.message || "fetch failed",
      code: err?.cause?.code || "",
      urlHost
    });
  }
}
