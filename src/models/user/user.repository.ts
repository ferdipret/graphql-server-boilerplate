import { config } from 'dotenv'
import * as jwt from 'jsonwebtoken'
import { getRepository, Repository } from 'typeorm'

import { User } from './user.entity'

config()

async function getUserByEmail(email: string) {
  const userRepository: Repository<User> = getRepository(User)
  const user: User | undefined = await userRepository.findOne({ email })

  return user
}

async function getUserByToken(token: string) {
  let validToken: string | object

  try {
    validToken = await jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (error) {
    return error
  }

  if (validToken) {
    const tokenData: string | { [key: string]: any } | null = jwt.decode(token) as object
    const user: User | undefined = await getUserByEmail(tokenData.email)

    return user
  }

  return undefined
}

async function verifyUser(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ id }, { isVerified: true })
  const verifiedUser: User | undefined = await userRepository.findOne({ id })

  return verifiedUser
}

export { getUserByEmail, getUserByToken, verifyUser }
