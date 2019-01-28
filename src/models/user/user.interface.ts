import { getRepository, Repository } from 'typeorm'
import { User } from './user.entity'

async function getUserByEmail(email: string) {
  const userRepository: Repository<User> = getRepository(User) // you can also get it via getConnection().getRepository() or getManager().getRepository()
  const user: User | undefined = await userRepository.findOne({ email })

  return user
}

export { getUserByEmail }
