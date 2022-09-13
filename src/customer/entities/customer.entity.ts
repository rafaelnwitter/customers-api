import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'customer' })
class Customer {
  @PrimaryKey()
  @Property()
  id: string = v4();

  @Property({ unique: true })
  email: string;

  @Property()
  name?: string;

  @Property()
  document: number;

  @Property({ hidden: true })
  password: string;
}

export default Customer;
