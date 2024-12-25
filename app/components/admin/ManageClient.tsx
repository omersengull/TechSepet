"use client"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { Product } from "@prisma/client"
import { useCallback } from 'react';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import firebaseApp from '@/libs/firebase';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from "react"
interface ManageClientProps {
    products: Product[]
}
const ManageClient: React.FC<ManageClientProps> = ({ products }) => {
    const router = useRouter();
    const storage = getStorage(firebaseApp);
    let rows: any = []
    if (products) {
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                image: product.image
            }


        })
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
                        {params.row.inStock == true ? "Stokta Mevcut" : "Stokta Mevcut Değil"}
                    </div>
                )
            }
        },
        {
            field: "actions",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <button onClick={() => handleDelete(params.row.id, params.row.image)} className='mx-4 text-red-500 cursor-pointer '>
                        Sil
                    </button>
                )
            }
        },
    ]
    const handleDelete = useCallback(async (id: string, image: any) => {
        toast.success("Silme işlemi için bekleyin...")
        const handleDeleteImg = async () => {

            const imageRef = ref(storage, image);
            await deleteObject(imageRef);


        }
        await handleDeleteImg();
        axios.delete(`/api/product/${id}`).then(() => {
            toast.success("Silme işlemi başarılı")
            router.refresh();
        })
            .catch((error: any) => {
                console.log(error)
            })
    }, [])

    return (
        <div><Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 }, } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper></div>
    )
}

export default ManageClient