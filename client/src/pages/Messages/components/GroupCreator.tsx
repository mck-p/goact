import React, { FormEventHandler } from 'react'
import styled from '@emotion/styled'
import { Button, TextField } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
const Form = styled.form`
  width: 100%;

  button {
    margin-top: 0.5rem;
  }
`

interface Props {
  createNewGroup: FormEventHandler<HTMLFormElement>
}

const GroupCreator = ({ createNewGroup }: Props) => {
  return (
    <Form onSubmit={createNewGroup}>
      <TextField name="name" fullWidth label="New Group Name" required />
      <Button
        type="submit"
        variant="contained"
        startIcon={<GroupAddIcon />}
        fullWidth
      >
        Create
      </Button>
    </Form>
  )
}

export default GroupCreator
