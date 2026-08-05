# Marilyn Coiffure

Sitio web profesional para Marilyn Coiffure, desarrollado con React, Vite y TypeScript.

## Desarrollo local

```bash
npm install
npm run dev
```

## Verificación de producción

```bash
npm run build
npm run preview
```

## Estado del proyecto

Las Etapas 1 a 4 incluyen la base técnica, el sistema visual, la página de inicio responsive, el catálogo en `/estilos`, la selección de profesionales en `/profesionales` y la consulta preparada para WhatsApp en `/consulta`.

Los estilos y profesionales usan datos centralizados en `src/data/`. Las selecciones y el borrador del formulario se conservan temporalmente en `sessionStorage`; la consulta usa parámetros de URL solo para estilo y profesional, nunca para datos personales.

El número general del salón se configura en `src/config/site.ts`. Mientras esté vacío, el formulario permite revisar el mensaje pero mantiene deshabilitada la apertura de WhatsApp.

Los datos de contacto, enlaces sociales, fotografías, precios y profesionales se mantienen como contenido provisional hasta recibir la información oficial del negocio.

## Etapa 5

El proyecto incluye un panel privado en `/admin/login`, conexión con Supabase Auth, Database y Storage, CRUD de categorías, estilos, profesionales y configuración, además de migraciones RLS y un seed idempotente.

Sin variables de Supabase la web pública utiliza el contenido provisional local y el login muestra una explicación clara. Consultá `supabase/README.md` para crear el proyecto, cargar el esquema, crear la cuenta admin y probar las políticas.
