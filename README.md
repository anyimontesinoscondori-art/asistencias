# Sistema de Asistencia QR

## Instalacion

1. npm install
2. Configura .env
3. npm run dev

## Variables de entorno

- SUPABASE_URL
- SUPABASE_ANON_KEY
- QR_SECRET (cualquier texto secreto)
- ADMIN_SECRET (clave para borrar registros)
- QR_TOKEN_TTL_MS (opcional, por defecto 7200000)

## Rutas

/ -> alumnos
/mnosecocosable (o /admin) -> admin
