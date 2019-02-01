import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRoleType {
  Admin = 'admin',
  User = 'user',
  Ghost = 'ghost',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column('varchar', { length: 255 })
  public email: string

  @Column('text')
  public password: string

  @Column('boolean')
  public isVerified: boolean

  @Column('boolean')
  public hasRequestedPasswordReset: boolean

  @Column('boolean')
  public isLoggedIn: boolean

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'ghost'],
    default: 'ghost',
  })
  public role: UserRoleType
}
