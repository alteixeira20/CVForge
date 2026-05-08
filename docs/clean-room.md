# Clean-Room Rebuild Strategy

This document outlines the strategy for the clean-room rebuild of CVForge.

## 1. Principles
- **No Direct Copy**: Avoid copying large blocks of code from the original `open-resume` or previous forks without audit.
- **Dependency Audit**: Only reuse components and utilities verified for low coupling.
- **Modern Foundation**: Use Next.js 15, React 19, and the latest Forge-family styling.
- **Traceable Authorship**: Maintain clear separation between inherited ideas and new implementations.

## 2. Extraction Phases
1. **Foundation**: Scaffold the repository structure and UI primitives (Current Phase).
2. **Schema**: Define the core `Resume` and `Settings` data models.
3. **Engines**: Reimplement or adapt the ATS scoring and Parser logic as standalone modules.
4. **Workbenches**: Build the `/builder` and `/parser` routes using the new foundation.
5. **Validation**: Comprehensive unit and integration testing of the new logic.
