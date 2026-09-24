# `@codexporer.io/expo-message-dialog`

An imperative, state-guarded message dialog overlay component and `react-sweet-state` hook for Expo and React Native applications.

## Features

- **Imperative Actions API**: Trigger, update, or dismiss message dialogs programmatically via `useMessageDialogActions()`.
- **Theme-Integrated**: Leverages `@codexporer.io/expo-app-theme` (`useAppTheme()`) for dynamic status and surface colors.
- **Type Variant System**: Supports `MessageDialogType` enum (`None`, `Info`, `Warning`, `Error`) with icons.
- **Standardized Buttons**: Integrates `@codexporer.io/expo-button` for action items.

## Installation

```bash
yarn add @codexporer.io/expo-message-dialog
```

Ensure peer dependencies are installed:
```json
{
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "react-sweet-state": "*",
    "lodash": "*",
    "@expo/vector-icons": "*",
    "@codexporer.io/expo-app-theme": "*",
    "@codexporer.io/expo-button": "*"
  }
}
```

## Quick Start

### 1. Place `<MessageDialog />` in App Tree

```tsx
import React from 'react';
import { MessageDialog } from '@codexporer.io/expo-message-dialog';

export function RootLayout({ children }) {
  return (
    <>
      {children}
      <MessageDialog />
    </>
  );
}
```

### 2. Trigger Dialogs Imperatively

```tsx
import React from 'react';
import { Button } from 'react-native';
import { useMessageDialogActions, MessageDialogType } from '@codexporer.io/expo-message-dialog';

export function DemoScreen() {
  const [, { open, close }] = useMessageDialogActions();

  const handleShowAlert = () => {
    open({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this record?',
      type: MessageDialogType.Warning,
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
