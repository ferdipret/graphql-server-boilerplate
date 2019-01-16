import * as yup from 'yup'
import {
  emailNotLongEnough,
  invalidEmail,
  maxEmailStringLength,
  minEmailStringLength,
  passwordNotLongEnough,
} from './constants'

const registerEmailValidation: yup.StringSchema = yup
  .string()
  .min(minEmailStringLength, emailNotLongEnough)
  .max(maxEmailStringLength)
  .email(invalidEmail)
const registerPasswordValidation: yup.StringSchema = yup
  .string()
  .min(minEmailStringLength, passwordNotLongEnough)
  .max(maxEmailStringLength)

export const schema: yup.ObjectSchema<
  yup.Shape<{}, { email: string; password: string }>
> = yup.object().shape({
  email: registerEmailValidation,
  password: registerPasswordValidation,
})
