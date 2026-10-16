# Bitácora de fases

Fase activa: **Fase 2 (v0.2), dirección visual**. Última cerrada: v0.1.

| Versión | Fase | Fecha | Qué se cerró | Revisores | Pendientes |
|---|---|---|---|---|---|
| v0.0 | Plan y estructura | 2026-10-15 | PLAN-v2.md con respuestas de Fernando, CLAUDE.md, .gitignore, agentes y skills, git conectado, repositorio anterior clonado en `referencia/` | Revisión manual de lo que entra al commit | — |
| v0.1 | 1. Preparación | 2026-10-15 | Astro 7.3.5 estático + Alpine CSP 3.17.4; `preparar-datos` genera `data/catalogo-inicial.tsv` (29 productos, 23 visibles, sin stock) y `descripciones-pendientes.txt` (11); 11 pruebas `node --test`; fuentes Hind y Amulya en `public/fonts/`; `.gitattributes` LF; hosting Cloudflare Pages y correo `contacto@elchiconaturista.com` decididos | revisor-codigo, revisor-seguridad, qa-navegador: aprobados | Verificar 67/68 % de ECN-022 antes de publicar (S4); licencia web de Amulya (v1.0); el test de estado fija 29/23 y se actualiza cuando cambie la hoja; QA usó iframes porque la ventana de Chrome estaba minimizada |
