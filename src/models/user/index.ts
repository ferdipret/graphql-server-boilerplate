import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column('varchar', { length: 255 })
  public email: string

  @Column('text')
  public password: string
}
