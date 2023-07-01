import React from 'react';
import map from 'lodash/map';
import styled, { css } from 'styled-components/native';
import {
    Button,
    Paragraph,
    Dialog,
    Portal,
    Title,
    useTheme
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { di } from 'react-magnetic-di';
import {
    useMessageDialogState,
    useMessageDialogActions,
    MESSAGE_DIALOG_TYPE
} from './store';

const getColor = ({ type, colors }) => ({
    [MESSAGE_DIALOG_TYPE.none]: colors.text,
    [MESSAGE_DIALOG_TYPE.info]: colors.primary,
    [MESSAGE_DIALOG_TYPE.warning]: colors.warning,
    [MESSAGE_DIALOG_TYPE.error]: colors.error
})[type];

export const ModalTitle = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 22px;
    margin-bottom: 18px;
    margin-horizontal: 24px;
`;

export const ModalTitleText = styled(Title)`
    margin-left: ${({ messageType }) => messageType !== MESSAGE_DIALOG_TYPE.none ? '10px' : 0};
    color: ${({ messageType, theme: { colors } }) => getColor({ type: messageType, colors })};
`;

export const Buttons = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
`;

export const ButtonWrapper = styled.View`
    padding-bottom: 5px;
    ${({ hasPadding }) => hasPadding && css`padding-left: 5px;`}
`;

const iconsMap = {
    // eslint-disable-next-line lodash/prefer-constant
    [MESSAGE_DIALOG_TYPE.none]: () => null,
    [MESSAGE_DIALOG_TYPE.info]: ({ colors }) => {
        di(AntDesign);

        return (
            <AntDesign
                name='infocirlceo'
                size={24}
                color={getColor({ type: MESSAGE_DIALOG_TYPE.info, colors })}
            />
        );
    },
    [MESSAGE_DIALOG_TYPE.warning]: ({ colors }) => {
        di(AntDesign);

        return (
            <AntDesign
                name='warning'
                size={24}
                color={getColor({ type: MESSAGE_DIALOG_TYPE.warning, colors })}
            />
        );
    },
    [MESSAGE_DIALOG_TYPE.error]: ({ colors }) => {
        di(AntDesign);

        return (
            <AntDesign
                name='exclamationcircleo'
                size={24}
                color={getColor({ type: MESSAGE_DIALOG_TYPE.error, colors })}
            />
        );
    }
};

const DialogContent = Dialog.Content;
const DialogActions = Dialog.Actions;

export const MessageDialog = () => {
    di(
        Button,
        ButtonWrapper,
        Buttons,
        Dialog,
        DialogActions,
        DialogContent,
        ModalTitle,
        ModalTitleText,
        Paragraph,
        Portal,
        useMessageDialogActions,
        useMessageDialogState,
        useTheme
    );

    const {
        isOpen,
        title,
        message,
        renderContent,
        type,
        actions
    } = useMessageDialogState();
    const { close } = useMessageDialogActions();
    const { colors } = useTheme();
    const Icon = iconsMap[type];

    return (
        <Portal>
            <Dialog visible={isOpen} onDismiss={close}>
                {title ? (
                    <ModalTitle>
                        <Icon colors={colors} />
                        <ModalTitleText messageType={type}>
                            {title}
                        </ModalTitleText>
                    </ModalTitle>
                ) : null}
                <DialogContent>
                    {renderContent ?
                        renderContent() : (
                            <Paragraph>{message}</Paragraph>
                        )
                    }
                </DialogContent>
                {actions?.length > 0 && (
                    <DialogActions>
                        <Buttons>
                            {map(
                                actions,
                                ({
                                    id,
                                    handler,
                                    text,
                                    color,
                                    mode,
                                    isDisabled
                                }, index) => (
                                    <ButtonWrapper
                                        key={id}
                                        hasPadding={index > 0}
                                    >
                                        <Button
                                            onPress={handler}
                                            disabled={isDisabled}
                                            color={color}
                                            mode={mode}
                                        >
                                            {text}
                                        </Button>
                                    </ButtonWrapper>
                                )
                            )}
                        </Buttons>
                    </DialogActions>
                )}
            </Dialog>
        </Portal>
    );
};
