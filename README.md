# 🌿 PlantIdentifier - Discover the Wonders of Nature

![Plant Identifier Preview](https://yourimagelink.com/preview.png)

## 🌟 Overview

**PlantIdentifier** es una aplicación diseñada para ayudar a los usuarios a identificar plantas subiendo imágenes de las mismas. Utiliza un enfoque intuitivo donde el usuario puede cargar imágenes y recibir detalles sobre la especie de planta identificada, así como su rareza y calidad según el análisis visual.

La aplicación cuenta con características visuales interactivas como barras de calidad, rareza y comparaciones entre diferentes especies de plantas, todo en una interfaz amigable y moderna.

## 🛠️ Features

### 🌱 Image Upload and Plant Identification
- **Fácil carga de imágenes**: Los usuarios pueden seleccionar imágenes de sus plantas para cargarlas y procesarlas, permitiendo que el sistema las identifique automáticamente.
- **Comparación de especies**: Después de la identificación, los usuarios pueden comparar diferentes plantas entre sí para entender mejor sus diferencias y características únicas.

### 💡 Visual Feedback
- **Calidad de la planta**: Una barra indica la calidad de la planta basada en el análisis de la imagen, con un sistema de evaluación visual intuitivo.
- **Rareza de la planta**: La aplicación muestra cuán rara es la planta, utilizando una barra de rareza que va de menos a más rara, con colores que ayudan a interpretar la rareza de manera rápida y sencilla.

### 🎨 Customizable Interface
- **Modo oscuro**: Alterna fácilmente entre el modo claro y oscuro, permitiendo al usuario elegir el que más le acomode para su experiencia visual.
- **Detalles interactivos**: Los usuarios pueden desplegar y ocultar información adicional sobre el cuidado de las plantas, como riego, luz, temperatura y requisitos de suelo.

### 🔍 Precise Information Display
- **Información de cuidado**: Proporciona instrucciones detalladas para cuidar cada planta identificada, lo que incluye guías sobre riego, exposición a la luz, temperaturas ideales, y tipos de suelo recomendados.

## 📁 Project Structure

La estructura del proyecto sigue una arquitectura modular y escalable, lo que facilita la mantenibilidad y el crecimiento futuro del proyecto.

```plaintext
├── app/
│   ├── fonts/                       # Fuentes personalizadas usadas en el proyecto
│   ├── favicon.ico                  # Icono de la aplicación
│   ├── globals.css                  # Estilos globales y configuración de Tailwind
│   ├── layout.tsx                   # Estructura base de la app
│   ├── page.tsx                     # Página principal donde los usuarios interactúan
│   └── components/                  # Componentes reutilizables de la aplicación
│       └── PlantIdentifier.tsx      # Lógica principal del componente para cargar y analizar imágenes
├── node_modules/                    # Dependencias del proyecto (no incluidas en el repositorio)
├── public/
│   └── countries-110m.json          # Archivos públicos para mostrar imágenes u otros datos
├── .env.local                       # Variables de entorno (no deben subirse)
├── .eslintrc.json                   # Configuración de ESLint para el linting del código
├── .gitignore                       # Lista de archivos y carpetas a excluir del repositorio
├── next-env.d.ts                    # Tipos de Next.js
├── next.config.mjs                  # Configuración personalizada de Next.js
├── package.json                     # Dependencias y scripts del proyecto
├── package-lock.json                # Archivo de bloqueo de dependencias
├── postcss.config.mjs               # Configuración de PostCSS
├── README.md                        # Documentación del proyecto
├── tailwind.config.ts               # Configuración de Tailwind CSS
├── tsconfig.json                    # Configuración de TypeScript
