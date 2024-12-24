import React from 'react'
import RegisterClient from '../components/auth/RegisterClient'
import { getCurrentUser } from '../actions/getCurrentUser';

const page = async () => {
    const currentUser = await getCurrentUser();
    return (
        <div><RegisterClient currentUser={currentUser} /></div>
    )
}

export default page