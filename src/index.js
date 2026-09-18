import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated
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

export const MESSAGE_DIALOG_TYPE = {
    none: 'none',
    info: 'info',
    warning: 'warning',
    error: 'error'
};

const initialState = {
    ...linkInitialState,
    isOpen: false,
    title: '',
    message: '',
    renderContent: null,
    type: MESSAGE_DIALOG_TYPE.none,
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
            type = MESSAGE_DIALOG_TYPE.none,
            actions = [],
            onOpen = null,
            onClose = null,
            customConfig = null
        } = {}) => ({ getState, setState }) => {
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
        } = {}) => ({ getState, setState }) => {
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
                customConfig: (previousCustomConfig || customConfig) && {
                    ...(previousCustomConfig ?? {}),
                    ...(customConfig ?? {})
                }
            });
        },
        close: () => ({ getState, setState }) => {
            const { isOpen, onClose, actions: oldActions } = getState();
            if (!isOpen) {
                return;
            }

            const actions = map(oldActions, action => ({
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

const MessageDialogContext = createContext(null);

export const MessageDialogProvider = ({ children, theme }) => {
    return (
        <MessageDialogContext.Provider value={theme}>
            {children}
            <MessageDialog />
        </MessageDialogContext.Provider>
    );
};

const useMessageDialogTheme = () => {
    const context = useContext(MessageDialogContext);
    if (!context) {
        throw new Error('useMessageDialogTheme must be used within a MessageDialogProvider with a mandatory theme prop.');
    }
    return context;
};

const getColor = ({ type, colors }) => ({
    [MESSAGE_DIALOG_TYPE.none]: colors.titleText || colors.messageText,
    [MESSAGE_DIALOG_TYPE.info]: colors.info,
    [MESSAGE_DIALOG_TYPE.warning]: colors.warning,
    [MESSAGE_DIALOG_TYPE.error]: colors.error
})[type];

const iconsMap = {
    [MESSAGE_DIALOG_TYPE.none]: () => null,
    [MESSAGE_DIALOG_TYPE.info]: ({ colors }) => (
        <AntDesign
            name="info-circle"
            size={24}
            color={getColor({ type: MESSAGE_DIALOG_TYPE.info, colors })}
        />
    ),
    [MESSAGE_DIALOG_TYPE.warning]: ({ colors }) => (
        <AntDesign
            name="warning"
            size={24}
            color={getColor({ type: MESSAGE_DIALOG_TYPE.warning, colors })}
        />
    ),
    [MESSAGE_DIALOG_TYPE.error]: ({ colors }) => (
        <AntDesign
            name="exclamation-circle"
            size={24}
            color={getColor({ type: MESSAGE_DIALOG_TYPE.error, colors })}
        />
    )
};

export const MessageDialog = () => {
    const [{ isOpen, title, message, renderContent, type, actions }] = useMessageDialogState();
    const theme = useMessageDialogTheme();
    const { colors } = theme;
    const Icon = iconsMap[type] || iconsMap[MESSAGE_DIALOG_TYPE.none];

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
            <View style={[styles.overlay, { backgroundColor: colors.overlayBackground }]}>
                <View style={[styles.dialogContainer, { backgroundColor: colors.dialogBackground, shadowColor: colors.shadowColor }]}>
                    {!!title && (
                        <View style={styles.titleRow}>
                            <Icon colors={colors} />
                            <Text
                                style={[
                                    styles.titleText,
                                    {
                                        color: getColor({ type, colors }) || colors.titleText || colors.messageText,
                                        marginLeft: type !== MESSAGE_DIALOG_TYPE.none ? 10 : 0
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
                            <Text style={[styles.messageText, { color: colors.messageText }]}>
                                {message}
                            </Text>
                        )}
                    </View>
                    {actions?.length > 0 && (
                        <View style={styles.buttonsContainer}>
                            {map(
                                actions,
                                ({
                                    id,
                                    handler,
                                    text,
                                    color,
                                    isDisabled
                                }, index) => (
                                    <TouchableOpacity
                                        key={id || index}
                                        onPress={handler}
                                        disabled={isDisabled}
                                        style={[
                                            styles.button,
                                            {
                                                backgroundColor: color || colors.buttonBackground,
                                                borderColor: colors.buttonBorder || 'transparent',
                                                opacity: isDisabled ? 0.5 : 1
                                            },
                                            index > 0 && styles.buttonMarginLeft
                                        ]}
                                    >
                                        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                                            {text}
                                        </Text>
                                    </TouchableOpacity>
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonMarginLeft: {
        marginLeft: 8
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600'
    }
});
