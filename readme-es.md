# 🎬 Juan's Favorites

Juan's Favorites es una aplicación web personal construida con Astro que muestra una colección curada de mis libros, películas, programas de TV, juegos, artistas y podcasts favoritos. La aplicación obtiene datos en tiempo real de múltiples APIs, proporcionando información detallada como títulos, fechas de lanzamiento, calificaciones y más.

Lee el [README en inglés](readme.md) para más información.

## 🌐 Demo en Vivo

- Sitio principal: fav.jpdiaz.dev
- Respaldo: juan-favorites.pages.dev

## 📚 Categorías de Contenido

- **Libros** — Ficción, no ficción y todo lo que está en el medio
- **Películas** — Cine que dejó una impresión  
- **Programas de TV** — Series que valen tu tiempo
- **Juegos** — Experiencias interactivas que cautivan
- **Artistas** — Músicos y creadores que inspiran
- **Podcasts** — Conversaciones e historias que vale la pena escuchar

## 🚀 Tecnologías Utilizadas

- Astro – Framework moderno para construir sitios web rápidos.
- Tailwind CSS – Framework de CSS utilitario para diseño responsivo.
- TMDB API – Fuente de datos de películas y programas de TV.
- Listen Notes API – Datos y metadatos de podcasts.
- IGDB API – Información de videojuegos a través del portal de desarrolladores de Twitch.
- MusicBrainz API – Datos de artistas y música.
- Cloudflare Pages – Plataforma de despliegue para sitios estáticos.

## 🧰 Estructura del Proyecto

```
juan-favorites/
├── public/               # Recursos estáticos
├── scripts/              # Generar archivos de datos
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── config/           # Archivos de configuración
│   ├── data/             # Archivos de datos
│   ├── layouts/          # Plantillas de diseño
│   ├── pages/            # Páginas del sitio
│   ├── scripts/          # Archivos JavaScript
│   └── styles/           # Estilos globales
├── .env.example          # Variables de entorno de ejemplo
├── astro.config.mjs      # Configuración de Astro
├── package.json          # Dependencias y scripts
└── tailwind.config.cjs   # Configuración de Tailwind CSS
```

## ⚙️ Comenzando

1. Clonar el repositorio:

```bash
git clone https://github.com/JuanPabloDiaz/juan-favorites.git
cd juan-favorites
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` y reemplaza los valores de marcador de posición con tus claves de API reales.

4. Obtener datos iniciales:

```bash
npm run fetch-data
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

6. Ver la aplicación:
   Abre tu navegador y navega a `http://localhost:4321` para ver la aplicación en acción.

## 🔑 Configuración de API

<details>

