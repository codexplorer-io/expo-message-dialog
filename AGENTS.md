# AGENTS.md - `@codexporer.io/expo-message-dialog` Instructions

## Package Overview
Imperative and hook-driven message dialog overlay powered by `react-sweet-state`.

## Core Exports
- `MessageDialogProvider`: Application root provider rendering message dialog overlay.
- `useMessageDialogActions()`: Returns `[null, { open, updateState, close }]`.
- `useMessageDialogCustomConfig()`: Returns `[customConfig, actions]`.
- `MESSAGE_DIALOG_TYPE`: Enum-like object (`none`, `info`, `warning`, `error`).

## Critical Guidelines for AI Agents
- Destructure actions: `const [, { open: openMessageDialog, close: closeMessageDialog }] = useMessageDialogActions();`
- Do NOT use optional chaining (`?.`) on `openMessageDialog` or `closeMessageDialog`.
- In `useEffect` hooks, always supply clean-up: `return () => closeMessageDialog();`.
- **Memoize Theme Objects**: Wrap inline `theme` objects in `useMemo` when rendered inside React components (or define statically outside component body) to preserve reference stability.
