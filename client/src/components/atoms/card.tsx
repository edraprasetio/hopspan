import styled from '@emotion/styled'

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.primaryColor.white[1]};
    width: 576px;
    box-shadow: 0px 3px 8.7px rgba(0, 0, 0, 0.25);
    gap: 32px;
    border-radius: 8px;
    padding: 32px;
    z-index: 1;
`
