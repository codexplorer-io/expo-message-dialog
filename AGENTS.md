# AGENTS.md - `@codexporer.io/expo-message-dialog` Instructions

## Package Overview
Imperative and hook-driven message dialog overlay powered by `react-sweet-state` and `@codexporer.io/expo-app-theme`.

## Core Exports
- `<MessageDialog />`: Main dialog overlay component. Render once in app root.
- `useMessageDialogActions()`: Returns `[null, { open, updateState, close }]`.
- `useMessageDialogCustomConfig()`: Returns `[customConfig, actions]`.
- `MessageDialogType`: Enum (`None`, `Info`, `Warning`, `Error`).

## Critical Guidelines for AI Agents
- Destructure actions: `const [, { open: openMessageDialog, close: closeMessageDialog }] = useMessageDialogActions();`
- Do NOT use optional chaining (`?.`) on `openMessageDialog` or `closeMessageDialog`.
- In `useEffect` hooks, always supply clean-up: `return () => closeMessageDialog();`.
- Use `MessageDialogType` enum (e.g. `MessageDialogType.Warning`, `MessageDialogType.Error`) when opening dialogs.
- Action items in `actions` accept `variant?: ButtonVariant` and `size?: ButtonSize` from `@codexporer.io/expo-button`.
