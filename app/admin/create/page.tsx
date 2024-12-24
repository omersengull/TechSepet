"use client";
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import CreateForm from '@/app/components/admin/CreateForm';
import AuthContainer from '@/app/components/containers/AuthContainer';
import WarningText from '@/app/components/warningText';
import { HashLoader } from 'react-spinners';

const CreateProduct = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                console.log("Fetched User:", user); // Kullanıcı bilgisini logla
                if (!user || user.role !== "ADMIN") {
                    setError('Bu sayfaya erişilemez');
                } else {
                    setCurrentUser(user);
                }
            } catch (err) {
                setError('Bir hata oluştu, lütfen tekrar deneyin.');
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    if (error) {
        return <WarningText text={error} />;
    }

    if (!currentUser) {
        return (<div className="relative h-screen w-full flex justify-center items-center bg-white bg-opacity-70 backdrop-blur-sm">
            <HashLoader />
        </div>);
    }

    return (
        <AuthContainer>
            <CreateForm />
        </AuthContainer>
    );
};

export default CreateProduct;
