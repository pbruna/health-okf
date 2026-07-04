---
name: consumer
description: "Consume and navigate the OKF knowledge graph in the health-okf repository."
---

# Consumer Skill

This skill provides instructions on how to consume the Open Knowledge Format (OKF) data within this repository.

## Workflow for Consuming Knowledge

Whenever you need to answer a question or summarize the operator's clinical state, follow this sequence:

1. **Read `index.md`**: This is the entry point. It contains the base clinical profile, active conditions, and strategic goals.
2. **Follow Protocols**: Check the `protocols/` directory to understand the specifics of any treatments or active medications mentioned in the `index.md`.
3. **Check Logs**: Look at `logs/YYYY/MM/` for the most recent day (or the requested day) to get current context. Also check the latest weekly (`week-XX.md`) and monthly (`summary.md`) summaries to understand long-term trends.
4. **Data Verification**: **CRITICAL**: The `consumer` MUST NOT call Garmin MCP tools directly to fetch missing data. If the required information for the current day is not present in the logs, you must delegate to the `producer` skill to fetch the data and update the logs first.
5. **Review Metrics**: If specific historical data is needed (e.g., blood pressure trends), check the `metrics/` directory.
6. **Generate Recommendation**: Only after the logs have been fully updated with raw data by the `producer`, read the log files to generate your final analysis and recommendation.

## Rules

- Do not assume context. Always read the OKF files.
- **No Direct Data Fetching:** You must not fetch live data via Garmin MCP tools. Your sole source of truth is the markdown files.
- Follow relative links within the markdown files to discover related concepts.
- The standard assumes one concept per file.
- **Consultas sobre TRT / Sustanon:** Cuando el operador pregunte cuándo fue su última inyección o cuándo le toca la próxima, DEBES leer obligatoriamente `protocols/trt.md`, buscar la última fecha en "Historial de Inyecciones Recientes" y calcular la próxima según la frecuencia indicada. Antes de autorizar/recomendar inyectar, verifica SIEMPRE que las métricas del día actual cumplan con el "Gate de Validación para Inyección" (PAS, PAD, SpO2).
- **Health Status Inquiries y Perfil de Atleta Híbrido**: Cuando el operador consulte su estado de salud, información de entrenamiento o pregunte "¿cómo estoy?":
  1. **Análisis de Tendencias (Semanal y Mensual):** Procesa obligatoriamente el último resumen semanal (`week-XX.md`) y el último resumen mensual (`summary.md`). Esto es fundamental para determinar si las métricas alteradas del día representan un problema aislado o responden a una tendencia mayor (ej. enfermedades en curso, fatiga crónica, protocolos de medicamentos). Nunca evalúes el estado basándote exclusivamente en el log del día actual.
  2. **Perfil Híbrido (Recomposición):** El operador entrena recomposición estilizada (altas repeticiones, circuitos HIIT y cardio base aeróbico). Esto genera un alto grado de gasto calórico y estrés cardiovascular. Evalúa el progreso en función del volumen aeróbico y la oxidación de grasa, y no del tonelaje o fuerza máxima.
  3. **Matriz de Salud vs Volumen:** Utiliza la **Presión Arterial (PA)** y el **HRV** como semáforos absolutos. Si la PA está elevada o el HRV suprimido sistemáticamente, la recomendación debe ser *descarga (deload)* o *descanso absoluto*, incluso si las métricas de rendimiento/fuerza parecen ir bien. Prioriza siempre la salud cardiovascular y la recuperación por sobre el volumen.
  4. **Recomendaciones Proactivas:** Finaliza siempre **generando recomendaciones** de entrenamiento, descanso o ajustes de estilo de vida basados en tu análisis de tendencias y la matriz de salud, **incluso si el operador no solicitó recomendaciones explícitamente**.
  5. **Interpretación de Body Battery:** Al leer el reporte diario, el valor de Body Battery "al despertar" corresponde al valor **Máximo (Máx)** registrado en la sección "Mín/Máx", y NO al valor "Actual/Último".
  6. **Masa Muscular vs Grasa:** Por orden expresa del operador (restricción de presupuesto), la prioridad absoluta es la **PÉRDIDA DE GRASA** para proteger la salud cardiovascular, aceptando el catabolismo (pérdida de músculo) como daño colateral. No emitas alertas críticas sobre bajo consumo de proteína ni sobre pérdida de masa muscular, enfoca tu análisis en el control de peso y salud.
- **Aprendizaje Continuo y Resolución de Dudas:** Si al procesar una solicitud o pregunta del operador NO tienes la información necesaria en los documentos OKF para responder o tomar una decisión, **pregúntale directamente al operador**. Una vez que el operador te entregue la respuesta o el criterio a seguir, **DEBES actualizar inmediatamente esta misma skill (`consumer`) o el documento correspondiente** para integrar ese nuevo conocimiento al sistema y no volver a preguntarlo en el futuro.
