import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    BackHandler
} from 'react-native';
import { createStore, createHook } from 'react-sweet-state';
import { AntDesign } from '@expo/vector-icons';
import map from 'lodash/map';
import noop from 'lodash/noop';
import {
    initialState as linkInitialState,
    actions as linkActions,
    selector as linkSelector
} from '@codexporer.io/expo-link-stores';
import { useAppTheme, AppThemeColors } from '@codexporer.io/expo-app-theme';
import { Button, ButtonVariant, ButtonSize } from '@codexporer.io/expo-button';

export enum MessageDialogType {
    None = 'none',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export interface MessageDialogActionOption {
    id?: string | number;
    text: string;
    handler?: () => void;
    color?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
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

export interface MessageDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    renderContent: (() => React.ReactNode) | null;
    type: MessageDialogType;
    actions: MessageDialogActionOption[];
    onOpen: (() => void) | null;
    onClose: (() => void) | null;
    customConfig: Record<string, unknown> | null;
    [key: string]: unknown;
}

const initialState: MessageDialogState = {
    ...linkInitialState,
    isOpen: false,
    title: '',
    message: '',
    renderContent: null,
    type: MessageDialogType.None,
    actions: [],
    onOpen: null,
    onClose: null,
    customConfig: null
};

export const Store = createStore({
    initialState,
    actions: {
        ...linkActions,
        open: ({
            title = '',
            message = '',
            renderContent = null,
            type = MessageDialogType.None,
            actions = [],
            onOpen = null,
            onClose = null,
            customConfig = null
        }: OpenMessageDialogOptions = {}) => ({ getState, setState }: { getState: () => MessageDialogState; setState: (state: Partial<MessageDialogState>) => void }) => {
            const { isOpen } = getState();
            if (isOpen) {
                return;
            }

            setState({
                isOpen: true,
                title,
                message,
                renderContent,
                type,
                actions,
                onOpen,
                onClose,
                customConfig
            });
            onOpen?.();
        },
        updateState: ({
            title = '',
            message = '',
            renderContent = null,
            type = null,
            actions = [],
            customConfig = null
        }: UpdateMessageDialogOptions = {}) => ({ getState, setState }: { getState: () => MessageDialogState; setState: (state: Partial<MessageDialogState>) => void }) => {
            const {
                isOpen,
                type: previousType,
                customConfig: previousCustomConfig
            } = getState();
            if (!isOpen) {
                return;
            }

            setState({
                title,
                message,
                renderContent,
                type: type ?? previousType,
                actions,
                customConfig: (previousCustomConfig || customConfig) ? {
                    ...(previousCustomConfig ?? {}),
                    ...(customConfig ?? {})
                } : null
            });
        },
        close: () => ({ getState, setState }: { getState: () => MessageDialogState; setState: (state: Partial<MessageDialogState>) => void }) => {
            const { isOpen, onClose, actions: oldActions } = getState();
            if (!isOpen) {
                return;
            }

            const actions = map(oldActions, (action: MessageDialogActionOption) => ({
                ...action,
                handler: noop
            }));
            setState({
                isOpen: false,
                actions,
                onOpen: null,
                onClose: null
            });
            onClose?.();
        }
    },
    name: 'MessageDialogActions'
});

const useMessageDialogState = createHook(Store, { selector: state => linkSelector(state) });

export const useMessageDialogCustomConfig = createHook(Store, {
    selector: state => state.customConfig
});

export const useMessageDialogActions = createHook(Store, { selector: null });

const getTypeColor = (type: MessageDialogType, theme: AppThemeColors): string => {
    switch (type) {
        case MessageDialogType.Info:
            return theme.info || theme.primary;
        case MessageDialogType.Warning:
            return theme.warning;
        case MessageDialogType.Error:
            return theme.error;
        case MessageDialogType.None:
        default:
            return theme.text;
    }
};

const iconsMap: Record<MessageDialogType, React.FC<{ theme: AppThemeColors }>> = {
    [MessageDialogType.None]: () => null,
    [MessageDialogType.Info]: ({ theme }) => (
        <AntDesign
            name="info-circle"
            size={24}
            color={getTypeColor(MessageDialogType.Info, theme)}
        />
    ),
    [MessageDialogType.Warning]: ({ theme }) => (
        <AntDesign
            name="warning"
            size={24}
            color={getTypeColor(MessageDialogType.Warning, theme)}
        />
    ),
    [MessageDialogType.Error]: ({ theme }) => (
        <AntDesign
            name="exclamation-circle"
            size={24}
            color={getTypeColor(MessageDialogType.Error, theme)}
        />
    )
};

export const MessageDialog: React.FC = () => {
    const [{ isOpen, title, message, renderContent, type, actions }] = useMessageDialogState();
    const [, { close }] = useMessageDialogActions();
    const theme = useAppTheme();
    const Icon = iconsMap[type] || iconsMap[MessageDialogType.None];

    const [mounted, setMounted] = useState(isOpen);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }).start(() => {
                setMounted(false);
            });
        }
    }, [isOpen, opacity]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            close();
            return true;
        });

        return () => {
            subscription?.remove();
        };
    }, [isOpen, close]);

    if (!mounted) {
        return null;
    }

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFill,
                styles.overlayContainer,
                { opacity }
            ]}
            pointerEvents={isOpen ? 'auto' : 'none'}
        >
            <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
                <View style={[styles.dialogContainer, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                    {!!title && (
                        <View style={styles.titleRow}>
                            <Icon theme={theme} />
                            <Text
                                style={[
                                    styles.titleText,
                                    {
                                        color: getTypeColor(type, theme),
                                        marginLeft: type !== MessageDialogType.None ? 10 : 0
                                    }
                                ]}
                            >
                                {title}
                            </Text>
                        </View>
                    )}
                    <View style={styles.content}>
                        {renderContent ? (
                            renderContent()
                        ) : (
                            <Text style={[styles.messageText, { color: theme.text }]}>
                                {message}
                            </Text>
                        )}
                    </View>
                    {actions?.length > 0 && (
                        <View style={styles.actionsContainer}>
                            {map(
                                actions,
                                ({
                                    id,
                                    handler,
                                    text,
                                    variant,
                                    size,
                                    isDisabled
                                }: MessageDialogActionOption, index: number) => (
                                    <Button
                                        key={id || index}
                                        title={text}
                                        onPress={handler}
                                        variant={variant || ButtonVariant.Secondary}
                                        size={size || ButtonSize.Small}
                                        disabled={isDisabled}
                                    />
                                )
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        zIndex: 99999,
        elevation: 99999,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    dialogContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    titleText: {
        fontSize: 18,
        fontWeight: '700',
        flexShrink: 1
    },
    content: {
        marginBottom: 20
    },
    messageText: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16,
    }
});

export default MessageDialog;
