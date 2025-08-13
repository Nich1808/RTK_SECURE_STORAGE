//new login with social login
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "../../features/auth/authSlide";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { useState } from "react";

import { useLoginWithGoogle } from "../../components/social-auth/GoogleAuthComponent";
import { useLoginWithFacebook } from "../../components/social-auth/FacebookAuthComponent";
import { useLoginWithGitHub } from "../../components/social-auth/GithubAuthComponent";


import FacebookLogo from '../../assets/social-media/facebook.png';
import GithubLogo from '../../assets/social-media/github.png';
import GoogleLogo from '../../assets/social-media/google.png';

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  // Social login hooks
  const { loginWithGoogle, googleLogout } = useLoginWithGoogle();
  const { loginWithGitHub, gitHubLogout } = useLoginWithGitHub();
  const { loginWithFacebook, facebookLogout } = useLoginWithFacebook();

  const schema = z.object({
    email: z.string().nonempty("Email is required").email(),
    password: z.string().nonempty("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      if (result !== undefined) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
      console.log("ERROR:", error?.data?.message);
    } finally {
      reset();
    }
  };

  return (
    <section className="min-h-screen bg-teal-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-10 border border-teal-100">
        <h1 className="text-4xl font-extrabold text-center text-teal-600 mb-8 tracking-tight">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <input
              {...register("email")}
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-sm text-gray-900 bg-white/80 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 text-sm text-gray-900 bg-white/80 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-gray-400"
            />
            <div
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="absolute top-3.5 right-4 text-gray-500 cursor-pointer select-none"
            >
              {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>


          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-200 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <ToastContainer />

        {/* Social Login Section */}
        <div className="mt-8 text-center">
          <p className="mb-4 font-semibold">Or Login With</p>
          <div className="flex gap-6 justify-center">
            <button onClick={loginWithGoogle} aria-label="Login with Google" className="hover:scale-110 transition-transform">
              <img src={GoogleLogo} alt="google provider" width={35} height={35} />
            </button>
            <button onClick={loginWithFacebook} aria-label="Login with Facebook" className="hover:scale-110 transition-transform">
              <img src={FacebookLogo} alt="facebook provider" width={30} height={30} />
            </button>
            <button onClick={loginWithGitHub} aria-label="Login with GitHub" className="hover:scale-110 transition-transform">
              <img src={GithubLogo} alt="github provider" width={30} height={30} />
            </button>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={googleLogout}
              className="px-5 py-7 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition h-10 flex items-center justify-center"
            >
              Google Logout
            </button>
            <button
              onClick={facebookLogout}
              className="px-5 py-7 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition h-10 flex items-center justify-center"
            >
              Facebook Logout
            </button>
            <button
              onClick={gitHubLogout}
              className="px-5 py-7 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition h-10 flex items-center justify-center"
            >
              Github Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
