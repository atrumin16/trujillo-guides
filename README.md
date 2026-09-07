# ATM Docs — Technical Engineering Guides & Production Runbooks

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://guides.trujillomingorance.com)
[![Status](https://img.shields.io/badge/Status-Operational-107c41?style=flat-square)](#)
[![Design](https://img.shields.io/badge/Design_System-Mica_Corporate-0078d4?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](#)

> **Production Gateway:** [guides.trujillomingorance.com](https://guides.trujillomingorance.com)  
> Base de conocimiento técnico, arquitecturas de producción y runbooks paso a paso desarrollados por **Alberto Trujillo Mingorance** bajo el sello de **ATM Software Labs**.

---

## 📚 Índice de Guías Disponibles

- **[Arquitectura de Correo Empresarial a Coste 0 €](https://guides.trujillomingorance.com/guides/enterprise-email/)**:
  Infraestructura transaccional y corporativa de email de nivel enterprise sin licencias recurrentes de Google Workspace ni Microsoft 365. Incluye DKIM, SPF, DMARC, avatares BIMI/Gravatar verificados y pipelines perimetrales con Cloudflare Email Routing y Resend.

---

## 🌿 Enterprise Branching Model

| Branch | Purpose | Deployment Target |
| :--- | :--- | :--- |
| `main` | **Production Release** | Deployed live to `guides.trujillomingorance.com` |
| `develop` | **Staging & Review** | Draft guides, technical review, and editorial QA |

---

## 📁 Repository Structure

```
trujillo-guides/
├── public/                  # Public web directory served by Cloudflare Pages
│   ├── guides/              # Technical deep-dives & architecture runbooks
│   │   └── enterprise-email/# Zero-Cost Enterprise Email Architecture guide
│   ├── index.html           # Guides directory homepage & search
│   └── 404.html             # Corporate 404 handler
├── package.json             # Deployment scripts
└── wrangler.toml            # Cloudflare Pages configuration
```

---

## 🛠️ Stack & Arquitectura

- **Motor Estático:** Vanilla HTML5 semántico + CSS Moderno (Variables CSS, Glassmorphism, Micro-interacciones)
- **Alojamiento Edge:** Cloudflare Pages
- **Tema:** Dark Corporate Slate (`#080c14`), Tarjetas Acrílicas (`rgba(15, 22, 36, 0.78)`), Acento Azul Microsoft (`#0078d4`)
- **Internacionalización:** Selector de idioma bilingüe (ES / EN)

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
