import styled from '@emotion/styled'

export const HomeBackground = styled.div`
    width: 100%;
    height: 100vh;
    background-color: ${(props) => props.theme.primaryColor.black[1]};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const Card = styled.div`
    width: 480px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 32px;
    border-radius: 16px;
    background-color: ${(props) => props.theme.primaryColor.black[1]};
    color: ${(props) => props.theme.primaryColor.grey[2]};
    border-style: solid;
    border-width: thin;
    align-items: center;
    border-color: ${(props) => props.theme.primaryColor.white[1]};
`
