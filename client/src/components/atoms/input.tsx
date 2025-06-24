import styled from '@emotion/styled'
import { useState } from 'react'
import { Paragraph12, Paragraph14, Paragraph16 } from '../../styles/typography'

const StyledInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
`

const StyledLabel = styled.label`
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.primaryColor.black[1]};
    text-align: left;
`

const StyledInput = styled.input`
    padding: 16px 16px;
    background-color: ${(props) => props.theme.primaryColor.white[2]};
    border: 1px solid ${(props) => props.theme.primaryColor.white[2]};
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
    font-family: PlusJakartaSans-Light;
    font-size: 16px;
    color: ${(props) => props.theme.primaryColor.black[1]};

    &:hover {
        border-color: ${(props) => props.theme.primaryColor.green[1]};
    }

    &:focus {
        border-color: ${(props) => props.theme.primaryColor.green[1]};
    }

    &.error {
        border-color: #cf8081;
        &:focus {
            background-color: ${(props) => props.theme.primaryColor.white[2]};
            border-color: ${(props) => props.theme.primaryColor.red[1]};
        }
    }
`

const StyledMessage = styled.span`
    text-align: right;
    margin-top: 4px;
    font-size: 12px;
    color: ${(props) => props.theme.primaryColor.black[1]};
`

const CustomInput = ({ label, status, message, ...inputProps }: any) => {
    const displayedMessage = status === 'error' ? message : message || ''
    return (
        <StyledInputContainer>
            <StyledLabel>
                <Paragraph14 style={{ color: '#0a0a0a' }}>{label}</Paragraph14>
            </StyledLabel>
            <StyledInput
                {...inputProps}
                className={status === 'error' ? 'error' : ''}
            />
            {displayedMessage && (
                <StyledMessage>
                    <Paragraph14>{displayedMessage}</Paragraph14>
                </StyledMessage>
            )}
        </StyledInputContainer>
    )
}

export default CustomInput
