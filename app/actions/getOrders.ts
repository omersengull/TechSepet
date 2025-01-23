import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    user: true, // Kullanıcı bilgilerini de dahil etmek isterseniz
                },
            });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
                                                                                                                                         