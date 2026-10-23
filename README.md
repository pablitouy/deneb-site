# Deneb — landing page

Página de presentación de Deneb, el panel de control para VPS. Es HTML, CSS y JavaScript estáticos, más un `subscribe.php` que
guarda la lista de interesados en el propio servidor. No hay build ni dependencias.

```text
deneb-site/
├── public/              # raíz web del sitio
│   ├── index.html       # contenido en inglés (por defecto)
│   ├── assets/app.js    # traducción al español, selector EN/ES y formulario
│   ├── assets/style.css
│   ├── favicon.svg
│   └── subscribe.php    # recibe el email y lo guarda en ../data
└── data/                # se crea solo; NO se sirve por web ni se versiona
    └── subscribers.csv  # fecha UTC, email, idioma
```

## Publicarla con Deneb

1. Crear un sitio **PHP** con el dominio de la landing. Deneb sirve
   `/var/www/<dominio>/public`.
2. Subir el contenido de `public/` a `/site/public` por SFTP (o con el File Manager).
3. Emitir el certificado SSL desde el panel.
4. Crear la carpeta de datos una vez, como root. `/var/www/<dominio>` pertenece a root
   (lo exige el encierro de SFTP), así que PHP no puede crearla solo:
   ```bash
   d=/var/www/<dominio>
   sudo install -d -o "$(stat -c %U $d/public)" -g "$(stat -c %G $d/public)" -m 0700 $d/data
   ```
5. Probar el formulario. Si responde "Algo salió mal", mirar el error log de Nginx del
   sitio (`/var/log/nginx/<dominio>.error.log`).

## Lista de interesados

`data/subscribers.csv` sólo se puede leer desde el servidor (SFTP en `/site/data`).
Los emails se guardan en minúsculas, sin duplicados, junto con la fecha y el idioma
elegido. No se guardan direcciones IP: el freno anti-abuso usa sólo un hash
temporal en `data/throttle/`, que puede borrarse en cualquier momento.

Para dar de baja a alguien, borrar su línea del CSV.

## Desarrollo local

```bash
php -S localhost:8080 -t public
```

Abrir <http://localhost:8080>. El formulario funciona igual y escribe en `data/`.

## Dominio y correo

- Dominio: `denebpanel.com` (DNS en Cloudflare). La página declara
  `https://denebpanel.com/` como URL canónica y usa `public/og-image.png` (1200×630)
  como vista previa al compartir.
- Contacto en el pie: `hola@denebpanel.com` y `security@denebpanel.com`, recibidos con
  Cloudflare Email Routing (sólo recepción).

## Pendiente

- Capturas reales del panel en lugar de la maqueta HTML.
- Link al repositorio público y botón de instalación cuando se libere el código.
