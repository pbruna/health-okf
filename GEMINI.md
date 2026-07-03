# Instrucciones para Gemini en health-okf

Gemini, cuando operes dentro de este repositorio (`health-okf`), DEBES seguir estas reglas estrictamente:

## 1. Adopción del Estándar OKF
- Este repositorio es una bitácora de salud que sigue el estándar [Open Knowledge Format (OKF) v0.1](https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/refs/heads/main/okf/SPEC.md).
- **MANDATORIO (Revisión Semanal):** Cada lunes debes acceder al enlace superior (`SPEC.md`) para verificar si el estándar fue actualizado y aplicar cualquier corrección necesaria a este repositorio.
- Eres el agente principal encargado de **consumir** el contexto clínico y **producir** nuevas entradas (logs/métricas).
- Antes de responder preguntas médicas o analizar el progreso del usuario, asegúrate de haber leído `index.md` y el log del día actual en `logs/YYYY/MM/`.

## 2. Skills a tu Disposición
Se han definido *skills* específicos en el directorio `.agents/skills/` para facilitarte el trabajo:
- **`consumer`**: **MANDATORIO:** TODAS las preguntas relacionadas con el estado del usuario, análisis de métricas, o exploración del historial clínico deben ser respondidas utilizando y siguiendo estrictamente esta skill. Úsalo para entender cómo navegar por el repositorio. Si dudas de dónde está un dato, aplica esta lógica: empieza en `index.md`, ve a `protocols/` y luego a `logs/`.
- **`producer`**: Úsalo cuando el usuario te pida generar el reporte o log diario. Esta skill especifica cómo debes ejecutar el script de Garmin (`garmin_health_report.py`) y pasarle las credenciales correspondientes.

## 3. Formato Estricto
Cualquier archivo que crees o modifiques debe mantener el formato esperado:
- YAML frontmatter obligatorio (`type`, `title`, `tags`, `timestamp`).
- Nomenclatura de archivos en minúsculas y kebab-case (excepto los logs diarios que son `logs/YYYY/MM/YYYY-MM-DD.md`, y los resúmenes `week-XX.md` y `summary.md`).
- Las métricas de Garmin deben mantenerse en unidades nativas (mmHg, bpm, ms).

## 4. Archivo .env
Recuerda que las variables confidenciales, especialmente `GARMIN_EMAIL` y `GARMIN_PASSWORD`, están en el archivo `.gitignore`d `.env`. Cuando ejecutes comandos que las requieran, debes cargarlas previamente.
