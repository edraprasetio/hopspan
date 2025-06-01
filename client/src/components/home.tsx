import styled from '@emotion/styled'

export const HomeBackground = styled.div`
    width: 100%;
    min-height: 100vh;
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
    margin: 64px 0px;
    background-color: ${(props) => props.theme.primaryColor.black[1]};
    color: ${(props) => props.theme.primaryColor.grey[2]};
    border-style: solid;
    border-width: thin;
    align-items: center;
    border-color: ${(props) => props.theme.primaryColor.white[1]};
    transition: border-color 0.3s ease;

    &:hover {
        border-color: ${(props) => props.theme.primaryColor.blue[1]};
    }

    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        width: unset;
        margin-left: 16px;
        margin-right: 16px;
        margin-bottom: 32px;
    }
`

export const SubCard = styled(Card)`
    gap: 16px;
    padding: 16px;
    width: 100%;
    margin-top: unset;
    margin-bottom: unset;
    text-align: center;
    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        margin: unset;
    }
`

export const SubCardWrapper = styled.div`
    display: flex;
    gap: 16px;
    width: 100%;
    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        width: unset;
        gap: 16px;
        margin-right: 16px;
        margin-left: 16px;
    }
`

export const LocationHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media (max-width: ${(props) => props.theme.breakPoints.largePhone}) {
        flex-direction: column;
        align-items: center;
    }
`
