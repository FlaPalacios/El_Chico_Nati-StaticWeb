---
name: datos-catalogo
description: Reglas y pasos para trabajar con los datos del catálogo de El Chico Naturista (Excel Master, catalogo-ECN-productos.tsv, descripciones-faltantes.tsv, data/catalogo-inicial.tsv, CATALOGO_URL y scripts/sync-catalogo.mjs). Usar al tocar datos de productos, precios, fotos, categorías o marcas, al correr o modificar el sync, o al interpretar un error de validación.
---

# Datos del catálogo

## Precedencia

1. **Excel Master** (`-recursos/El Chico Naturista – Control de operaciones (Master).xlsx`, en Google Sheets): manda en código, nombre, presentación, precio (columna "Precio en la web") y si un producto está activo (columna "Notas" de Productos, por ejemplo "Inactivo en la web").
2. **`-recursos/catalogo-ECN-productos.tsv`**: slugs, categorías, marcas, descripciones, beneficios, fotos, destacado.
3. **`-recursos/descripciones-faltantes.tsv`**: borradores. Solo llenan celdas vacías y quedan listados en `data/descripciones-pendientes.txt` hasta que se verifiquen.

Si dos fuentes no coinciden, gana la de arriba y se anota la diferencia. No se inventa ningún valor: lo que falta queda vacío.

## Lo que nunca sale de `-recursos/`

Stock, costos, proveedor, margen, ganancia, compras, ventas, nombres de clientes, contactos de proveedores. El repositorio es público.

Para leer el Excel sin modificarlo: Python con `openpyxl` en modo `data_only=True`. Solo para cruzar datos; nunca copiar sus pestañas privadas a otro archivo del proyecto.

## Flujo

```
-recursos/*.tsv --npm run preparar-datos--> data/catalogo-inicial.tsv (solo columnas públicas)
data/catalogo-inicial.tsv  o  CATALOGO_URL --npm run sync--> src/data/*.json
```

- `CATALOGO_URL` (Fase 8) es el CSV publicado de la pestaña "Catálogo web". Si existe, el sync la usa; si no, usa `data/catalogo-inicial.tsv`.
- Los JSON de `src/data/` son generados. No se editan a mano.

## Columnas y validación

Las columnas, tipos y reglas están en `PLAN-v2.md` sección 5. Resumen:

- Visible = `activo = si` y `precio > 0`.
- **Error** (rompe el build): columna faltante o prohibida, código o slug inválido o repetido, precio no numérico, slugs de categoría, subcategoría o marca inconsistentes, imagen fuera de `res.cloudinary.com`, cero productos visibles.
- **Aviso** (compila): activo sin precio, visible sin foto o sin descripción corta, `precio_antes` menor o igual que `precio`.
- Lectura tolerante: TSV o CSV, BOM, decimales con punto o coma, `S/` delante, `si`/`sí`/`Sí`.

## Cómo leer un error del sync

El mensaje trae código, columna y valor, por ejemplo:

```
ECN-031, columna precio: "cuarenta" no es un número.
```

La corrección se hace en la hoja (o en `data/catalogo-inicial.tsv` mientras no exista la hoja), nunca en los JSON.

## Estado conocido (15 de octubre de 2026)

23 productos visibles, 3 categorías, 8 subcategorías, 6 marcas visibles (Tarwi Foods solo tiene inactivos). ECN-022 se publica (confirmado por Fernando aunque el Master aún diga "Inactivo en la web"). Diferencias y su resolución: `PLAN-v2.md` sección 4.2 (D1 a D21).

Datos de la tienda, envío y ubigeo: salen de `referencia/ElChicoNaturista-anterior/` según `PLAN-v2.md` sección 5.4.
