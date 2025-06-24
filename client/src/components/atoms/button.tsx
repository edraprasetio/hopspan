import styled from '@emotion/styled'

export const BigBlackButton = styled.button`
    width: 498px;
    padding: 12px 24px;
    border: 2px;
    background-color: #000000;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #ffffff;
    line-height: 29.26px;
    letter-spacing: 10%;
    &:hover {
        background-color: #374092;
    }
`

export const MediumBlackButton = styled(BigBlackButton)`
    width: unset;
    height: 36px;
    padding: 0px 24px;
    border-radius: 16px;
    font-family: Monsterrat-Medium;
    font-size: 18px;
    color: #ffffff;
`

export const WhiteButton = styled.button`
    display: flex;
    padding: 12px 32px;
    border-radius: 36px;
    align-items: center;
    justify-content: center;
    border: 3px solid ${(props) => props.theme.primaryColor.white[1]};
    background-color: ${(props) => props.theme.primaryColor.white[1]};
    color: ${(props) => props.theme.primaryColor.black[1]};

    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    &:hover {
        border: 3px solid ${(props) => props.theme.primaryColor.green[1]};
        background-color: ${(props) => props.theme.primaryColor.green[1]};
        color: ${(props) => props.theme.primaryColor.white[1]};
    }
    &:active {
        background-color: ${(props) => props.theme.primaryColor.white[1]};
        color: ${(props) => props.theme.primaryColor.green[1]};
    }
`

export const GreenButton = styled(WhiteButton)`
    border: 3px solid ${(props) => props.theme.primaryColor.green[1]};
    background-color: ${(props) => props.theme.primaryColor.green[1]};
    color: ${(props) => props.theme.primaryColor.white[1]};
    letter-spacing: 2px;

    &:hover {
        border: 3px solid ${(props) => props.theme.primaryColor.green[2]};
        background-color: ${(props) => props.theme.primaryColor.green[2]};
        color: ${(props) => props.theme.primaryColor.white[1]};
    }
    &:active {
        background-color: ${(props) => props.theme.primaryColor.white[1]};
        color: ${(props) => props.theme.primaryColor.green[1]};
    }
`
