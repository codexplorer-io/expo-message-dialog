import {
    createStore,
    createHook
} from 'react-sweet-state';

export const MESSAGE_DIALOG_TYPE = {
    none: 'none',
    info: 'info',
    warning: 'warning',
    error: 'error'
};

const initialState = {
    isOpen: false,
    title: '',
    message: '',
    type: MESSAGE_DIALOG_TYPE.none,
    actions: [],
    onOpen: null,
    onClose: null
};

export const Store = createStore({
    initialState,
    actions: {
        open: ({
            title = '',
            message,
            type = MESSAGE_DIALOG_TYPE.none,
            actions,
            onOpen = null,
            onClose = null
        }) => ({ getState, setState }) => {
            const { isOpen } = getState();
            if (isOpen) {
                return;
            }

            setState({
                isOpen: true,
                title,
                message,
                type,
                actions,
                onOpen,
                onClose
            });
            onOpen?.();
        },
        close: () => ({ getState, setState }) => {
            const { isOpen, onClose } = getState();
            if (!isOpen) {
                return;
            }

            setState(initialState);
            onClose?.();
        }
    },
    name: 'MessageDialog'
});

export const useMessageDialog = createHook(Store);

export const useMessageDialogActions = createHook(Store, { selector: null });
