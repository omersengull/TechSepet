"use client";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { Product } from "@prisma/client";
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from "react";
type ProductWithCategory = Product & {
    category?: { name: string } | null;
  };

  interface ManageClientProps {
    products: ProductWithCategory[];
  }
const ManageClient: React.FC<ManageClientProps> = ({ products }) => {
    const router = useRouter();
    let rows: any = [];
    if (products) {
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                brand: product.brand,
                category: product.category?.name || "Kategori Yok",
                image: product.image,
            };
        });
    }

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "price", headerName: "Price", width: 100 },
        { field: "category", headerName: "Category", width: 100 },
        { field: "brand", headerName: "Brand", width: 100 },
        {
            field: "inStock",
            headerName: "InStock",
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.inStock === true ? "Stokta Mevcut" : "Stokta Mevcut Değil"}
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <button
                        onClick={() => handleDelete(params.row.id, params.row.image)}
                        className="mx-4 text-red-500 cursor-pointer"
                    >
                        Sil
                    </button>
                );
            },
        },
    ];

    const handleDelete = useCallback(async (productId: string, imageUrl: string) => {
        toast.loading("Silme işlemi için bekleyin...");

        try {
            // API üzerinden resmi sil
            await axios.post("/api/delete-image", { imageUrl });

            // Ürünü veritabanından sil
            await axios.delete(`/api/product/${productId}`);
            toast.success("Silme işlemi başarılı");
            router.refresh();
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message;
            toast.error(`Silme hatası: ${errorMessage}`);
        } finally {
            toast.dismiss();
        }
    }, [router]);

    return (
        <div>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    );
};

export default ManageClient;
