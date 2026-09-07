# Guía de Recursos Gráficos y Capturas de Pantalla
## Trujillo Engineering Guides & Research Hub

Esta carpeta (`public/images/`) está reservada para que puedas subir las capturas de pantalla reales y diagramas que complementarán visualmente las guías técnicas.

---

### ¿Qué ocurre mientras no subas las imágenes?
La web cuenta con maquetas visuales SVG integradas con sistema de respaldo automático (`fallback`). Si el archivo no existe en esta carpeta, la web muestra una previsualización vectorial elegante y estilizada para que el diseño nunca se rompa. En cuanto coloques las imágenes reales aquí, la web las detectará y mostrará inmediatamente.

---

### Lista de Imágenes Recomendadas y Nombres Exactos

1. **`cloudflare-dns-records.webp`** (o `.png`)
   - **Capítulo**: 3. Autenticación Criptográfica & DNS
   - **Contenido**: Captura del panel de Cloudflare DNS mostrando los 3 registros MX (`route1.mx.cloudflare.net`), el registro TXT de SPF y los 3 CNAME de DKIM de Resend.
   - **Resolución recomendada**: 1920×1080 o 1200×800 px.

2. **`resend-domain-verified.webp`** (o `.png`)
   - **Capítulo**: 3. Entregabilidad de Salida & Resend
   - **Contenido**: Captura de la pantalla de dominios de Resend con la insignia verde de **Verified** y 100% DKIM alineado.
   - **Resolución recomendada**: 1920×1080 o 1200×800 px.

3. **`cloudflare-email-routing.webp`** (o `.png`)
   - **Capítulo**: 4. Enrutamiento Edge Inbound
   - **Contenido**: Captura de Cloudflare Email Routing con una regla de redirección activa (ej: `contacto@tudominio.com` → `tucorreo@gmail.com`).
   - **Resolución recomendada**: 1920×1080 o 1200×800 px.

4. **`google-account-avatar.webp`** (o `.png`)
   - **Capítulo**: 5. Identidad y Avatar de Marca en Google
   - **Contenido**: Captura del panel de Google Account mostrando la cuenta creada con correo propio independiente y el logotipo oficial como foto de perfil pública.
   - **Resolución recomendada**: 1920×1080 o 1200×800 px.

5. **`gmail-send-as-smtp.webp`** (o `.png`)
   - **Capítulo**: 6. Configuración «Enviar como» en Gmail
   - **Contenido**: Captura de la ventana modal emergente de Gmail configurando `smtp.resend.com` en puerto 465 (SSL/TLS).
   - **Resolución recomendada**: 1200×900 px.

6. **`gmail-inbox-preview.webp`** (o `.png`)
   - **Capítulo**: Demostración de Bandeja de Entrada Real
   - **Contenido**: Captura de un correo recibido en Gmail donde se aprecie el avatar circular de tu marca, el remitente limpio (`contacto@tudominio.com`) y sin advertencias de seguridad.
   - **Resolución recomendada**: 1920×1080 px.

---

### Formato y Optimización
- **Formato ideal**: `.webp` (máxima compresión y fidelidad) o `.png` nítido.
- **Privacidad**: Recuerda pixelar o recortar contraseñas o tokens sensibles (por ejemplo los caracteres intermedios de tu API key de Resend `re_••••••••`).
