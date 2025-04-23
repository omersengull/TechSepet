import prisma from "@/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: id as string },
     
      });
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
     
    } catch (error) {
      console.error('Kupon listeleme hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }