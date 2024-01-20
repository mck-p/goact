import React, { FormEvent, useState } from 'react'
import { useSignIn, useUser } from '@clerk/clerk-react'
import { Helmet } from 'react-helmet'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { useTranslation } from 'react-i18next'

import styled from '@emotion/styled'
import Log from '../log'
import { Link, Redirect } from 'wouter'

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1440px;
  padding: 5rem;
  margin: 5rem auto 0;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;

  .MuiFormControl-root {
    margin-bottom: 2.5rem;
  }
`

const Input = styled(TextField)``

interface SignupErrors {
  password?: any
  email?: any
}

const Signup = () => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [errors, setErrors] = useState({} as SignupErrors)

  const [showFields, setShowFields] = useState({
    password: false,
    confirmPassword: false,
  })

  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useUser()

  const { t: translations } = useTranslation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setIsRequesting(true)

    try {
      const data = new FormData(e.target as HTMLFormElement)
      const email = data.get('email') as string
      const password = data.get('password') as string

      await signIn
        ?.create({
          identifier: email,
          password,
        })
        .then((result) => {
          if (result.status === 'complete') {
            setActive({ session: result.createdSessionId })
          } else {
            Log.warn(
              { result },
              'There was a result we do not know how to handle',
            )
          }
        })
        .catch((err) => {
          Log.warn({ err }, 'Error trying to sign user in')

          const errors = err.errors[0] as { code: string }

          if (errors.code === 'form_password_incorrect') {
            return setErrors({
              password: translations('signin.error.password.failed-check'),
            })
          }

          if (errors.code === 'form_identifier_not_found') {
            return setErrors({
              email: translations('signin.error.email.not-found'),
            })
          }

          Log.warn({ code: errors.code }, 'Did not handle the following code')
        })
    } catch (err) {
      Log.warn({ err }, 'Error during creating of user')
    } finally {
      setIsRequesting(false)
    }
  }

  const disabledInputs = !isLoaded || isRequesting

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Main>
      <Helmet>
        <title>Signin</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {translations('signin.headline')}
      </Typography>
      <Typography gutterBottom>{translations('signin.subtitle')}</Typography>
      <Form onSubmit={handleSubmit}>
        <Input
          error={Boolean(errors.email)}
          onKeyDown={() =>
            setErrors((err) => ({
              ...err,
              email: undefined,
            }))
          }
          type="email"
          id="email"
          name="email"
          label={translations('signin.form.input.email.label')}
          helperText={errors.email}
          required
          disabled={disabledInputs}
        />

        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            {translations('signin.form.input.password.label')}
          </InputLabel>
          <OutlinedInput
            error={Boolean(errors.password)}
            name="password"
            id="outlined-adornment-password"
            type={showFields.password ? 'text' : 'password'}
            disabled={disabledInputs}
            required
            onKeyDown={() =>
              setErrors((old) => ({
                ...old,
                password: undefined,
              }))
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setShowFields((oldFields) => ({
                      ...oldFields,
                      password: !oldFields.password,
                    }))
                  }
                  edge="end"
                >
                  {showFields.password ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={translations('signin.form.input.password.label')}
          />
          {errors.password ? (
            <FormHelperText>{errors.password}</FormHelperText>
          ) : (
            ''
          )}
        </FormControl>

        <ButtonGroup>
          <Button type="submit" variant="contained">
            {translations('signin.form.submit.label')}
          </Button>
          <Button type="reset" color="warning">
            {translations('signin.form.clear.label')}
          </Button>
          <Link href="/signup">
            <Button>{translations('signin.form.signup.label')}</Button>
          </Link>
        </ButtonGroup>
      </Form>
    </Main>
  )
}

export default Signup
