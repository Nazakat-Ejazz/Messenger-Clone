"use client";
import Input from "../../components/input/Input";
import Button from "../../components/Button";
import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      // AXios call for register
      const res = await axios
        .post("/api/register", data)
        .catch(() =>
          toast.error("Something went wrong!", {
            position: "top-right",
            duration: 4000,
          })
        )
        .finally(() => setIsLoading(false));

      if (res) {
        toast.success("Success! New user created", {
          position: "top-right",
          duration: 4000,
        });
        signIn("credentials", data);
      }
    }
    if (variant === "LOGIN") {
      // nextAuth login
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error(callback.error);
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Success ! User logged in successfully.", {
              position: "top-right",
              duration: 4000,
            });
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    // NextAuth Social Sign in
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Error : Login failed", {
            position: "top-right",
            duration: 4000,
          });
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Success: User logged in successfully", {
            position: "top-right",
            duration: 4000,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-4 h-full sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white h-full px-4 py-5 shadow sm:rounded-lg sm:px-10 ">
        <h2 className="mt-2 mb-4 text-center text-2xl font-bold tracing-tight text-gray-900">
          {variant === "LOGIN"
            ? "Sign in to your account!"
            : "Register a New User !"}
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              disabled={isLoading}
              errors={errors}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            disabled={isLoading}
            errors={errors}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {variant === "LOGIN" ? "Login" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {/* AuthSocial Buttons */}
            <AuthSocialButton
              icon={BsGoogle}
              type="google"
              onClick={() => socialAction("google")}
            />
            <AuthSocialButton
              icon={BsGithub}
              type="github"
              onClick={() => socialAction("github")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-4 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger ? "
              : "Already have an account ? "}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
