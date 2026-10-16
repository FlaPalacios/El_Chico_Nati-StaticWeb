---
name: cerrar-fase
description: Cierra una fase del proyecto El Chico Naturista. Corre build y pruebas, lanza en paralelo los agentes revisores que pide la matriz del plan, consolida los informes, actualiza la bitácora y, con el visto bueno de Fernando, hace commit "ECN-v0.N descripción", tag y push. Usar cuando el usuario escriba /cerrar-fase N o diga que una fase está lista para commit.
argument-hint: "<número de fase> [descripción corta]"
disable-model-invocation: true
---

# Cerrar fase

Argumentos: `$ARGUMENTS` (número de fase N y, opcional, descripción corta del commit).

## 1. Comprobar que la fase está completa

1. Lee en `PLAN-v2.md` la sección 10, fase N. Para cada tarea (ID), di si está hecha y cómo se verificó. Si alguna falta, detente y dilo; no sigas al paso 2.
2. Revisa la sección 13: si una pregunta abierta bloquea esta fase, detente.

## 2. Comprobaciones automáticas

Ejecuta, según existan en `package.json`:

```
npm test
npm run sync
npm run build
```

Si alguno falla, corrige antes de seguir. No pases a los agentes con el build roto.

Comprobación rápida de privacidad: `git status --porcelain` no debe listar nada de `-recursos/`, ningún `.xlsx` ni `.env`.

## 3. Revisión de agentes

Lee la fila de la fase N en la matriz de `PLAN-v2.md` sección 9.2. Lanza **en un solo mensaje y en paralelo** los agentes marcados con R (`revisor-codigo`, `qa-navegador`, `revisor-seguridad`). A cada uno pásale:

- El número de fase y la lista de tareas (IDs) que se cerraron.
- Qué cambió (resumen de `git diff --stat` o de los archivos nuevos).
- Para `qa-navegador`: la URL a probar si ya hay un servidor corriendo, y los flujos de la fase.

## 4. Consolidar

- Junta los informes en una tabla: agente, resultado, bloqueantes, mejoras.
- Si hay bloqueantes: corrígelos, vuelve a correr el paso 2 y relanza **solo** el agente que bloqueó. Repite hasta que todos aprueben.
- Las mejoras no bloqueantes se anotan como pendientes, no se arreglan ahora salvo que sean triviales.

## 5. Bitácora

Agrega una fila a `docs/fases.md` (versión, fase, fecha `AAAA-MM-DD`, qué se cerró, revisores que aprobaron, pendientes) y actualiza la línea "Fase activa".

## 6. Visto bueno y commit

1. Muestra a Fernando: resumen de la fase, tabla de revisiones, archivos que entran al commit (`git status --short`) y el mensaje propuesto:
   `ECN-v0.N <descripción corta>` (si no la dio, propón una de 3 a 8 palabras en español).
2. **Espera su confirmación explícita.** Sin un "sí" no hay commit ni push.
3. Con el sí:
   ```
   git add -A
   git status --short          # revisar otra vez que no entre nada privado
   git commit -m "ECN-v0.N <descripción corta>" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
   git tag ECN-v0.N
   git push origin main --tags
   ```
4. Si es la primera vez y no hay repo: `git init -b main` y `git remote add origin https://github.com/FlaPalacios/El_Chico_Nati-StaticWeb.git` antes del paso 3.
5. Si el push falla por autenticación, no intentes otra vía: dile a Fernando que inicie sesión (`gh auth login` o el gestor de credenciales de Git) y que vuelva a pedir el push.

Correcciones posteriores sobre una versión ya cerrada: `ECN-v0.N.1 <descripción>`, sin tag nuevo salvo que se pida.
