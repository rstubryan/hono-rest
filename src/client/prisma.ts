import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient({
  log: ['info', 'error', 'query', 'warn'],
  errorFormat: 'pretty',
})

export default prisma
