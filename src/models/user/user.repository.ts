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
  let validToken: User

  try {
    validToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as User
  } catch (error) {
    return error
  }

  if (validToken) {
    const user: User | undefined = await getUserByEmail(validToken.email)

    return user
  }

  return undefined
}

async function login(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  const user: User | undefined = await userRepository.findOne({ id })

  return user
}

async function logout(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  const user: User | undefined = await userRepository.findOne({ id })

  return user
}

async function verifyUser(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ id }, { isVerified: true })
  const user: User | undefined = await userRepository.findOne({ id })

  return user
}

async function resetPassword(email: string) {
  const userRepository: Repository<User> = getRepository(User)

  try {
    await userRepository.update({ email }, { hasRequestedPasswordReset: true })

    const user: User | undefined = await userRepository.findOne({ email })

    return user
  } catch (error) {
    return error
  }
}

async function updateUserPassword(email: string, password: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ email }, { password })

  const user: User | undefined = await userRepository.findOne({ email })

  return user
}

export {
  getUserByEmail,
  getUserByToken,
  login,
  logout,
  verifyUser,
  resetPassword,
  updateUserPassword,
}
