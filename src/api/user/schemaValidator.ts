import * as yup from 'yup'
import {
  EMAIL_NOT_LONG_ENOUGH,
  INVALID_EMAIL,
  MAX_EMAIL_STRING_LENGTH,
  MIN_EMAIL_STRING_LENGTH,
  PASSWORD_NOT_LONG_ENOUGH,
} from './constants'

const registerEmailValidation: yup.StringSchema = yup
  .string()
  .min(MIN_EMAIL_STRING_LENGTH, EMAIL_NOT_LONG_ENOUGH)
  .max(MAX_EMAIL_STRING_LENGTH)
  .email(INVALID_EMAIL)
const registerPasswordValidation: yup.StringSchema = yup
  .string()
  .min(MIN_EMAIL_STRING_LENGTH, PASSWORD_NOT_LONG_ENOUGH)
  .max(MAX_EMAIL_STRING_LENGTH)

export const verifyRegistrationEmail: yup.ObjectSchema<
  yup.Shape<{}, { email: string; password: string }>
> = yup.object().shape({
  email: registerEmailValidation,
  password: registerPasswordValidation,
})
