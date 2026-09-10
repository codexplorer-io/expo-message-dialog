import * as React from 'react';

export declare const MESSAGE_DIALOG_TYPE: {
    readonly none: 'none';
    readonly info: 'info';
    readonly warning: 'warning';
    readonly error: 'error';
};

export type MessageDialogType = typeof MESSAGE_DIALOG_TYPE[keyof typeof MESSAGE_DIALOG_TYPE];

export interface MessageDialogThemeColors {
    dialogBackground: string;
    titleText?: string;
    messageText: string;
    overlayBackground: string;
    info: string;
    warning: string;
    error: string;
    buttonText: string;
    buttonBackground: string;
    buttonBorder?: string;
    shadowColor?: string;
}

export interface MessageDialogTheme {
    colors: MessageDialogThemeColors;
}

export interface MessageDialogProviderProps {
    children: React.ReactNode;
    theme: MessageDialogTheme;
}

export declare const MessageDialogProvider: React.FC<MessageDialogProviderProps>;

export interface MessageDialogActionOption {
    id: string | number;
    text: string;
    handler?: () => void;
    color?: string;
    mode?: string;
    isDisabled?: boolean;
}

export interface OpenMessageDialogOptions {
    title?: string;
    message?: string;
    renderContent?: (() => React.ReactNode) | null;
    type?: MessageDialogType;
    actions?: MessageDialogActionOption[];
    onOpen?: (() => void) | null;
    onClose?: (() => void) | null;
    customConfig?: Record<string, unknown> | null;
}

export interface UpdateMessageDialogOptions {
    title?: string;
    message?: string;
    renderContent?: (() => React.ReactNode) | null;
    type?: MessageDialogType | null;
    actions?: MessageDialogActionOption[];
    customConfig?: Record<string, unknown> | null;
}

export interface MessageDialogActions {
    open: (options: OpenMessageDialogOptions) => void;
    updateState: (options: UpdateMessageDialogOptions) => void;
    close: () => void;
}

export declare function useMessageDialogActions(): [null, MessageDialogActions];
export declare function useMessageDialogCustomConfig(): [Record<string, unknown> | null, MessageDialogActions];
export declare const MessageDialog: React.FC;
