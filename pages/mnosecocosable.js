import { useState } from "react";

export default function Admin() {
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");

  const generarQR = async () => {
    const res = await fetch("/api/token");
    const data = await res.json();

    const url = `${window.location.origin}?token=${data.token}`;

    setLink(url);
    setQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`);
  };

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
  }
};