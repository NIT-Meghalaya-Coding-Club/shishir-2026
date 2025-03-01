"use client";

// Images

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Context
import { useOrganizer } from "@/context/OrganizerContext";
import Loading from "../../components/Loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { loginOrganizer } = useOrganizer();

  useEffect(() => {
    // To verify admin jwt token using cookies
    const verifyUser = async () => {
      try {
        const res = await fetch("/api/organizer/auth/verify", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          loginOrganizer(data.organizer);
          router.push("/organizer/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to verify token", error);
        setLoading(false);
      }
    };
    verifyUser();
  }, [router, loginOrganizer]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    // console.log(email, password)
    try {
      const res = await fetch("/api/organizer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        loginOrganizer(data.organizer);
        // router.push('/organizer');
        verifyUser();
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="bg-gradient-to-b from-blue-950 via-blue-950 to-black z-50 fixed left-0 top-0 h-screen w-screen overflow-hidden">
      <div className="flex flex-col items-center lg:justify-center px-6 py-8 mx-auto h-[92svh] lg:py-0">
        <div className="mb-8 sm:mb-16 flex w-full items-center justify-center text-center">
          <h1 className="relative text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[12vw] font-extrabold uppercase tracking-tight">
            <span className="absolute -inset-2 blur-3xl">
              <span className="bg-gradient-to-r from-amber-400/20 via-amber-500/20 to-amber-600/20 bg-clip-text text-transparent">
                SHISHIR 2K25
              </span>
            </span>
            <span className="relative bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              SHISHIR 2K25
            </span>
          </h1>
        </div>
        <div className="w-full bg-white/5 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1e1e1e]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className=" text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              ADMIN LOGIN
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Event
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-black/0 w-full text-white border-b border-white/50 py-2  rounded-none outline-none"
                  placeholder=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-black/0 w-full text-white border-b border-white/50 py-2  rounded-none outline-none"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-yellow-50 dark:bg-amber-500 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
