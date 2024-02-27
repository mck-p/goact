import styled from '@emotion/styled'

export const ItemWrap = styled.div`
  display: flex;
  width: 100%;
  padding: 1.25rem;
  align-items: center;
`

export const ItemInput = styled.div`
  flex-grow: 1;
  display: flex;

  .MuiFormControl-root {
    margin-bottom: 1.5rem;
  }
`

export const ItemButtons = styled.div`
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
`

export const ItemData = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`
