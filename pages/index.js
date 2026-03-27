import { useState } from "react";

function getDeviceId() {
  if (typeof window === "undefined") return "";
  const key = "device_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    const rand = Math.random().toString(36).slice(2);
    const now = Date.now().toString(36);
    id = `${now}-${rand}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

export default function Home() {
  const [nombre, setNombre] = useState("");

  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const token = params.get("token");

  const enviar = async () => {
    if (!nombre) return alert("Escribe tu nombre");

    const deviceId = getDeviceId();

    const res = await fetch("/api/guardar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, token, deviceId })
    });

    const data = await res.json();
    alert(data.msg);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f172a",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        width: "90%",
        maxWidth: 350,
        background: "#1e293b",
        padding: 20,
        borderRadius: 15
      }}>
        <h2 style={{ textAlign: "center" }}>Asistencia</h2>

        <input
          placeholder="Tu nombre¡"
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            marginTop: 10
          }}
        />

        <button
          onClick={enviar}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 12,
            borderRadius: 10,
            background: "#22c55e",
            color: "white",
            border: "none"
          }}
        >
          Registrar
        </button>
      </div>
    </div>
  );
}
