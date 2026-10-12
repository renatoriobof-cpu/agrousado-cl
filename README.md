
# Agrousados.cl - Next.js + Supabase + Vercel

## 1. Supabase
1. Crea proyecto en supabase.com
2. SQL Editor -> pega contenido de supabase.sql
3. Storage -> New Bucket -> tractor-fotos (public: true)
4. Policies:
   - Storage: permitir INSERT a anon, SELECT public, DELETE solo service_role
5. Copia URL y anon key

## 2. Vercel
1. Sube este repo a GitHub
2. Vercel -> New Project -> Import
3. Variables de entorno (.env)
4. Deploy
5. En tu dominio agrousado.cl -> DNS -> CNAME a cname.vercel-dns.com

## 3. Flujo
- Cliente sube tractor -> estado pendiente
- Tú entras a /?admin=1 footer Admin -> clave 1990 -> Apruebas
- Solo aprobados se ven
- Baja solo con clave 1990

Video YouTube: solo pega URL, se guarda embed, no ocupa espacio.
Fotos: 10 fotos se suben a bucket tractor-fotos, url guardada en array.
