import prisma from "./prismadb";

// middleware.ts
prisma.$use(async (params, next) => {
    if (params.model === 'Product') {
      if (params.action === 'create' || params.action === 'update') {
        // Stock değeri varsa inStock'u hesapla
        if (params.args.data.stock !== undefined) {
          params.args.data.inStock = params.args.data.stock > 0;
        }
        
        // Eğer increment/decrement kullanılıyorsa (MongoDB için özel işlem)
        if (params.args.data.stock?.increment !== undefined) {
          // Bu kısım MongoDB için özelleştirilmeli (örnek bir logic)
          const currentProduct = await prisma.product.findUnique({
            where: { id: params.args.where.id }
          });
          const newStock = currentProduct?.stock + params.args.data.stock.increment;
          params.args.data.inStock = newStock > 0;
        }
      }
    }
    return next(params);
  });