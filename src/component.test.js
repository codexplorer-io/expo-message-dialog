import React from 'react';
import { injectable } from 'react-magnetic-di';
import {
    Button,
    Paragraph,
    Dialog,
    Portal,
    useTheme
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { createMockComponent, mountWithDi } from '@codexporer.io/react-test-utils';
import {
    useMessageDialogState,
    useMessageDialogActions,
    MESSAGE_DIALOG_TYPE
} from './store';
import { MessageDialog, ModalTitle, ModalTitleText } from './component';

const DialogContent = Dialog.Content;
const DialogActions = Dialog.Actions;

describe('MessageDialog', () => {
    const useMessageDialogStateMock = jest.fn();
    const useThemeMock = jest.fn();
    const closeMessageDialogMock = jest.fn();
    const handler1Mock = jest.fn();
    const handler2Mock = jest.fn();

    const mockUseMessageDialogState = ({
        isOpen = false,
        title = 'mock title',
        message = 'mock message',
        type = MESSAGE_DIALOG_TYPE.none,
        actions = [
            {
                id: '1',
                handler: handler1Mock,
                text: 'button mock 1'
            },
            {
                id: '2',
                handler: handler2Mock,
                text: 'button mock 2',
                color: 'mock color',
                mode: 'mock mode',
                isDisabled: true
            }
        ]
    }) => {
        useMessageDialogStateMock.mockReturnValue({
            isOpen,
            title,
            message,
            type,
            actions
        });
    };

    const defaultDeps = [
        injectable(AntDesign, createMockComponent('AntDesign')),
        injectable(Button, createMockComponent('Button')),
        injectable(Dialog, createMockComponent('Dialog')),
        injectable(DialogActions, createMockComponent('DialogActions')),
        injectable(DialogContent, createMockComponent('DialogContent')),
        injectable(ModalTitle, createMockComponent('ModalTitle')),
        injectable(ModalTitleText, createMockComponent('ModalTitleText')),
        injectable(Paragraph, createMockComponent('Paragraph')),
        injectable(Portal, createMockComponent('Portal')),
        injectable(useMessageDialogState, useMessageDialogStateMock),
        injectable(useMessageDialogActions, () => ({ close: closeMessageDialogMock })),
        injectable(useTheme, useThemeMock)
    ];

    beforeEach(() => {
        useThemeMock.mockReturnValue({
            colors: {
                text: 'mockTextColor',
                primary: 'mockPrimaryColor',
                warning: 'mockWarningColor',
                error: 'mockErrorColor'
            }
        });
        mockUseMessageDialogState({});
    });

    it('should render dialog closed', () => {
        mockUseMessageDialogState({ isOpen: false });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('Dialog').props().visible).toBe(false);
    });

    it('should render dialog open', () => {
        mockUseMessageDialogState({ isOpen: true });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('Dialog').props().visible).toBe(true);
    });

    it('should pass close to dialog dismiss', () => {
        mockUseMessageDialogState({});

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('Dialog').props().onDismiss).toBe(closeMessageDialogMock);
    });

    it('should render modal title', () => {
        mockUseMessageDialogState({ title: 'mock title' });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('ModalTitle')).toHaveLength(1);
    });

    it('should not render modal title', () => {
        mockUseMessageDialogState({ title: '' });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('ModalTitle')).toHaveLength(0);
    });

    it('should render without icon', () => {
        mockUseMessageDialogState({ title: 'mock title', type: MESSAGE_DIALOG_TYPE.none });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('AntDesign')).toHaveLength(0);
    });

    it('should render info icon', () => {
        mockUseMessageDialogState({ title: 'mock title', type: MESSAGE_DIALOG_TYPE.info });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('AntDesign').props()).toEqual({
            name: 'infocirlceo',
            size: 24,
            color: 'mockPrimaryColor'
        });
    });

    it('should render warning icon', () => {
        mockUseMessageDialogState({ title: 'mock title', type: MESSAGE_DIALOG_TYPE.warning });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('AntDesign').props()).toEqual({
            name: 'warning',
            size: 24,
            color: 'mockWarningColor'
        });
    });

    it('should render error icon', () => {
        mockUseMessageDialogState({ title: 'mock title', type: MESSAGE_DIALOG_TYPE.error });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('AntDesign').props()).toEqual({
            name: 'exclamationcircleo',
            size: 24,
            color: 'mockErrorColor'
        });
    });

    it('should render dialog actions', () => {
        mockUseMessageDialogState({});

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        const actions = wrapper.find('DialogActions');
        expect(actions).toHaveLength(1);
        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(actions.find('Button').at(0).props()).toEqual({
            onPress: handler1Mock,
            children: 'button mock 1'
        });
        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(actions.find('Button').at(1).props()).toEqual({
            onPress: handler2Mock,
            children: 'button mock 2',
            color: 'mock color',
            mode: 'mock mode',
            disabled: true
        });
    });

    it('should not render dialog actions when null', () => {
        mockUseMessageDialogState({ actions: null });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('DialogActions')).toHaveLength(0);
    });

    it('should not render dialog actions when empty', () => {
        mockUseMessageDialogState({ actions: [] });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('DialogActions')).toHaveLength(0);
    });

    it('should render modal message', () => {
        mockUseMessageDialogState({ message: 'mock message' });

        const wrapper = mountWithDi(
            <MessageDialog />,
            { deps: defaultDeps }
        );

        // eslint-disable-next-line lodash/prefer-lodash-method
        expect(wrapper.find('DialogContent').find('Paragraph').props()).toEqual({
            children: 'mock message'
        });
    });
});
