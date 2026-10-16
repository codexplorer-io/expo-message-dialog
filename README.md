# `@codexporer.io/expo-message-dialog`

An imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` for smooth, non-blocking modal dialogs with customizable types, icons, and action buttons.

---

## Peer Dependencies

All peer dependencies are required and must be installed in consuming projects (none are optional):
- `react`: `*`
- `react-native`: `*`
- `react-sweet-state`: `*`
- `lodash`: `*`
- `@expo/vector-icons`: `*`
- `@codexporer.io/expo-dialog`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-button`: `*`

---

## Installation

```bash
yarn add @codexporer.io/expo-message-dialog
```

---

## Theme Requirement

`<MessageDialog />` calls `useAppTheme()` from `@codexporer.io/expo-app-theme` to retrieve theme colors for title headers, body text, and type icons (AntDesign icons: `info-circle`, `warning`, `exclamation-circle`). Consuming applications **must** mount `<ThemeProvider>` above `<MessageDialog />` in the component tree.

---

## Quick Start

### 1. Place `<MessageDialog />` in App Tree

Mount `<MessageDialog />` near the top level of your component tree inside `<ThemeProvider>`:

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { MessageDialog } from '@codexporer.io/expo-message-dialog';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {children}
      <MessageDialog />
    </ThemeProvider>
  );
}
```

> **Note:** There is no `MessageDialogProvider`. The component connects directly to the singleton store.

### 2. Trigger Dialogs Imperatively

```tsx
import React from 'react';
import { Button, View } from 'react-native';
import {
  useMessageDialogActions,
  MessageDialogType
} from '@codexporer.io/expo-message-dialog';
import { ButtonVariant, ButtonSize } from '@codexporer.io/expo-button';

export function DemoScreen() {
  const { open, close } = useMessageDialogActions();

  const handleShowWarning = () => {
    open({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to permanently delete this preset?',
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
          id: 'delete',
          text: 'Delete',
          variant: ButtonVariant.Primary,
          size: ButtonSize.Small,
          handler: () => {
            performDelete();
            close();
          }
        }
      ]
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <Button title="Delete Preset" onPress={handleShowWarning} />
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
| `message` | `string` | `''` | Body message text |
| `type` | `MessageDialogType` | `MessageDialogType.None` | Category type (determines header icon and accent color) |
| `actions` | `MessageDialogActionOption[]` | `[]` | Action buttons rendered at the bottom |
| `renderContent` | `(() => React.ReactNode) \| null` | `null` | Optional custom render function replacing standard text `message` |
| `onOpen` | `(() => void) \| null` | `null` | Callback executed after the dialog opens |
| `onClose` | `(() => void) \| null` | `null` | Callback executed after the dialog closes |
| `customConfig` | `Record<string, unknown> \| null` | `null` | Optional custom metadata stored in dialog state |

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

Action buttons are rendered via `@codexporer.io/expo-button`:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `string` | *Required* | Button title label |
| `handler` | `() => void` | — | Callback invoked on button press |
| `variant` | `ButtonVariant` | `ButtonVariant.Secondary` | Button style preset (`Primary`, `Secondary`, `Outline`, `Ghost`, etc.) |
| `size` | `ButtonSize` | `ButtonSize.Small` | Button size preset (`Small`, `Medium`, `Large`) |
| `isDisabled` | `boolean` | `false` | Whether action button is disabled |
| `id` | `string \| number` | — | Optional unique identifier for key rendering |

### State Inspection Hooks

- **`useMessageDialogState()`**: Hook returning complete dialog state (`MessageDialogState`: `{ isOpen, title, message, renderContent, type, actions, onOpen, onClose, customConfig }`).
- **`useMessageDialogCustomConfig()`**: Hook selector returning only the `customConfig` payload.

---

## Modal Behavior

The underlying `<Dialog>` is configured with:
- `dismissOnBackdropPress={false}`: Tapping the backdrop will not dismiss the dialog.
- `dismissOnHardwareBackPress={true}`: Pressing the Android hardware back button triggers `onDismiss={close}`.

---

## License

MIT

