# health-okf

Bitácora de salud personal en formato [Open Knowledge Format (OKF) v0.1](https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/refs/heads/main/okf/SPEC.md).

> [!IMPORTANT]
> **Revisión del Estándar OKF:** Este repositorio sigue estrictamente el estándar OKF definido en el enlace superior. Cada lunes se debe revisar la URL del `SPEC.md` para verificar si existen actualizaciones al estándar y aplicar los cambios correspondientes.
## Estructura

```
health-okf/
├── index.md              # Perfil clínico base (contexto para agentes)
├── logs/
│   ├── index.md          # Índice de logs diarios
│   └── YYYY-MM-DD.md     # Log diario
├── metrics/
│   ├── index.md          # Índice de métricas
│   └── blood-pressure.md # Histórico de presión arterial
└── protocols/
    ├── index.md          # Índice de protocolos
    ├── trt.md            # Protocolo TRT Sustanon 250
    └── medications.md    # Medicamentos activos
```

## Uso con agentes IA

Este repo sigue el estándar OKF v0.1. Cualquier agente compatible puede
clonarlo y navegar el grafo de conocimiento sin SDK adicional.

Para contexto diario, apuntar al log del día:
`logs/YYYY-MM-DD.md`

Para contexto clínico completo, comenzar por:
`index.md` → `protocols/` → `logs/`

## Convenciones

- Un archivo por concepto
- YAML frontmatter con `type`, `title`, `tags`, `timestamp`
- Links relativos entre documentos
- Un log por día en `logs/`
- Métricas Garmin en unidades nativas (mmHg, bpm, ms)
