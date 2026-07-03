---
name: producer
description: "Generate new daily logs and OKF content using Garmin data."
---

# Producer Skill

This skill provides instructions on how to produce new knowledge, specifically daily logs, in the `health-okf` repository.

## Daily Log Generation

To generate a new daily log using Garmin data, you must run the provided script or use Garmin MCP tools to pull the necessary metrics.
**CRITICAL RULE**: The `producer` skill is STRICTLY for data ingestion. You must ONLY write raw data and metrics into the log files. You MUST NOT generate analysis, advice, or recommendations in the logs. Leave the analysis and recommendations entirely to the `consumer` skill.

### Prerequisites

The script requires environment variables `GARMIN_EMAIL` and `GARMIN_PASSWORD`, which are stored in the `.env` file at the root of the repository.

### Commands and Usage Examples

The script `garmin_health_report.py` supports several arguments to customize the report generation. Ensure you source the `.env` file or pass the variables appropriately in the shell command before running it.

#### Generate today's report
```bash
export $(grep -v '^#' .env | xargs) && uv run $HOME/bin/garmin_health_report.py
```

#### Generate a report for a specific date
Use the `--date` or `-d` flag in `YYYY-MM-DD` format.
```bash
export $(grep -v '^#' .env | xargs) && uv run $HOME/bin/garmin_health_report.py --date 2023-10-01
```

#### Save output directly to a file
Use the `--output` or `-o` flag to save the Markdown output directly to a file. Ensure you use the year/month structure.
```bash
export $(grep -v '^#' .env | xargs) && uv run $HOME/bin/garmin_health_report.py --date 2023-10-01 --output logs/2023/10/2023-10-01.md
```

#### Additional Options
- `--json`: Guarda los datos crudos en `.json`
- `--json-stats-week`, `--json-stats-month`: Guarda estadísticas históricas
- `--debug-spo2`: Muestra detalle de SpO₂ por hora para todo el día (24h)

### Formatting the Output

### Formatting the Output and Templates

- Al crear o procesar un log diario, utiliza siempre la plantilla `logs/templates/daily.md`. **CRÍTICO:** El output en crudo del script de Garmin NO contiene el YAML frontmatter requerido por OKF. Debes extraer el bloque YAML frontmatter de la plantilla `daily.md` (actualizando los campos `type`, `title`, `tags` y `timestamp`) e inyectarlo en la parte superior del log diario generado. NUNCA dejes un archivo `.md` sin su bloque `---` inicial de frontmatter.
- Asegúrate de rellenar las secciones de **Entrenamiento y Carga**, calculando el tonelaje (fuerza) y el Training Effect (cardio).
- Mantén el formato `logs/YYYY/MM/YYYY-MM-DD.md`.
- Keep Garmin metrics in native units (mmHg, bpm, ms).

### Post-Processing: Cascada de Resúmenes y Entrenamientos

Después de ejecutar el script y generar el reporte diario, debes realizar obligatoriamente la **agregación en cascada**:

1. **Registrar Entrenamientos Disponibles:**
   - Usa MCP (`get_workouts` o `get_training_plan_workouts` de Garmin) para añadir la lista de entrenamientos disponibles a la sección correspondiente del log diario.

2. **Cascada a Resumen Semanal (`logs/YYYY/MM/week-XX.md`):**
   - Usa la plantilla `logs/templates/weekly.md`.
   - Suma el tonelaje de fuerza de todos los días de la semana y agrégalo por grupo muscular.
   - Suma el volumen cardiovascular de la semana y promedia los efectos aeróbico/anaeróbico.
   - Evalúa la tendencia de salud (PA, HRV, Body Battery).

3. **Cascada a Resumen Mensual (`logs/YYYY/MM/summary.md`) y Anual:**
   - Al cierre de mes, usa la plantilla `logs/templates/monthly.md`, sumando el tonelaje y volumen de las 4 semanas para evaluar progresión del mesociclo.
   - A final de año, usa `logs/templates/yearly.md` alimentado por los meses para evaluar el macrociclo.
