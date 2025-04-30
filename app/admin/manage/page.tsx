// app/(admin)/manage/page.tsx
import React from 'react';
import prisma from '@/libs/prismadb';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import ManageClient from '@/app/components/admin/ManageClient';
import WarningText from '@/app/components/warningText';

export const dynamic = 'force-dynamic';

const Manage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <WarningText text="Bu sayfaya erişilemez" />;
  }

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } }  // ← Burada ilişkiyi ekliyoruz
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full m-2">
      <ManageClient products={products} />
    </div>
  );
};

export default Manage;
