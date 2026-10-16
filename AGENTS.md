# AGENTS.md — `@codexporer.io/expo-message-dialog` Instructions

## Package Overview

Imperative and hook-driven message dialog overlay powered by `react-sweet-state`, `@codexporer.io/expo-dialog`, `@codexporer.io/expo-app-theme`, and `@codexporer.io/expo-button`.

---

## Peer Dependencies

All 8 peer dependencies must be installed in consuming projects (none are optional):
- `react`: `*`
- `react-native`: `*`
- `react-sweet-state`: `*`
- `lodash`: `*`
- `@expo/vector-icons`: `*`
- `@codexporer.io/expo-dialog`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-button`: `*`

---

## Theme Requirement

`<MessageDialog />` calls `useAppTheme()` to derive header icons and text accent colors (`theme.info || theme.primary`, `theme.warning`, `theme.error`, `theme.text`). Consuming applications **must** mount `<ThemeProvider>` from `@codexporer.io/expo-app-theme` above `<MessageDialog />`.

---

## Key Exports

- `<MessageDialog />` (named and default export): Modal component rendering the message dialog, icon, content, and action buttons.
- `useMessageDialogActions()`: Returns `{ open, updateState, close }`.
- `useMessageDialogState()`: Returns `MessageDialogState` object (`{ isOpen, title, message, renderContent, type, actions, onOpen, onClose, customConfig }`).
- `useMessageDialogCustomConfig()`: Selector hook returning `customConfig`.
- `MessageDialogType`: Enum (`None = 'none'`, `Info = 'info'`, `Warning = 'warning'`, `Error = 'error'`).
- Types: `OpenMessageDialogOptions`, `UpdateMessageDialogOptions`, `MessageDialogActionOption`, `MessageDialogState`.

---

## Critical Guidelines for AI Agents

- **Destructure Actions Directly**:
  ```tsx
  const { open: openMessageDialog, updateState: updateMessageDialog, close: closeMessageDialog } = useMessageDialogActions();
  ```
  Do NOT use optional chaining (`?.`) on `openMessageDialog` or `closeMessageDialog`.
- **Component Mount**: Mount `<MessageDialog />` near the app root inside `<ThemeProvider>`. Do not look for or create a `MessageDialogProvider` (it does not exist).
- **Cleanup on Unmount**: In `useEffect` hooks controlling dialog display, always provide cleanup:
  ```tsx
  useEffect(() => {
    return () => closeMessageDialog();
  }, []);
  ```
- **Use `MessageDialogType` Enum**: Always pass `MessageDialogType.Info`, `MessageDialogType.Warning`, `MessageDialogType.Error`, or `MessageDialogType.None`. Do not pass arbitrary string literals.
- **Button Presets**: Action items in `actions` accept `variant?: ButtonVariant` and `size?: ButtonSize` from `@codexporer.io/expo-button`.
- **Modal Back Behavior**: Android hardware back button triggers `onDismiss={close}` (`dismissOnHardwareBackPress={true}`), while backdrop tap is disabled (`dismissOnBackdropPress={false}`).

