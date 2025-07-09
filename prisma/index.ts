import { PrismaClient } from '../generated/prisma'

export const prismaClient = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  console.log('Prisma Client initialized successfully')
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })