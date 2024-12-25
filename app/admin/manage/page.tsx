import { getCurrentUser } from '@/app/actions/getCurrentUser'
import React from 'react'
import getProducts from '@/app/actions/getProducts'
import CreateForm from '@/app/components/admin/CreateForm'
import ManageClient from '@/app/components/admin/ManageClient'
import AuthContainer from '@/app/components/containers/AuthContainer'
import WarningText from '@/app/components/warningText'

const Manage = async () => {
    const products = await getProducts({ category: null });
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN")
        return (
            <WarningText text='Bu sayfaya erişilemez' />
        )
    return (
        <div className='w-full m-2'>
            <ManageClient products={products} />
        </div>
    )
}

export default Manage