import { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "@/app/services/searchService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter is required" });

  const results = await searchProducts(q as string);
  res.status(200).json(results);
}
