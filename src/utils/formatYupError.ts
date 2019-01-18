import { ValidationError } from 'yup'
import { Error } from '../generated/graphql'

type formatYupErrors = (error: ValidationError) => Error[]

export const formatYupError: formatYupErrors = (error: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = []
  error.inner.forEach(innerError => {
    errors.push({
      path: innerError.path,
      message: innerError.message,
    })
  })

  return errors
}
