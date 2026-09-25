# `@codexporer.io/expo-message-dialog`

An imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` for smooth, non-blocking modal dialogs with customizable types, icons, and action buttons.

## Features

- **Imperative Actions API**: Trigger, update, or dismiss message dialogs programmatically via `useMessageDialogActions()`.
- **Theme-Integrated**: Leverages `@codexporer.io/expo-app-theme` (`useAppTheme()`) for dynamic status and surface colors.
- **Type Variant System**: Supports `MessageDialogType` enum (`None`, `Info`, `Warning`, `Error`) with automated icons and theme accents.
- **Standardized Buttons**: Integrates `@codexporer.io/expo-button` for action items.
- **Custom Content**: Supports rendering custom React components via `renderContent`.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-message-dialog
```

Ensure peer dependencies are installed:
```bash
yarn add react-sweet-state lodash @expo/vector-icons @codexporer.io/expo-dialog @codexporer.io/expo-link-stores @codexporer.io/expo-app-theme @codexporer.io/expo-button
```

## Quick Start

### 1. Place `<MessageDialog />` in App Tree

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { MessageDialog } from '@codexporer.io/expo-message-dialog';

export function RootLayout({ children }) {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {children}
      <MessageDialog />
    </ThemeProvider>
  );
}
```

### 2. Trigger Dialogs Imperatively

```tsx
import React from 'react';
import { Button, View } from 'react-native';
import {
  useMessageDialogActions,
  MessageDialogType
} from '@codexporer.io/expo-message-dialog';
import { ButtonVariant } from '@codexporer.io/expo-button';

export function DemoScreen() {
  const [, { open, close }] = useMessageDialogActions();

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
          handler: close
        },
        {
          id: 'delete',
          text: 'Delete',
          variant: ButtonVariant.Primary,
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

## API Reference

### `MessageDialogType` (Enum)
- `MessageDialogType.None = 'none'`
- `MessageDialogType.Info = 'info'`
- `MessageDialogType.Warning = 'warning'`
- `MessageDialogType.Error = 'error'`

### `open(options: OpenMessageDialogOptions)`
| Option | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Dialog title text |
| `message` | `string` | Description or body message |
| `type` | `MessageDialogType` | Dialog category (determines icon and header color) |
| `actions` | `MessageDialogActionOption[]` | Action buttons rendered at the bottom |
| `renderContent` | `() => ReactNode` | Custom render function replacing `message` |
| `onOpen` | `() => void` | Callback fired when dialog opens |
| `onClose` | `() => void` | Callback fired when dialog closes |
| `customConfig` | `Record<string, unknown>` | Custom payload stored in dialog state |

### `MessageDialogActionOption`
| Property | Type | Description |
| :--- | :--- | :--- |
| `text` | `string` | Button title |
| `handler` | `() => void` | On press callback |
| `variant` | `ButtonVariant` | Button styling variant (`Primary`, `Secondary`, `Outline`, `Ghost`) |
| `size` | `ButtonSize` | Button size preset (`Small`, `Medium`, `Large`) |
| `isDisabled` | `boolean` | Whether action button is disabled |

## License

MIT
