"use client"

import { register } from "module"
import AuthContainer from "../containers/AuthContainer"
import Heading from "../General/Heading"
import Input from "../General/Input"
import Button from "../General/Button"
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { User } from "@prisma/client"
import { useEffect } from "react"
import { Sign } from "crypto"
import React from "react"
interface LoginClientProps {
    currentUser: User | null | undefined

}
const LoginClient: React.FC<LoginClientProps> = ({ currentUser }) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FieldValues>()
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        signIn('credentials', {
            ...data,
            redirect: true,

        }).then((callback) => {
            if (callback?.ok) {
                router.push('/cart');
                router.refresh();
                toast.success("Giriş yapma başarılı!")
                router.refresh();
            }
            if (callback?.error) {
                toast.error(callback.error)
            }
        })
    }
    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();
        }


    }, [])

    return (
        <AuthContainer >
            <div className=" h-screen">
                <div className="w-full md:w-[500px] p-3 shadow-lg rounded-md mt-24">
                <Heading text="Giriş Yap" center={true} />
                <Input placeholder="E-Posta" type="email" id="email" register={register} errors={errors} required />
                <Input placeholder="Parola" type="password" id="password" register={register} errors={errors} required />
                <Button text="Giriş Yap" onClick={handleSubmit(onSubmit)} />
                <div className="text-center text-sm my-2 text-blue-950">
                    Daha önce kayıt olmadıysanız <Link className="underline" href="/register">buraya tıklayınız</Link>
                </div>
                <div className="mb-4 text-center">Ya da</div>
                <Button text="Google ile Giriş Yap" icon={FcGoogle} outline onClick={() => signIn('google')} />
            </div></div>

        </AuthContainer>
    )
}

export default LoginClient