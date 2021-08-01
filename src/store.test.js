import noop from 'lodash/noop';
import { Store, MESSAGE_DIALOG_TYPE } from './store';

describe('store', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have actions and initial state', () => {
        const { initialState, actions } = Store;
        expect(initialState).toStrictEqual({
            isOpen: false,
            title: '',
            message: '',
            type: MESSAGE_DIALOG_TYPE.none,
            actions: [],
            onOpen: null,
            onClose: null
        });
        expect(actions).toStrictEqual({
            open: expect.any(Function),
            close: expect.any(Function)
        });
    });

    describe('open', () => {
        it('should open modal', () => {
            const { actions: { open } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: false }));
            const thunk = open({
                message: 'mock message',
                actions: ['mock action 1', 'mock action 2']
            });

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith({
                isOpen: true,
                title: '',
                message: 'mock message',
                type: MESSAGE_DIALOG_TYPE.none,
                actions: ['mock action 1', 'mock action 2'],
                onOpen: null,
                onClose: null
            });
        });

        it('should open modal with title', () => {
            const { actions: { open } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: false }));
            const thunk = open({
                title: 'mock title',
                message: 'mock message',
                actions: ['mock action 1', 'mock action 2']
            });

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith(expect.objectContaining({
                title: 'mock title'
            }));
        });

        it('should open modal with type', () => {
            const { actions: { open } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: false }));
            const thunk = open({
                message: 'mock message',
                type: MESSAGE_DIALOG_TYPE.error,
                actions: ['mock action 1', 'mock action 2']
            });

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith(expect.objectContaining({
                type: MESSAGE_DIALOG_TYPE.error
            }));
        });

        it('should pass and call onOpen', () => {
            const { actions: { open } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: false }));
            const onOpen = jest.fn();
            const thunk = open({
                message: 'mock message',
                actions: ['mock action 1', 'mock action 2'],
                onOpen
            });

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith(expect.objectContaining({
                onOpen
            }));
            expect(onOpen).toHaveBeenCalledTimes(1);
        });

        it('should not open modal when opened', () => {
            const { actions: { open } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: true }));
            const thunk = open({
                message: 'mock message',
                actions: ['mock action 1', 'mock action 2']
            });

            thunk({ getState, setState });

            expect(setState).not.toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should close modal', () => {
            const { actions: { close } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({
                isOpen: true,
                actions: [
                    { id: '1', handler: jest.fn(), text: 'action mock 1' },
                    { id: '2', handler: jest.fn(), text: 'action mock 2' }
                ]
            }));
            const thunk = close();

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith({
                isOpen: false,
                actions: [
                    { id: '1', handler: noop, text: 'action mock 1' },
                    { id: '2', handler: noop, text: 'action mock 2' }
                ],
                onOpen: null,
                onClose: null
            });
        });

        it('should call onClose', () => {
            const { actions: { close } } = Store;
            const setState = jest.fn();
            const onClose = jest.fn();
            const getState = jest.fn(() => ({ isOpen: true, onClose }));
            const thunk = close();

            thunk({ getState, setState });

            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith({
                isOpen: false,
                actions: [],
                onOpen: null,
                onClose: null
            });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('should not close modal when closed', () => {
            const { actions: { close } } = Store;
            const setState = jest.fn();
            const getState = jest.fn(() => ({ isOpen: false }));
            const thunk = close();

            thunk({ getState, setState });

            expect(setState).not.toHaveBeenCalled();
        });
    });
});
