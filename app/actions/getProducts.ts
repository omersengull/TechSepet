import prisma from '@/libs/prismadb'
export interface IProductParams {
    category?: string | null,
    search?: string | null
}
export default async function getProducts(params: IProductParams) {
    try {
        const { category, search } = params;
        let searchString = search;
        if (!search) {
            searchString = "";
        }
        const query: any = {}
        if (category) {
            query.category = category;
        }
        const products = await prisma.product.findMany({
            include: {
                reviews: {
                    include: {
                        user: true // Review ile ilişkili kullanıcı bilgilerini getir
                    },
                    orderBy: {
                        createdAt: "desc" // Yorumları oluşturulma tarihine göre sırala
                    }
                }
            }
        });


        return products;
    } catch (error: any) {
        throw new Error(error)
    }
}