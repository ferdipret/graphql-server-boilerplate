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

async function login(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ id }, { isLoggedIn: true })
  const loggedInUser: User | undefined = await userRepository.findOne({ id })

  return loggedInUser
}

async function logout(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ id }, { isLoggedIn: false })
  const loggedInUser: User | undefined = await userRepository.findOne({ id })

  return loggedInUser
}

async function verifyUser(id: string) {
  const userRepository: Repository<User> = getRepository(User)
  await userRepository.update({ id }, { isVerified: true, isLoggedIn: true })
  const verifiedUser: User | undefined = await userRepository.findOne({ id })

  return verifiedUser
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
