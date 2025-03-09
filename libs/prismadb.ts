import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // .env'den gelen bağlantı URL'si
        },
    },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma bağlantısını kapatmayı yönet
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma MongoDB connection closed due to app termination");
    process.exit(0);
});

export default prisma;
