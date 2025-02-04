"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


//React buttons
import GoogleButton from 'react-google-button'




const providers = [
    { name: "Google", id: "google", Button: GoogleButton },
    // { name: "GitHub", id: "github" },
    // { name: "Facebook", id: "facebook" },
    // { name: "Apple", id: "apple" },
    // { name: "Discord", id: "discord" },
    // { name: "LinkedIn", id: "linkedin" },
    // { name: "Spotify", id: "spotify" },
    // { name: "Twitter", id: "twitter" },
];

//React Toastify
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Assets
import bg from "../../../../public/images/auth_bg.jpg"


//Components
import Loading from "@/app/components/Loading";






export default function SignUp() {

    const { status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, isLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    useEffect(() => {
        if (status === "authenticated") {
            router.push('/');
        }
    }, [status, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        if (password !== passwordConfirm) {
            toast.error(`Passwords don't match!`);
            return;
        }

        if(!emailRegex.test(email)){
            return;
        }

        if(!passwordRegex.test(password)){
            toast.error("Password must have at least 8 characters, a number and a special character");
            return;
        }

        try {

            isLoading(true)

            const reqBody = {
                email: email,
                password: password
            }

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody)
            });

            const data = await res.json();


            if (!res.ok) {
                isLoading(false);
                toast.error(data.error || "An error occurred");
                return;
            }

            else {

                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error(result.error);
                    return;
                }
                    
                router.push('/')
                return;
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            isLoading(false);
        }
    }

    // if (loading) return <Loading />

    return (
        <div className="text-white">
            {loading && <Loading />}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                {...{ transition: Bounce }}
            />
            <div className="relative flex min-h-screen min-w-full justify-center items-center">

                {status === 'unauthenticated' && <div>
                    <Image
                        src={bg}
                        width='0'
                        height='0'
                        sizes="100vw"
                        className="absolute top-0 left-0 w-screen h-full object-cover -z-50 backdrop-blur-lg"
                        alt='Expenses Sign-In'
                    />

                    <div className="absolute top-0 left-0 w-screen h-full bg-black bg-opacity-65 backdrop-blur-xs -z-40">

                    </div>

                    <div className="text-center">
                        <div className="min-w-[30vw] mt-10 bg-cards backdrop-blur-md px-10 py-10 rounded-md border-[2px] border-white border-opacity-5">
                            <h1 className="text-3xl font-bold font-inter uppercase mb-10">Sign Up</h1>

                            <div className="pb-5 flex justify-center">
                                {/* Using react-social-login-buttons */}
                                {providers.map((provider) => (
                                    <provider.Button key={provider.id} onClick={() => signIn(provider.id)}>
                                        Sign in with {provider.name}
                                    </provider.Button>
                                ))}
                            </div>

                            <div className="flex flex-row justify-center gap-2">

                                <p className="border-b mb-3 border-white w-full"></p>

                                <p className="text-xl">or</p>

                                <p className="border-b mb-3 border-white w-full"></p>

                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col py-10">
                                <div className={`border ${(!emailRegex.test(email) && email!=='' )? "border-red-600" : "border-text" }  flex flex-col text-left rounded-md px-2 py-1`}>
                                    <label htmlFor="email" className="text-xs">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-transparent border-none outline-none"
                                    />
                                </div>
                                <div className="mt-2 border border-text flex flex-col text-left rounded-md px-2 py-1">
                                    <label htmlFor="email" className="text-xs">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-transparent border-none outline-none"
                                    />
                                </div>
                                <div className="mt-2 border border-text flex flex-col text-left rounded-md px-2 py-1">
                                    <label htmlFor="email" className="text-xs">Re-enter Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder=""
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        required
                                        className="bg-transparent border-none outline-none"
                                    />
                                </div>
                                <button type="submit" className="mt-5 text-black bg-white hover:bg-blue-600 hover:text-white rounded-sm transition-colors py-2 font-semibold">Create Account</button>
                            </form>

                            <Link href='/auth/signin'>
                                Already have an account? <b>Login</b>
                            </Link>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}