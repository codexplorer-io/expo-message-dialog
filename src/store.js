import {
    createStore,
    createHook
} from 'react-sweet-state';
import map from 'lodash/map';
import noop from 'lodash/noop';

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
    name: 'MessageDialog'
});

export const useMessageDialog = createHook(Store);

export const useMessageDialogActions = createHook(Store, { selector: null });
