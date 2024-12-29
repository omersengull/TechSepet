import React from 'react';
import LoginClient from '../components/auth/LoginClient';
import { getCurrentUser } from '../actions/getCurrentUser';

export const dynamic = "force-dynamic";

export default async function Page() {
    const currentUser = await getCurrentUser();

    // Kullanıcı verisini LoginClient ile uyumlu hale getirin
    const transformedUser = currentUser
        ? {
            ...currentUser,
            hashedPassword: currentUser.hashedPassword, // Eksik alan için varsayılan değer
            createdAt: new Date(currentUser.createdAt), // string => Date dönüşümü
            updatedAt: new Date(currentUser.updatedAt), // string => Date dönüşümü
            emailVerified: currentUser.emailVerified ? new Date(currentUser.emailVerified) : null, // string | null => Date | null dönüşümü
        }
        : null;

    return (
        <div>
            <LoginClient currentUser={transformedUser} />
        </div>
    );
}
