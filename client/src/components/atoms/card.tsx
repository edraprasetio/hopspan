import styled from '@emotion/styled'

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.primaryColor.white[1]};
    width: 100%;
    box-shadow: 0px 3px 8.7px rgba(0, 0, 0, 0.25);
    gap: 32px;
    border-radius: 8px;
    padding: 32px;
    z-index: 1;

    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        width 100%;
        margin-left: 16px;
        margin-right: 16px;
    }
`

export const CardContent = styled.div`
    margin: 32px;
`

export const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 576px;
    gap: 16px;
    color: #b0b0bc;
    align-items: center;

    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        width: unset;
        margin-left: 64px;
        margin-right: 64px;
    }
`
