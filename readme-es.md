# 🎬 Juan’s Favorites

Juan’s Favorites es una aplicación web construida con Astro que muestra una colección curada de mis películas y series de televisión favoritas. La información se obtiene en tiempo real desde la API de TMDB, proporcionando detalles como títulos, fechas de lanzamiento, calificaciones y más.

Read the [English README](readme.md) for more information.

## 🌐 Demo en Vivo
- Sitio principal: fav.jpdiaz.dev
- Fallback: juan-favorites.pages.dev

## 🚀 Tecnologías Utilizadas
- Astro – Framework moderno para construir sitios web rápidos.
- Tailwind CSS – Framework de CSS utilitario para un diseño responsivo.
- TMDB API – Fuente de datos para películas y series.
- Cloudflare Pages – Plataforma de despliegue para sitios estáticos.

## 🧰 Estructura del Proyecto

```
juan-favorites/
├── public/               # Archivos estáticos
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── layouts/          # Plantillas de diseño
│   ├── pages/            # Páginas del sitio
│   └── styles/           # Estilos globales
├── .env.example          # Archivo de ejemplo para variables de entorno
├── astro.config.mjs      # Configuración de Astro
├── package.json          # Dependencias y scripts
└── tailwind.config.cjs   # Configuración de Tailwind CSS
```

⚙️ Configuración y Uso
1. Clona este repositorio:
```bash
git clone https://github.com/JuanPabloDiaz/juan-favorites.git
cd juan-favorites
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de ejemplo de variables de entorno y agrega tu clave de API de TMDB:
```bash
cp .env.example .env
```
Edita el archivo `.env` y reemplaza `YOUR_TMDB_API_KEY` con tu clave de API de TMDB.

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador y visita `http://localhost:3000` para ver la aplicación en acción.

## 📦 Scripts Disponibles
- `npm run dev` – Inicia el servidor de desarrollo.
- `npm run build` – Genera una versión de producción del sitio.
- `npm run preview` – Previsualiza la versión de producción localmente.
- `npm run fetch-data` – Obtiene datos de la API de TMDB y los guarda en archivos JSON.
- `npm run format` – Corre Prettier para formatear el código.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.