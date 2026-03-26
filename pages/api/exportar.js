import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data } = await supabase.from("asistencia").select("*");

  let csv = "Nombre,Fecha,Hora\n";

  data.forEach(r => {
    csv += `${r.nombre},${r.fecha},${r.hora}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=asistencia.csv");
  res.send(csv);
}