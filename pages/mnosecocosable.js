import { useEffect, useState } from "react";

export default function Admin() {
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const generarQR = async () => {
    const res = await fetch("/api/token");
    const data = await res.json();

    const url = `${window.location.origin}?token=${data.token}`;

    setLink(url);
    setQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`);
  };

  const cargarLista = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/lista");
      const data = await res.json();
      if (!res.ok) {
        setError(data?.msg || "Error cargando lista");
      } else {
        setLista(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError("Error cargando lista");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLista();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>Panel Profesor</h2>

        {qr ? (
          <img src={qr} style={styles.qr} />
        ) : (
          <p style={{ opacity: 0.6 }}>Genera un QR para comenzar</p>
        )}

        <div style={styles.buttons}>
          <button onClick={generarQR} style={styles.primary}>
            Nuevo QR
          </button>

          <a href="/api/exportar" style={styles.secondary}>
            Descargar Excel
          </a>
        </div>

        {link && (
          <p style={styles.linkText}>
            Link: <span style={styles.linkValue}>{link}</span>
          </p>
        )}

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Asistencia</h3>
            <button onClick={cargarLista} style={styles.smallButton}>
              {cargando ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Hora</th>
                </tr>
              </thead>
              <tbody>
                {lista.length === 0 && !cargando ? (
                  <tr>
                    <td style={styles.td} colSpan={3}>
                      Sin registros
                    </td>
                  </tr>
                ) : (
                  lista.map((r, i) => (
                    <tr key={`${r.nombre}-${r.fecha}-${r.hora}-${i}`}>
                      <td style={styles.td}>{r.nombre}</td>
                      <td style={styles.td}>{r.fecha}</td>
                      <td style={styles.td}>{r.hora}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)"
  },
  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    color: "white"
  },
  title: {
    marginBottom: "20px"
  },
  qr: {
    width: "250px",
    borderRadius: "15px",
    marginBottom: "20px"
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  primary: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  secondary: {
    padding: "12px",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    textDecoration: "none",
    textAlign: "center"
  },
  linkText: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.85,
    wordBreak: "break-all"
  },
  linkValue: {
    color: "#93c5fd"
  },
  section: {
    marginTop: "20px",
    textAlign: "left"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px"
  },
  smallButton: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "#374151",
    color: "white",
    cursor: "pointer",
    fontSize: "12px"
  },
  error: {
    color: "#fca5a5",
    marginBottom: "8px",
    fontSize: "12px"
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
    background: "#0b1220",
    borderRadius: "12px",
    border: "1px solid #1f2937"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px"
  },
  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #1f2937",
    color: "#cbd5e1",
    fontWeight: "bold"
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #1f2937",
    color: "white"
  }
};
