import React from 'react'
import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'

const Page = styled.main`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

const Form = styled.form`
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: rgba(33, 33, 33, 0.5);
  padding: 2rem;
`

const CreateCommunity = () => {
  const handleFormSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as any)

    // @ts-ignore
    console.dir([...formData.values()])
  }

  return (
    <Page>
      <Form onSubmit={handleFormSubmit}>
        <Typography variant="h2" align="center" gutterBottom>
          New Community
        </Typography>
        <TextField
          name="name"
          label="Community Name"
          helperText="What do you want to call your community?"
          required
          fullWidth
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked name="public" />}
            label="Make Public"
          />
        </FormGroup>
        <Button type="submit" variant="contained" color="primary">
          Create Community
        </Button>
      </Form>
    </Page>
  )
}

export default CreateCommunity
