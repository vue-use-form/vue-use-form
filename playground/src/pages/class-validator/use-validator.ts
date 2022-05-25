import { IsEmail, IsEmpty, MaxLength, MinLength } from 'class-validator'
import { useQuasar } from 'quasar'

import { useForm } from '../../../../packages/core/src/useForm'
import { useClassValidator } from '../../../../packages/resolver-class-validator/src'
import { IsUserAlreadyExist } from '../../shared/decorators/IsUserAlreadyExist'

class LoginForm {
  @MinLength(3, {
    message: 'Username must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Username must be at most 20 characters long',
  })
  @IsUserAlreadyExist({
    message: 'Username is already exist!',
  })
    username: string

  @MinLength(3, {
    message: 'Password must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long',
  })
    password: string

  @IsEmail({}, {
    message: 'Email is not valid!',
  })
    email: string
}

export function useValidator() {
  const resolver = useClassValidator(LoginForm)

  const $q = useQuasar()

  const {
    register,
    handleSubmit,
    formState: { errors },
    createSubmitHandler,
    createErrorHandler,
    isExistInErrors,
  } = useForm<LoginForm>({
    resolver,
    mode: 'onChange',
  })

  const formValidation = {
    username: register('username'),
    password: register('password'),
    email: register('email'),
  }

  const onSubmit = createSubmitHandler((data) => {
    $q.notify({
      type: 'positive',
      message: 'Login success.',
    })
  })

  const onError = createErrorHandler((errors) => {
    $q.notify({
      type: 'negative',
      message: 'Please make sure that you have correctly filled all fields!',
    })
  })

  const onLogin = () => handleSubmit(onSubmit, onError)

  return {
    handleSubmit,
    errors,
    onError,
    onSubmit,
    register,
    isExistInErrors,
    onLogin,
    formValidation,
  }
}
