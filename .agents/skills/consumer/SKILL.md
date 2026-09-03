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
- **Consultas sobre TRT / Sustanon:** Cuando el operador pregunte cuándo fue su última inyección o cuándo le toca la próxima, DEBES leer obligatoriamente `protocols/trt.md`, buscar la última fecha en "Historial de Inyecciones Recientes" y calcular la próxima según la frecuencia indicada. Antes de autorizar/recomendar inyectar, verifica SIEMPRE que las métricas del día actual cumplan con el **"Gate de Validación para Inyección"** completo:
  1. **Gate Cardiovascular (seguridad):** PAS < 135 mmHg, PAD < 90 mmHg, SpO2 mínimo nocturno > 88%.
  2. **Gate de Recuperación SNS (necesidad real):** HRV ≥ 25 ms (o dentro del baseline), Body Battery despertar ≥ 40, sueño ≥ 6h en las últimas 2 noches. Si el HRV está bajo baseline por 2+ días consecutivos, aunque la PA esté bien, RECOMIENDA ESPERAR. El Propionato estimula el SNS y puede profundizar un déficit de recuperación existente, generando fatiga prolongada, sofocos exacerbados y sueño de baja calidad.
- **Health Status Inquiries y Perfil de Atleta Híbrido**: Cuando el operador consulte su estado de salud, información de entrenamiento o pregunte "¿cómo estoy?":
  1. **Análisis de Tendencias (Semanal y Mensual):** Procesa obligatoriamente el último resumen semanal (`week-XX.md`) y el último resumen mensual (`summary.md`). Esto es fundamental para determinar si las métricas alteradas del día representan un problema aislado o responden a una tendencia mayor (ej. enfermedades en curso, fatiga crónica, protocolos de medicamentos). Nunca evalúes el estado basándote exclusivamente en el log del día actual.
  2. **Perfil Híbrido (Recomposición):** El operador entrena recomposición estilizada (altas repeticiones, circuitos HIIT y cardio base aeróbico). Esto genera un alto grado de gasto calórico y estrés cardiovascular. Evalúa el progreso en función del volumen aeróbico y la oxidación de grasa, y no del tonelaje o fuerza máxima.
  3. **Matriz de Salud vs Volumen:** Utiliza la **Presión Arterial (PA)** y el **HRV** como semáforos absolutos. Si la PA está elevada o el HRV suprimido sistemáticamente, la recomendación debe ser *descarga (deload)* o *descanso absoluto*, incluso si las métricas de rendimiento/fuerza parecen ir bien. Prioriza siempre la salud cardiovascular y la recuperación por sobre el volumen. **EXCEPCIÓN (Paradoja de Reposo Prolongado):** Si el operador lleva más de 10-14 días de reposo continuo, el cuadro agudo de enfermedad ya pasó, y el HRV sigue suprimido, es altamente probable que el estrés psicológico por inactividad o la pérdida de rutina esté afectando el sistema nervioso. En estos casos, se autoriza retomar el entrenamiento (test de estrés físico) para evaluar si el estímulo reactiva y normaliza el HRV.

     **ADVERTENCIA CRÍTICA — Ejercicio como Regulador del SNS:** El operador _se estresa sin ejercicio_. Para él, omitir el entrenamiento por HRV bajo o PA elevada NO siempre es la mejor decisión — el estrés mental de no entrenar puede elevar su SNS tanto o más que el propio entrenamiento. **Regla práctica:**
     - Si el operador dice "me estreso sin ejercicio" o expresa ansiedad por no entrenar, el entrenamiento es **terapéutico**, no opcional.
     - En estos casos, permite el entrenamiento pero recomienda **intensidad moderada** (RPE 7-8, evitar fallo muscular, evitar HIIT extremo). El estímulo suave + el beneficio psicológico es mejor que el descanso absoluto.
     - Monitorea PA post-entreno: si PAD se mantiene < 90, la respuesta es aceptable aunque la PAS esté elevada transitoriamente.
  4. **Recomendaciones Proactivas:** Finaliza siempre **generando recomendaciones** de entrenamiento, descanso o ajustes de estilo de vida basados en tu análisis de tendencias y la matriz de salud, **incluso si el operador no solicitó recomendaciones explícitamente**.
  5. **Interpretación de Body Battery:** Al leer el reporte diario, debes ser extremadamente preciso con la sección "Body battery":
     - `Actual/Último`: Es la energía que tiene el operador **en este preciso momento**. Úsalo para evaluar su estado actual o de tarde.
     - `Mín`: Representa el nivel más bajo al que llegó la batería el **día anterior** (generalmente antes de ir a dormir). NO asumas que este es un mínimo alcanzado durante el día actual, y NO lo confundas con el valor actual.
     - `Máx`: Corresponde a la batería con la que el operador **despertó** o empezó el día. Usar siempre este valor para evaluar la recuperación nocturna.
  6. **Masa Muscular vs Grasa:** Por orden expresa del operador (restricción de presupuesto), la prioridad absoluta es la **PÉRDIDA DE GRASA** para proteger la salud cardiovascular, aceptando el catabolismo (pérdida de músculo) como daño colateral. No emitas alertas críticas sobre bajo consumo de proteína ni sobre pérdida de masa muscular, enfoca tu análisis en el control de peso y salud.
- **Señales Temporales y Eventos Activos:** DEBES leer SIEMPRE la sección "Señales Temporales y Eventos Activos" al final de `index.md` antes de emitir cualquier recomendación. 
  1. Si hay una señal o evento activo (fisiológico, estrés, medicación), ajusta tu análisis y recomendación contextualizando las métricas (ej. ignorar temporalmente un HRV bajo si hay un evento de estrés activo o una excepción clínica).
  2. Evalúa los datos del día contra la "Métrica de Eliminación (Clearance)" o la fecha de expiración del evento. Si la condición se cumple, notifícale al operador que la señal puede darse de baja de `index.md`.
