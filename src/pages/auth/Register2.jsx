import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFileMutation } from "../../features/file/fileSlice";
import { useRegisterMutation } from "../../features/auth/authSlide";
import { useNavigate } from "react-router";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().nonempty("Password is required").min(4, "Must be greater than 4"),
});

export default function Register2() {
  const [uploadFile] = useUploadFileMutation();
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: "",
    },
  });

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", image);
    const res = await uploadFile(formData).unwrap();

    const submitData = {
      ...data,
      avatar: res.location,
    };

    const result = await registerUser(submitData).unwrap();
    if (result) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-teal-100 flex items-center justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="backdrop-blur-md bg-white/70 shadow-xl rounded-3xl p-10 w-full max-w-lg border border-teal-100"
      >
        <h2 className="text-4xl font-extrabold text-center text-teal-600 mb-8 tracking-tight">
          Create Your Account
        </h2>

        <div className="flex justify-center mb-8">
          <label htmlFor="dropzone-file" className="cursor-pointer group">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 flex flex-col items-center justify-center rounded-full border-4 border-dashed border-teal-400 text-gray-400 bg-white/60 group-hover:bg-white/80 transition">
                <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm">Upload</p>
              </div>
            )}
            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              id="dropzone-file"
              className="hidden"
              onChange={handleImagePreview}
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-6">
          <input
            type="text"
            id="name"
            {...register("name")}
            className="w-full px-4 py-3 text-sm text-gray-900 bg-white/80 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-gray-400"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-6">
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full px-4 py-3 text-sm text-gray-900 bg-white/80 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-gray-400"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <input
            type={isShowPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            className="w-full px-4 py-3 pr-12 text-sm text-gray-900 bg-white/80 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-gray-400"
            placeholder="Enter your password"
          />
          <div
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute top-3.5 right-4 text-gray-500 cursor-pointer"
          >
            {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-200 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}


