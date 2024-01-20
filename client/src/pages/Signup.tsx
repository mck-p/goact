import React, { FormEvent, useState } from 'react'
import { useSignUp, useUser } from '@clerk/clerk-react'
import { Helmet } from 'react-helmet'
import TopBar from '../components/TopBar'

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
import { Link, Redirect } from 'wouter'

import styled from '@emotion/styled'
import Log from '../log'

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
  password?: string
  email?: string
  confirmPassword?: string
}

const Signup = () => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [errors, setErrors] = useState({} as SignupErrors)
  const [showFields, setShowFields] = useState({
    password: false,
    confirmPassword: false,
  })

  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useUser()
  const { t: translations } = useTranslation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setIsRequesting(true)

    try {
      const data = new FormData(e.target as HTMLFormElement)
      const email = data.get('email') as string
      const password = data.get('password') as string
      const confirmPassword = data.get('confirm-password') as string

      if (confirmPassword !== password) {
        return setErrors({
          confirmPassword: translations('signup.error.password.mismatch'),
        })
      }

      /**
       * Must have a lowercase letter, an uppercase letter, a special character,
       * and be _at least_ 8 characters long
       */
      const regexp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&* ]{8,}$/

      if (!regexp.test(password)) {
        return setErrors({
          password: translations('signup.error.password.failed-check'),
        })
      }

      await signUp
        ?.create({
          emailAddress: email,
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
          Log.warn({ err }, 'Error trying to sign user up')

          const errors = err.errors[0] as { code: string }

          if (errors.code === 'form_password_pwned') {
            return setErrors({
              password: translations('signup.error.password.breached'),
            })
          }

          if (errors.code === 'form_identifier_exists') {
            return setErrors({
              email: translations('signup.error.email.already-exists'),
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
    return <Redirect to="/profile#/profile" />
  }

  return (
    <Main>
      <Helmet>
        <title>Signup</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {translations('signup.headline')}
      </Typography>
      <Typography gutterBottom>{translations('signup.subtitle')}</Typography>
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
          label={translations('signup.form.input.email.label')}
          helperText={errors.email}
          required
          disabled={disabledInputs}
        />

        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            {translations('signup.form.input.password.label')}
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
            label={translations('signup.form.input.password.label')}
          />
          {errors.password ? (
            <FormHelperText>{errors.password}</FormHelperText>
          ) : (
            ''
          )}
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-confirm-password">
            {translations('signup.form.input.confirm-password.label')}
          </InputLabel>
          <OutlinedInput
            error={Boolean(errors.confirmPassword)}
            required
            id="outlined-adornment-confirm-password"
            type={showFields.confirmPassword ? 'text' : 'password'}
            name="confirm-password"
            disabled={disabledInputs}
            onKeyDown={() =>
              setErrors((old) => ({
                ...old,
                confirmPassword: undefined,
              }))
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() =>
                    setShowFields((oldFields) => ({
                      ...oldFields,
                      confirmPassword: !oldFields.confirmPassword,
                    }))
                  }
                  edge="end"
                >
                  {showFields.confirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label={translations('signup.form.input.confirm-password.label')}
          />
          {errors.confirmPassword ? (
            <FormHelperText>{errors.confirmPassword}</FormHelperText>
          ) : (
            ''
          )}
        </FormControl>

        <ButtonGroup>
          <Button type="submit" variant="contained">
            {translations('signup.form.submit.label')}
          </Button>
          <Button type="reset" color="warning">
            {translations('signup.form.clear.label')}
          </Button>
          <Link href="/signin">
            <Button>{translations('signup.form.signin.label')}</Button>
          </Link>
        </ButtonGroup>
      </Form>
    </Main>
  )
}

export default Signup