1. Ve a [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Crea una cuenta y solicita una clave de API
3. Agrégala a tu archivo `.env`:
   ```
   TMDB_API_KEY=TU_CLAVE_API_TMDB
   ```
</details>

<details>
<summary><strong>🎵 API de MusicBrainz (Artistas)</strong></summary>

La API de MusicBrainz no requiere una clave de API, pero debes configurar una cadena User-Agent apropiada:

```
MUSICBRAINZ_USER_AGENT=NombreDeTuApp/1.0.0 (tu-email@ejemplo.com)
```
</details>

<details>
<summary><strong>🎙️ Clave de API de Listen Notes (Podcasts)</strong></summary>

1. Ve a [Listen Notes API](https://www.listennotes.com/api/)
2. Regístrate y obtén tu clave de API
3. Agrégala a tu archivo `.env`:
   ```
   LISTEN_NOTES_API_KEY=TU_CLAVE_API_LISTEN_NOTES
   ```

**Consideraciones de la API:**
- **Límites de API**: El nivel gratuito típicamente permite ~10,000 solicitudes por mes
- **Retraso del Script**: El script de obtención incluye un retraso de 1 segundo entre llamadas de API para respetar los límites de velocidad
- **Precisión de Búsqueda**: Depende de que los nombres de podcasts en `myFavPodcasts.json` coincidan con la base de datos de Listen Notes
</details>

<details>
<summary><strong>🎮 Credenciales de API de IGDB (Juegos)</strong></summary>

Este proyecto utiliza la API de Internet Game Database (IGDB) a través del portal de desarrolladores de Twitch.

**Pasos para obtener tus credenciales de IGDB:**

1. **Ve al Portal de Desarrolladores de Twitch:** Navega a [https://dev.twitch.tv/](https://dev.twitch.tv/)
2. **Iniciar Sesión/Registrarse:** Inicia sesión con tu cuenta existente de Twitch, o crea una si no la tienes
3. **Registrar Tu Aplicación:**
   - Una vez iniciada la sesión, ve a tu Dashboard o la sección "Applications"
   - Haz clic en "Register Your Application" (o "+ Register Application")
   - **Nombre:** Dale a tu aplicación un nombre único (ej: "MyFavoritesSite_Games")
   - **URLs de Redirección OAuth:** Configúralo como `http://localhost:3000` o cualquier URL de marcador de posición
   - **Categoría:** Elige "API" o "Application Integration"
   - Haz clic en "Create"
4. **Obtener Tu Client ID:** Tu **Client ID** será visible en la página de gestión de aplicaciones
5. **Generar un Client Secret:** Haz clic en "New Secret" para generar tu **Client Secret**
   - **Importante:** Cópialo inmediatamente y guárdalo de forma segura. Twitch solo lo muestra una vez
6. **Configurar Variables de Entorno:**
   ```env
   IGDB_CLIENT_ID=tu_client_id_de_twitch_aqui
   IGDB_CLIENT_SECRET=tu_client_secret_de_twitch_aqui
   ```

Estas credenciales se utilizarán para obtener automáticamente un token de acceso OAuth de Twitch para las solicitudes de la API de IGDB.
</details>

<details>
<summary><strong>📖 Configuración de API de Libros</strong></summary>

*Agrega aquí los detalles de configuración de tu API de libros cuando esté implementada*

```
BOOKS_API_KEY=TU_CLAVE_API_LIBROS
```
</details>

## 📦 Scripts Disponibles

- `npm run dev` – Iniciar el servidor de desarrollo
- `npm run build` – Construir el proyecto para producción
- `npm run preview` – Previsualizar la construcción de producción localmente
- `npm run fetch-movies` – Obtiene datos de películas de la API de TMDB
- `npm run fetch-music` – Obtiene datos de música de la API de MusicBrainz
- `npm run fetch-podcasts` – Obtiene detalles de podcasts usando la API de Listen Notes
- `npm run fetch-games` – Obtiene datos de juegos de la API de IGDB
- `npm run fetch-books` – Obtiene datos de libros *(cuando esté implementado)*
- `npm run fetch-data` – Ejecuta todos los scripts de obtención de datos
- `npm run format` – Ejecutar Prettier para formatear el código

## 📱 Gestión de Contenido

<details>
<summary><strong>🎙️ Gestión de Podcasts Favoritos</strong></summary>

Tus podcasts favoritos se gestionan a través del archivo `src/data/myFavPodcasts.json`. Para agregar, eliminar o cambiar los podcasts mostrados en el sitio, edita este archivo.

El formato es un array JSON simple de objetos:

```json
[
  { "name": "Nombre del Podcast 1" }, 
  { "name": "Otro Título de Podcast" }
]
```

**Pasos Importantes Después de Editar:**

1. **Ejecutar el Script de Obtención**: Después de modificar `myFavPodcasts.json`, **debes** ejecutar:
   ```bash
   npm run fetch-podcasts
   ```

2. **Verificar Salida de Consola**: El script registrará su progreso. Si no se puede encontrar el nombre de un podcast, se registrará una advertencia.

3. **Solución de Problemas**: Si un podcast no aparece:
   - Verifica la salida de consola del script de obtención
   - Verifica la ortografía del nombre del podcast
   - Prueba variaciones del nombre si la API no puede encontrar una coincidencia exacta
</details>

<details>
<summary><strong>🎵 Gestión de Artistas Favoritos</strong></summary>

*Agrega detalles sobre la gestión de artistas cuando la función esté completamente implementada*

Los artistas favoritos se gestionan a través de `src/data/myFavArtists.json`:

```json
[
  { "name": "Nombre del Artista 1" },
  { "name": "Otro Artista" }
]
```

Ejecuta `npm run fetch-music` después de hacer cambios.
</details>

<details>
<summary><strong>🎮 Gestión de Juegos Favoritos</strong></summary>

*Agrega detalles sobre la gestión de juegos cuando la función esté completamente implementada*

Los juegos se gestionan a través de la integración con IGDB. Ejecuta `npm run fetch-games` para actualizar los datos de juegos.
</details>

<details>
<summary><strong>📖 Gestión de Libros Favoritos</strong></summary>

*Agrega detalles sobre la gestión de libros cuando la función esté completamente implementada*

Los libros se gestionarán a través de `src/data/myFavBooks.json`:

```json
[
  { "title": "Título del Libro", "author": "Nombre del Autor" }
]
```

Ejecuta `npm run fetch-books` después de hacer cambios.
</details>

## ✨ Detalles de Integración

<details>
<summary><strong>🎙️ Integración de Podcasts</strong></summary>

**Nuevos Archivos Creados:**
- `scripts/fetch-podcasts.js`: Script de Node.js para obtener datos de podcasts de la API de Listen Notes
- `src/data/myFavPodcasts.json`: Lista gestionada por el usuario de nombres de podcasts favoritos
- `src/data/podcastDetails.json`: Almacena información detallada de podcasts (gitignored, generado localmente)
- `src/components/PodcastCard.astro`: Componente para mostrar una tarjeta de podcast individual
- `src/pages/podcasts/index.astro`: Página principal para listar todos los podcasts favoritos
- `src/pages/fragments/PodcastList/index.astro`: Fragmento que obtiene y renderiza tarjetas de podcasts
- `src/pages/podcasts/[id].astro`: Página dinámica para mostrar detalles de podcasts
- `src/pages/fragments/PodcastDetails/[id].astro`: Fragmento para detalles específicos de podcasts

**Archivos Existentes Modificados:**
- `.env.example`: Agregado marcador de posición `LISTEN_NOTES_API_KEY`
- `package.json`: Agregado script `fetch-podcasts` y actualizado script `fetch-data`
- `astro.config.mjs`: Agregado `LISTEN_NOTES_API_KEY` a `vite.define`
- `src/components/Nav.astro`: Agregado enlace "Podcasts" a la navegación

**Nota sobre Carga de Datos:** Los componentes usan `Astro.glob()` para importar datos de `podcastDetails.json` para resolver problemas de construcción con módulos integrados de Node.js en el entorno Astro/Vite.
</details>

<details>
<summary><strong>🎵 Integración de Artistas</strong></summary>

*Agrega detalles sobre archivos de integración de artistas y estructura cuando esté implementado*
</details>

<details>
<summary><strong>🎮 Integración de Juegos</strong></summary>

*Agrega detalles sobre archivos de integración de juegos y estructura cuando esté implementado*
</details>

<details>
<summary><strong>📖 Integración de Libros</strong></summary>

*Agrega detalles sobre archivos de integración de libros y estructura cuando esté implementado*
</details>

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

Construido con ❤️ por [Juan Pablo Diaz](https://jpdiaz.dev)