---
name: expo-message-dialog
description: Instructions for state-guarded modal message dialog implementation using @codexporer.io/expo-message-dialog in React Native & Expo apps.
---

# `@codexporer.io/expo-message-dialog` Skill

## Overview
`@codexporer.io/expo-message-dialog` provides an imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` and integrated with `@codexporer.io/expo-button` and `@codexporer.io/expo-app-theme`.

---

## Peer Dependencies

All 8 peer dependencies are required and must be installed in consuming projects (none are optional):
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

`<MessageDialog />` calls `useAppTheme()` from `@codexporer.io/expo-app-theme` to retrieve theme colors for title headers, body text, and type icons (AntDesign icons: `info-circle`, `warning`, `exclamation-circle`). Consuming applications **must** mount `<ThemeProvider>` above `<MessageDialog />`.

---

## When to Use
- Displaying modal confirmation prompts (e.g., delete confirmation, discard changes, exit without saving).
- Presenting user feedback alerts (info, warning, or error messages) with custom button actions.
- Showing imperative dialogs with custom render content without declaring inline modal state on every screen.

---

## Required Setup

### 1. Mount `<MessageDialog />` in the Root Tree

Render `<MessageDialog />` near the top level of your component tree inside `<ThemeProvider>` from `@codexporer.io/expo-app-theme`:

> **NOTE:** Do **not** use `MessageDialogProvider` (it does not exist). Simply mount `<MessageDialog />` as a component inside `<ThemeProvider>`.

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { MessageDialog } from '@codexporer.io/expo-message-dialog';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {children}
      <MessageDialog />
    </ThemeProvider>
  );
}
```

---

## Hook Usage Pattern

Always destructure `{ open, updateState, close }` directly from `useMessageDialogActions()`:

```tsx
import React from 'react';
import { View } from 'react-native';
import {
  useMessageDialogActions,
  MessageDialogType
} from '@codexporer.io/expo-message-dialog';
import { Button, ButtonVariant, ButtonSize } from '@codexporer.io/expo-button';

export function DemoScreen() {
  const { open, close } = useMessageDialogActions();

  const handleShowAlert = () => {
    open({
      title: 'Attention',
      message: 'This is an important message.',
      type: MessageDialogType.Warning,
      actions: [
        {
          id: 'cancel',
          text: 'Cancel',
          variant: ButtonVariant.Secondary,
          size: ButtonSize.Small,
          handler: close
        },
        {
          id: 'confirm',
          text: 'Confirm',
          variant: ButtonVariant.Primary,
          size: ButtonSize.Small,
          handler: () => {
            handleConfirm();
            close();
          }
        }
      ]
    });
  };

  return (
    <View>
      <Button title="Show Alert" onPress={handleShowAlert} />
    </View>
  );
}
```

---

## API Reference

### `useMessageDialogActions()`

Returns action methods:
- `open(options: OpenMessageDialogOptions)`: Displays the dialog. State-guarded: ignores the call if a dialog is already open. Invokes `onOpen?.()`.
- `updateState(options: UpdateMessageDialogOptions)`: Updates dialog `title`, `message`, `renderContent`, `type`, `actions`, and merges `customConfig`. State-guarded: ignores the call if the dialog is closed.
- `close()`: Closes the dialog, transforms active action handlers to `lodash/noop`, clears open/close callbacks, and invokes `onClose?.()`. State-guarded: ignores the call if already closed.

### `MessageDialogType` (Enum)
- `MessageDialogType.None = 'none'` (renders default text color, no icon)
- `MessageDialogType.Info = 'info'` (renders AntDesign `info-circle` with `theme.info || theme.primary`)
- `MessageDialogType.Warning = 'warning'` (renders AntDesign `warning` with `theme.warning`)
- `MessageDialogType.Error = 'error'` (renders AntDesign `exclamation-circle` with `theme.error`)

### `OpenMessageDialogOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `''` | Dialog header title |
| `message` | `string` | `''` | Description or body message |
| `type` | `MessageDialogType` | `MessageDialogType.None` | Category type (determines icon and header color accent) |
| `actions` | `MessageDialogActionOption[]` | `[]` | Action buttons rendered at the bottom |
| `renderContent` | `(() => React.ReactNode) \| null` | `null` | Optional custom render function replacing standard text `message` |
| `onOpen` | `(() => void) \| null` | `null` | Optional callback fired when dialog opens |
| `onClose` | `(() => void) \| null` | `null` | Optional callback fired when dialog closes |
| `customConfig` | `Record<string, unknown> \| null` | `null` | Optional custom payload stored in dialog state |

### `UpdateMessageDialogOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `''` | Updated dialog header title |
| `message` | `string` | `''` | Updated body message text |
| `type` | `MessageDialogType \| null` | `null` | Updated category type (retains previous if null/omitted) |
| `actions` | `MessageDialogActionOption[]` | `[]` | Updated action buttons array |
| `renderContent` | `(() => React.ReactNode) \| null` | `null` | Updated custom render function |
| `customConfig` | `Record<string, unknown> \| null` | `null` | Merged metadata payload |

### `MessageDialogActionOption`

Buttons are powered by `@codexporer.io/expo-button`:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `string` | *Required* | Button title label |
| `handler` | `() => void` | — | Callback invoked on button press |
| `variant` | `ButtonVariant` | `ButtonVariant.Secondary` | Button styling variant (`Primary`, `Secondary`, `Outline`, `Ghost`, etc.) |
| `size` | `ButtonSize` | `ButtonSize.Small` | Button size preset (`Small`, `Medium`, `Large`) |
| `isDisabled` | `boolean` | `false` | Whether action button is disabled |
| `id` | `string \| number` | — | Optional unique identifier |

### State Inspection Hooks
- `useMessageDialogState()`: Subscribes to the complete dialog state (`MessageDialogState`: `{ isOpen, title, message, renderContent, type, actions, onOpen, onClose, customConfig }`).
- `useMessageDialogCustomConfig()`: Selector hook returning only the `customConfig` payload object.

---

## Critical Rules & Guidelines

1. **Mounting**: Always mount `<MessageDialog />` inside `ThemeProvider`. Never look for or create a `MessageDialogProvider`.
2. **Destructured Actions Pattern**: ALWAYS destructure:
   ```tsx
   const { open, updateState, close } = useMessageDialogActions();
   ```
   Do NOT use optional chaining (`?.`) on `open` or `close`.
3. **Use `MessageDialogType` Enum**: Never pass raw strings like `'info'` or `'error'` for dialog type; always use `MessageDialogType.Info`, `MessageDialogType.Warning`, `MessageDialogType.Error`, or `MessageDialogType.None`.
4. **Use `ButtonVariant` & `ButtonSize`**: When specifying button variants and sizes in dialog `actions`, import and use `ButtonVariant` and `ButtonSize` from `@codexporer.io/expo-button`.
5. **Dismissal**: Handlers that perform an action should explicitly call `close()` when finished unless intentional persistence is required.
6. **Modal Back Behavior**: Android hardware back button triggers `onDismiss={close}` (`dismissOnHardwareBackPress={true}`), while backdrop tap is disabled (`dismissOnBackdropPress={false}`).
7. **All 8 Peer Dependencies Required**: Consuming applications must install all 8 peer dependencies without marking any as optional.

