# ATM Docs — Technical Engineering Guides & Production Runbooks

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?logo=cloudflare&logoColor=white)](https://guides.trujillomingorance.com)
[![Status](https://img.shields.io/badge/Status-Operational-107c41)](#)
[![Design](https://img.shields.io/badge/Design_System-Mica_Corporate-0078d4)](#)

> **Production Gateway:** [guides.trujillomingorance.com](https://guides.trujillomingorance.com)

Base de conocimiento técnico, arquitecturas de producción y runbooks paso a paso desarrollados por **Alberto Trujillo Mingorance** bajo el sello de **ATM Software Labs**.

---

## 📚 Índice de Guías Disponibles

- **[Arquitectura de Correo Empresarial a Coste 0 €](https://guides.trujillomingorance.com/guides/enterprise-email/)**:
  Infraestructura transaccional y corporativa de email de nivel enterprise sin licencias recurrentes de Google Workspace ni Microsoft 365. Incluye DKIM, SPF, DMARC, avatares BIMI/Gravatar verificados y pipelines perimetrales con Cloudflare Email Routing y Resend.

---

## 🛠️ Stack & Arquitectura

- **Motor Estático:** Vanilla HTML5 semántico + CSS Moderno (Variables CSS, Glassmorphism, Micro-interacciones)
- **Alojamiento Edge:** Cloudflare Pages
- **Tema:** Dark Corporate Slate (`#080c14`), Tarjetas Acrílicas (`rgba(15, 22, 36, 0.78)`), Acento Azul Microsoft (`#0078d4`)
- **Internacionalización:** Selector de idioma bilingüe (ES / EN)
- **Estructura Modular:** Plantilla base (`guide-template.html`) para crear y publicar nuevos runbooks en minutos.

---

## 🚀 Despliegue en Cloudflare Pages

```bash
# Vía script npm
npm run deploy

# O directamente mediante Wrangler
npx wrangler pages deploy public --project-name trujillo-guides --commit-dirty=true
```

---

## 👤 Autor

**Alberto Trujillo Mingorance**  
- Portfolio: [alberto.trujillomingorance.com](https://alberto.trujillomingorance.com)  
- GitHub: [@atrumin16](https://github.com/atrumin16)
