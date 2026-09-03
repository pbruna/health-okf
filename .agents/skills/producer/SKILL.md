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
- **Registro de TRT:** Si el operador informa de una inyección de Testosterona (Sustanon u otro), DEBES registrarla en la tabla "Historial de Inyecciones Recientes" del archivo `protocols/trt.md` con su fecha, hora, dosis y PA post. También debes marcar el check correspondiente en la sección "Inputs Hidráulicos y Farmacológicos" del log diario.
- **Protocolo de Rescate Clonazepam (01/09 - 11/09/2026):** Durante este período, el operador está en un desmonte ultra-controlado. DEBES:
  1. **Preguntar automáticamente** en cada interacción sobre el cumplimiento del protocolo del día
  2. **Registrar en la sección correspondiente** del log diario las confirmaciones de:
     - Clonazepam según horario y dosis del protocolo (11:00am)
     - Zolpidem según horario del protocolo (22:00 noche anterior)
     - TRT si corresponde según `protocols/trt.md`
  3. **Crear una tabla de seguimiento** en cada log diario durante este período:
     ```
     ## Seguimiento Protocolo de Rescate - Día X
     
     | Medicamento | Dosis Programada | Hora Programada | ¿Tomado? | Hora Real | Observaciones |
     |---|---|---|---|---|---|
     | Clonazepam | [según protocolo actualizado] | [08:00am o SKIP] | [ ] | | |
     | Zolpidem (noche anterior) | 12.5mg o SKIP | 22:00 | [ ] | | |
     | Oltan-D | 1 comp | 07:00 | [ ] | | |
     ```
     **PROTOCOLO FINAL CONFIRMADO:**
     - **01/09 (Mar):** Clonazepam 0.25mg (11:00am) + Zolpidem Sommit CR 12.5mg (22:00)
     - **02/09 (Mié):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + 🏋️ Pull Upper
     - **03/09 (Jue):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + 🏃 Trote Z2
     - **04/09 (Vie):** 🏃 Trote 05:30 + TRT 0.25ml (08:30) + **Sommit CR 12.5mg (13:00 SIESTA)** 💤 + Modafinilo 25mg (18:00) + 🚗 Manejo 22:00-08:00
        └── NO clonazepam (SKIP)
        └── NO Zolpidem nocturno (se usó como siesta)
     - **05/09 (Sáb):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00)
     - **06-07/09 (Dom-Lun):** Clonazepam 0.125mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + Full Body A
     - **08-10/09 (Mar-Jue):** Solo Zolpidem Sommit CR 12.5mg (22:00) — entreno normal
     - **11/09+:** Evaluar Zolpidem
     
     **NOTA:** Zolpidem del operador es **Sommit CR 12.5mg** (liberación controlada, no común).
     
     **SEGUIMIENTO ESPECIAL VIERNES:**
     - Monitoreo PA: 08:00 (pre-TRT), 12:00, 16:00 (pre-manejo) - red flags >150/95
     - Confirmar TRT solo si gates cardiovasculares OK (PAS <135, PAD <90)
     - Registrar hora exacta Sommit CR siesta y modafinilo
     - El operador es atleta experimentado (VO2max 46, 8 maratones). Ejercicio es terapéutico.

### Post-Processing: Cascada de Resúmenes y Entrenamientos

Después de ejecutar el script y generar el reporte diario, debes realizar obligatoriamente la **agregación en cascada**:

1. **Registrar Entrenamientos y Composición Corporal:**
   - Usa MCP (`get_workouts` o `get_training_plan_workouts` de Garmin) para añadir la lista de entrenamientos disponibles a la sección correspondiente del log diario.
   - **NUEVO:** Usa MCP (`get_body_composition` o `get_weigh_ins`) para capturar los datos de la pesa Garmin Index S2 (Peso, Grasa Corporal %, Masa Muscular) y regístralos en la sección de métricas del día o semana. Esto es vital para el seguimiento de la estrategia de "Cuerpo Estilizado".

2. **Cascada a Resumen Semanal (`logs/YYYY/MM/week-XX.md`):**
   - Usa la plantilla `logs/templates/weekly.md`.
   - Suma el tonelaje de fuerza de todos los días de la semana y agrégalo por grupo muscular.
   - Suma el volumen cardiovascular de la semana y promedia los efectos aeróbico/anaeróbico.
   - Evalúa la tendencia de salud (PA, HRV, Body Battery).
   - **Señales Temporales:** Consulta la sección "Señales Temporales y Eventos Activos" en `index.md` e incluye cualquier señal/evento activo durante esta semana en el resumen, para mantener la trazabilidad histórica de los eventos que afectaron las métricas.

3. **Cascada a Resumen Mensual (`logs/YYYY/MM/summary.md`) y Anual:**
   - Al cierre de mes, usa la plantilla `logs/templates/monthly.md`, sumando el tonelaje y volumen de las 4 semanas para evaluar progresión del mesociclo.
   - Consulta e incluye las "Señales Temporales y Eventos Activos" de `index.md` que hayan estado presentes en el mes.
   - A final de año, usa `logs/templates/yearly.md` alimentado por los meses para evaluar el macrociclo.