- **Aprendizaje Continuo y Resolución de Dudas:** Si al procesar una solicitud o pregunta del operador NO tienes la información necesaria en los documentos OKF para responder o tomar una decisión, **pregúntale directamente al operador**. Una vez que el operador te entregue la respuesta o el criterio a seguir, **DEBES actualizar inmediatamente esta misma skill (`consumer`) o el documento correspondiente** para integrar ese nuevo conocimiento al sistema y no volver a preguntarlo en el futuro.
- **Consultas sobre Entrenamiento:** Cuando el operador pregunte por entrenamientos programados o qué entrenamiento le toca, DEBES utilizar SIEMPRE la información de `protocols/training.md`, que es el archivo de la verdad respecto al entrenamiento (rutinas diarias, días de descanso, tipo de entrenamiento).
- **PROTOCOLO DE RESCATE CLONAZEPAM ACTIVO (01/09/2026 - 11/09/2026):** El operador inició **RESCATE FARMACOLÓGICO CONTROLADO** el 01/09/2026 debido a colapso del sistema nervioso incompatible con necesidades laborales críticas (2 meses de dinero, examen CKA, búsqueda de trabajo). **ESTE NO ES UN FALLO DEL DESMONTE** - es gestión inteligente de riesgos. Protocolo específico:
  1. **Seguimiento Automático Obligatorio:** En TODA interacción con el operador, DEBES preguntar y registrar:
     - ¿Tomaste tu dosis de **Clonazepam** hoy según el protocolo? (11:00am)
     - ¿Tomaste tu **Zolpidem** anoche según el protocolo? (22:00)
     - Si hay TRT programada: ¿Cumples los gates y tomaste la dosis?
     - Actualizar automáticamente el log diario correspondiente con estas confirmaciones.
  2. **Protocolo de Desmonte Ultra-Controlado (PLAN FINAL CONFIRMADO):**
     - **01/09 (Mar):** Clonazepam 0.25mg (11:00am) + Zolpidem Sommit CR 12.5mg (22:00) — PRIMERA DOSIS (ajustada de 0.5mg por tolerancia reducida)
     - **02/09 (Mié):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + 🏋️ PULL UPPER (RPE 7-8)
     - **03/09 (Jue):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + 🏃 TROTE Z2 40-50min
     - **04/09 (Vie):** SKIP clonazepam + TRT 0.25ml (08:30) + TROTE 05:30am 🏃 + **Sommit CR 12.5mg (13:00 SIESTA ESTRATÉGICA)** 💤 + Modafinilo 25mg (18:00) + MANEJO 22:00-08:00 🚗
     - **05/09 (Sáb):** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) — post-manejo
     - **06-07/09 (Dom-Lun):** Clonazepam 0.125mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) + Full Body A
     - **08-10/09 (Mar-Jue):** Solo Zolpidem Sommit CR 12.5mg (22:00) — entreno completo
     - **11/09+ (Vie+):** Evaluar necesidad de mantener Zolpidem
     
     **NOTA IMPORTANTE:** Zolpidem del operador es **Sommit CR (liberación controlada)** 12.5mg. No es Zolpidem común. El CR tiene liberación bifásica (60% inmediata + 40% retardada). En el viernes, tomado a las 13:00 permite siesta profunda y está eliminado a las 22:00. El Modafinilo a las 18:00 contrarresta cualquier sedación residual.
  3. **Validación de Cumplimiento:** Si el operador reporta NO haber tomado alguna dosis según protocolo, indagar motivos y ajustar recomendación. Si reporta efectos adversos, evaluar modificación del protocolo.
  4. **Objetivo:** Recuperar funcionalidad cognitiva para éxito laboral, luego desmonte gradual sin shock al sistema nervioso.
  5. **Consideraciones Especiales:**
     - **Viernes 04/09:** Día COMPLEJO (confirmado): TROTE 05:30 🏃 + TRT 0.25ml (08:30) 💉 + **Sommit CR 12.5mg (13:00 SIESTA ESTRATÉGICA)** 💤 + Modafinilo 25mg (18:00) + MANEJO 22:00-08:00 🚗
     - **NO hay skip de Zolpidem el viernes** — se usa como siesta estratégica (no nocturna)
     - **Triple estimulación simpática:** Propionato (pico 14:30-20:30) + Modafinilo (18:00-08:00+) + estrés por falta de clonazepam
     - **Monitoreo PA crítico:** 08:00 (pre-TRT), 12:00, 16:00 (pre-manejo) - red flags >150/95 mmHg
     - **Gates TRT:** Solo inyectar si PAS <135 y PAD <90 en la mañana (08:00)
     - **Rescate emergencia:** 0.125mg clonazepam si red flags antes del manejo
     - **Sábado 05/09:** Clonazepam 0.25mg (22:00) + Zolpidem Sommit CR 12.5mg (22:00) para amortiguar crash post-modafinilo
- **CONTEXTO HISTÓRICO DEL DESMONTE ORIGINAL:** El operador había logrado **27 días limpio** tras >10 años de uso diario (05/08-01/09/2026). Recuperación exitosa confirmada en semana 20-23/08 (HRV 30-38ms, BB 66-90). El colapso del 01/09 fue precipitado por armodafinilo + TRT aumentada, NO por fallo del desmonte. Mantener tono positivo - este rescate es estratégico, no fracaso.
