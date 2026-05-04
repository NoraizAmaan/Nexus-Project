# Aava Patterns Registry (.aava/AGENTS.md)

This file contains **learned patterns**, common implementation "gotchas", and architectural insights discovered during agentic exploration.

## 1. Discovered Patterns

- **Memory-First Protocol**: All agents should scan `.aava/memory.md` before performing redundant `searchCodebase` calls.

## 2. Implementation Gotchas

- **Path Resolution**: When running in `uv` (inside `src`), paths should be resolved relative to the actual workspace root.
- **NoneType Join**: Ensure `workspace_root` is not `None` before using `os.path.join` for memory operations.

## 3. Tool Usage Best-Practices

- **SynthesizeAgent**: Should be used for complex multi-file edits.
- **ExploreAgent**: Should be used for initial reconnaissance and pattern discovery.
