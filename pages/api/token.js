let tokenActual = "";

export default function handler(req, res) {
  tokenActual = Math.random().toString(36).substring(2, 10);
  res.json({ token: tokenActual });
}

export { tokenActual };