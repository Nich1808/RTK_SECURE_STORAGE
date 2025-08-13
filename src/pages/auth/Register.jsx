import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";

const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // name: "",
      // email: "",
      // password: "",
      // confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Register Data:", data);
    reset();
  };

  return (
    <section className="bg-teal-600 w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
          Register
        </h2>

        {/* Name Field */}
        <div className="mb-4">
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4 relative">
          <input
            {...register("password")}
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setIsShowPassword((prev) => !prev)}
          >
            {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Register
        </button>
      </form>
    </section>
  );
}
