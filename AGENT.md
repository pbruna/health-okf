# Agent Information for health-okf

Welcome to the `health-okf` repository. This repository is structured following the [Open Knowledge Format (OKF) v0.1](https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/refs/heads/main/okf/SPEC.md). 

> [!IMPORTANT]
> **Revisión del Estándar OKF:** Cada lunes debes revisar la URL del `SPEC.md` (indicada arriba) para verificar si existen actualizaciones al estándar y adaptar el repositorio si es necesario.

As an AI agent, you can consume and produce knowledge within this directory without requiring external APIs or complex configurations.

## Repository Structure

- `index.md`: The base clinical profile of the operator. Always start here to get the full clinical context.
- `protocols/`: Contains medical protocols, routines, and active medications. Links to these are typically found in `index.md`.
- `metrics/`: Historical records of clinical metrics (e.g., blood pressure, weight).
- `logs/`: Daily logs formatted as `YYYY-MM-DD.md`. This is your primary context for understanding the operator's current day.

## How to Interact

1. **Context Building**: Before answering questions or taking actions, build your context by reading `index.md`, following relevant links in `protocols/`, and checking the most recent `logs/YYYY-MM-DD.md`.
2. **One Concept per File**: Keep information modular. Do not merge separate concepts into a single file.
3. **YAML Frontmatter**: All files must contain YAML frontmatter with `type`, `title`, `tags`, and `timestamp`.
4. **Relative Links**: Use relative Markdown links to connect concepts.

## Available Skills

- **Consumer Skill**: Guides agents on how to navigate and consume the OKF knowledge graph effectively.
- **Producer Skill**: Provides instructions for generating new daily logs automatically, specifically integrating with Garmin data.
