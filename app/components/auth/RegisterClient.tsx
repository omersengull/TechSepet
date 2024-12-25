"use client"

import { register } from "module"
import AuthContainer from "../containers/AuthContainer"
import Heading from "../General/Heading"
import Input from "../General/Input"
import Button from "../General/Button"
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { useEffect } from "react"
import React from "react"
interface RegisterClientProps {
    currentUser: User | null | undefined

}
const RegisterClient: React.FC<RegisterClientProps> = ({ currentUser }) => {

    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FieldValues>()
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        axios.post('/api/register', data).then(() => {
            toast.success("Kullanıcı Oluşturuldu!");
            signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,

            }).then((callback) => {
                if (callback?.ok) {
                    router.push('/cart');
                    router.refresh();
                    toast.success("Giriş yapma başarılı!")
                }
                if (callback?.error) {
                    toast.error(callback.error)
                }
            })
        })
    }
    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();
        }


    }, [])
    return (
        <AuthContainer>
            <div className="h-screen">
            <div className="w-full px-4 py-2 md:w-[500px] shadow-lg rounded-md mt-24">
                <Heading text="Kayıt Ol" center={true} />
                <Input placeholder="Ad" type="text" id="name" register={register} errors={errors} required />
                {errors.name && <p className="text-red-500 text-xs mt-1">Ad alanı zorunludur.</p>}
                <Input placeholder="Soyad" type="text" id="surname" register={register} errors={errors} required />
                {errors.name && <p className="text-red-500 text-xs mt-1">Soyad alanı zorunludur.</p>}
                <Input placeholder="E-Posta" type="email" id="email" register={register} errors={errors} required />
                {errors.name && <p className="text-red-500 text-xs mt-1">E-mail alanı zorunludur.</p>}
                <Input placeholder="Parola" type="password" id="password" register={register} errors={errors} required />
                {errors.name && <p className="text-red-500 text-xs mt-1">Şifre alanı zorunludur.</p>}
                <div className="mt-2"><Button text="Kayıt Ol" onClick={handleSubmit(onSubmit)} /></div>
                <div className="text-center text-sm my-2 text-blue-950">
                    Daha önce kayıt olduysanız <Link className="underline" href="/login">buraya tıklayınız</Link>
                </div>
                <div className="text-center mb-4">Ya Da</div>
                <Button text="Google ile kayıt ol" icon={FcGoogle} outline onClick={() => signIn('google')} />
            </div>
            </div>
        </AuthContainer>
    )
}

export default RegisterClient