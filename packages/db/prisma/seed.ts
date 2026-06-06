import { PrismaClient } from '../src/generated/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const aliceHashedPassword = await bcrypt.hash('alice', 10);
  const bobHashedPassword = await bcrypt.hash('bob', 10);

  const jamesHashedPassword = await bcrypt.hash('james', 10);

  const ronHashedPassword = await bcrypt.hash('ron', 10);

  const alice = await prisma.user.upsert({
    where: { number: '9999999999' },
    update: {},
    create: {
      number: '9999999999',
      password: aliceHashedPassword,
      name: 'alice',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { number: '9999999998' },
    update: {},
    create: {
      number: '9999999998',
      password: bobHashedPassword,
      name: 'bob',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 0,
          locked: 0,
        },
      },
    },
  })

  const james = await prisma.user.upsert({
    where: { number: '7979797979' },
    update: {},
    create: {
      number: '7979797979',
      password: jamesHashedPassword,
      name: 'james',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "1224545",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
    },
  })

  const ron = await prisma.user.upsert({
    where: { number: '5757575757' },
    update: {},
    create: {
      number: '5757575757',
      password: ronHashedPassword,
      name: 'alice',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "12244",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
    },
  })



  console.log({ alice, bob, james, ron })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })