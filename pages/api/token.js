import { createQrToken } from "../../lib/qrToken";

export default function handler(req, res) {
  try {
    const token = createQrToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Falta configurar QR_SECRET" });
  }
}
