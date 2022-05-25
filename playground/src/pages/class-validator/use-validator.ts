import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { ElMessage } from 'element-plus'

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
    ElMessage({
      type: 'success',
      message: 'Successfully!',
    })
  })

  const onError = createErrorHandler((errors) => {
    ElMessage({
      type: 'error',
      message: 'Please make sure that you have correctly filled all fields!',
    })
  })

  return {
    handleSubmit,
    errors,
    onError,
    onSubmit,
    register,
    isExistInErrors,
    formValidation,
  }
}
