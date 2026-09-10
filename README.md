# `@codexporer.io/expo-message-dialog`

An imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications.

## Features

- **Imperative Actions API**: Trigger, update, or dismiss message dialogs programmatically via `useMessageDialogActions()`.
- **Themed UI**: Context provider (`MessageDialogProvider`) for theme configuration.
- **Type Variant System**: Supports `none`, `info`, `warning`, and `error` types with icons.
- **Zero Heavy UI Dependencies**: Built with native React Native components (`Modal`, `View`, `Text`, `TouchableOpacity`).

## Installation

```bash
yarn add @codexporer.io/expo-message-dialog
```

Ensure peer dependencies are installed:
```json
{
  "peerDependencies": {
    "react": "*",
    "react-sweet-state": "*",
    "lodash": "*",
    "@expo/vector-icons": "*"
  }
}
```

## Quick Start

### 1. Wrap Root with `MessageDialogProvider`

```tsx
import React, { useMemo } from 'react';
import { MessageDialogProvider, MessageDialogTheme } from '@codexporer.io/expo-message-dialog';

export function RootLayout({ children }) {
  const theme = useMemo<MessageDialogTheme>(() => ({
    colors: {
      dialogBackground: '#ffffff',
      titleText: '#18181b',
      messageText: '#71717a',
      overlayBackground: 'rgba(0, 0, 0, 0.5)',
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      buttonText: '#6366f1',
      buttonBackground: '#f4f4f5',
      buttonBorder: '#e4e4e7'
    }
  }), []);

  return (
    <MessageDialogProvider theme={theme}>
      {children}
    </MessageDialogProvider>
  );
}
```

### 2. Trigger Dialogs Imperatively

```tsx
import React from 'react';
import { Button } from 'react-native';
import { useMessageDialogActions, MESSAGE_DIALOG_TYPE } from '@codexporer.io/expo-message-dialog';

export function DemoScreen() {
  const [, { open, close }] = useMessageDialogActions();

  const handleShowAlert = () => {
    open({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this record?',
      type: MESSAGE_DIALOG_TYPE.warning,
      actions: [
        { id: 'cancel', text: 'Cancel', handler: close },
        { id: 'delete', text: 'Delete', handler: () => { performDelete(); close(); } }
      ]
    });
  };

  return <Button title="Show Alert" onPress={handleShowAlert} />;
}
```

## License

MIT
