# Configuración de Supabase — Marilyn Coiffure

Esta carpeta contiene la estructura de base de datos, seguridad y datos provisionales. Ninguna clave privada debe agregarse al repositorio.

## 1. Crear el proyecto

1. Ingresá a Supabase y creá un proyecto nuevo.
2. Guardá la contraseña de base de datos en un gestor seguro; no la copies al código.
3. Esperá a que el proyecto finalice su preparación.

## 2. Configurar variables locales

1. Copiá `.env.example` como `.env` en la raíz.
2. En **Project Settings → API**, copiá únicamente Project URL en `VITE_SUPABASE_URL` y Publishable/anon key en `VITE_SUPABASE_ANON_KEY`.
3. Reiniciá `npm run dev`.

El frontend nunca necesita la `service_role` key. `.env` está ignorado por Git.

## 3. Ejecutar la migración

Abrí **SQL Editor**, copiá y ejecutá `migrations/202608050001_initial_schema.sql`. Confirmá que se crearon `profiles`, `categories`, `styles`, `professionals`, `style_professionals` y `site_settings`.

La migración también crea el bucket público `site-images`, limita cada archivo a 5 MB y acepta JPG, PNG y WEBP.

Después de la migración inicial, ejecutá manualmente `migrations/202608060001_add_products.sql` para habilitar la administración de Productos. Esta migración es adicional, no destructiva y no se ejecuta automáticamente en producción.

## 4. Cargar los datos iniciales

Ejecutá `seed.sql` desde SQL Editor. Usa UUID conocidos, `upsert` y `on conflict`, por lo que puede repetirse sin duplicar registros. Los textos, nombres e imágenes son provisionales. No carga números inventados.

## 5. Crear la única cuenta administradora

1. Abrí **Authentication → Users → Add user**.
2. Creá manualmente el correo y una contraseña segura.
3. Copiá el UUID del usuario.
4. Ejecutá, reemplazando los valores:

```sql
insert into public.profiles (id, email, role, full_name)
values ('UUID_DEL_USUARIO', 'CORREO_ADMIN', 'admin', 'NOMBRE_ADMIN')
on conflict (id) do update
set email = excluded.email,
    role = 'admin',
    full_name = excluded.full_name;
```

No hay registro público. Una cuenta autenticada sin `profiles.role = 'admin'` no puede abrir ni modificar el panel.

## 6. Verificar Storage

En **Storage** debe aparecer `site-images`. Las carpetas `styles/`, `professionals/`, `products/` y `home/` se crean al subir contenido. La lectura es pública; INSERT, UPDATE y DELETE requieren `public.is_admin()`.

Una vez aplicada la migración de Productos, ingresá a `/admin/productos` para crear, editar, ordenar, destacar y publicar artículos. Hasta entonces, la página pública usa el catálogo provisional centralizado sin bloquear el resto del sitio.

## 7. Verificar RLS

En **Database → Tables**, confirmá que RLS está activo. Probá que:

- Una sesión anónima lee únicamente categorías, estilos y profesionales activos.
- INSERT, UPDATE y DELETE anónimos son rechazados.
- Una cuenta autenticada sin perfil admin sigue sin poder escribir.
- La cuenta admin puede gestionar contenido.

No reemplaces las políticas por escrituras abiertas con `using (true)`.

## 8. Configurar WhatsApp

En `/admin/configuracion`, guardá el número general como `595XXXXXXXXX`. Configurá números individuales en `/admin/profesionales`. Sin número individual se usa el general; sin ambos, la consulta queda deshabilitada.

## 9. Probar el panel

1. Ejecutá `npm install` y `npm run dev`.
2. Abrí `/admin/login` e ingresá con la cuenta creada.
3. Probá crear, editar, desactivar y ordenar categorías.
4. Probá crear un estilo, subir una imagen y relacionar profesionales.
5. Probá una profesional y su WhatsApp.
6. Actualizá portada y configuración.
7. Cerrá sesión y comprobá la redirección de `/admin`.
8. Revisá Inicio → Estilos → Profesionales → Consulta.

## Datos todavía pendientes

- Correo, contraseña y nombre de la administradora.
- Número general y números de profesionales.
- Fotografías reales.
- Textos comerciales finales.
- Dirección y horario.
- Dominio conectado.
- Variables locales y de Vercel.
