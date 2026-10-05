---
name: expo-message-dialog
description: Instructions for state-guarded modal message dialog implementation using @codexporer.io/expo-message-dialog in React Native & Expo apps.
---

# `@codexporer.io/expo-message-dialog` Skill

## Overview
`@codexporer.io/expo-message-dialog` provides an imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` and integrated with `@codexporer.io/expo-button` and `@codexporer.io/expo-app-theme`.

---

## Required Setup

### 1. Mount `<MessageDialog />` in the Root Tree
Render `<MessageDialog />` near the top level of your component tree inside `ThemeProvider` (from `@codexporer.io/expo-app-theme` or the app's theme provider):

> **NOTE:** Do **not** use `MessageDialogProvider` (it does not exist). Simply mount `<MessageDialog />` as a component inside `ThemeProvider`.

```tsx
import React from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageDialog } from '@codexporer.io/expo-message-dialog';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* App Navigators and Screens */}
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

### `MessageDialogType` (Enum)
Always use the `MessageDialogType` enum for the dialog `type` option:
- `MessageDialogType.None = 'none'`
- `MessageDialogType.Info = 'info'`
- `MessageDialogType.Warning = 'warning'`
- `MessageDialogType.Error = 'error'`

### `open(options: OpenMessageDialogOptions)`
| Option | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Dialog title text |
| `message` | `string` | Description or body message |
| `type` | `MessageDialogType` | Dialog category (determines icon and header color accent) |
| `actions` | `MessageDialogActionOption[]` | Action buttons rendered at the bottom |
| `renderContent` | `() => ReactNode` | Optional custom render function replacing standard text `message` |
| `onOpen` | `() => void` | Optional callback fired when dialog opens |
| `onClose` | `() => void` | Optional callback fired when dialog closes |
| `customConfig` | `Record<string, unknown>` | Optional custom payload stored in dialog state |

### `MessageDialogActionOption`
Buttons are powered by `@codexporer.io/expo-button`:
| Property | Type | Description |
| :--- | :--- | :--- |
| `text` | `string` | Button title label |
| `handler` | `() => void` | Callback invoked on button press |
| `variant` | `ButtonVariant` | Button styling variant (`Primary`, `Secondary`, `Outline`, `Ghost`, etc.) |
| `size` | `ButtonSize` | Button size preset (`Small`, `Medium`, `Large`) |
| `isDisabled` | `boolean` | Whether action button is disabled |
| `id` | `string \| number` | Optional unique identifier |

---

## Mandatory Rules & Guidelines

1. **Mounting**: Always mount `<MessageDialog />` inside `ThemeProvider`. Never look for or create a `MessageDialogProvider`.
2. **Destructured Actions Pattern**: ALWAYS destructure:
   ```tsx
   const { open, close } = useMessageDialogActions();
   ```
3. **Use `MessageDialogType` Enum**: Never pass raw strings like `'info'` or `'error'` for dialog type; always use `MessageDialogType.Info`, `MessageDialogType.Warning`, `MessageDialogType.Error`, or `MessageDialogType.None`.
4. **Use `ButtonVariant` & `ButtonSize`**: When specifying button variants and sizes in dialog `actions`, import and use `ButtonVariant` and `ButtonSize` from `@codexporer.io/expo-button`.
5. **Dismissal**: Handlers that perform an action should explicitly call `close()` when finished unless intentional persistence is required.
