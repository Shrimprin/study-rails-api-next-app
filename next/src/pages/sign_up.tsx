import axios, { AxiosResponse, AxiosError } from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbarState } from "@/hooks/useGlobalState";

type SignUpFormData = {
  email: string;
  password: string;
  name: string;
};

const SignUp: NextPage = () => {
  const router = useRouter();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: { email: "", password: "" },
  });

  const validationRules = {
    email: {
      required: "メールアドレスを入力してください。",
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: "正しい形式のメールアドレスを入力してください。",
      },
    },
    password: {
      required: "パスワードを入力してください。",
    },
    name: {
      required: "ユーザー名を入力してください。",
    },
  };

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    const SignUp = async (data: SignUpFormData) => {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth";
      const headers = { "Content-Type": "application/json" };
      const confirmSuccessUrl =
        process.env.NEXT_PUBLIC_FRONT_BASE_URL + "/sign_in";

      await axios({
        method: "POST",
        url: url,
        data: { ...data, confirm_success_url: confirmSuccessUrl },
        headers: headers,
      })
        .then((res: AxiosResponse) => {
          localStorage.setItem(
            "access-token",
            res.headers["access-token"] || "",
          );
          localStorage.setItem("client", res.headers["client"] || "");
          localStorage.setItem("uid", res.headers["uid"] || "");
          setSnackbar({
            message: "認証メールをご確認ください",
            severity: "success",
            pathname: "/",
          });
          router.push("/");
        })
        .catch((e: AxiosError<{ error: string }>) => {
          console.log(e.message);
          setSnackbar({
            message: "不正なユーザー情報です",
            severity: "error",
            pathname: "/sign_up",
          });
          setIsLoading(false);
        });
    };
    SignUp(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto py-8">
        <h2 className="text-3xl font-bold text-black mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              {...control.register("email", validationRules.email)}
              type="text"
              className={`mt-1 block w-full p-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              {...control.register("password", validationRules.password)}
              type="password"
              className={`mt-1 block w-full p-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ユーザー名
            </label>
            <input
              {...control.register("name", validationRules.name)}
              type="text"
              className={`mt-1 block w-full p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 font-bold text-white rounded ${isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={isLoading}
          >
            送信する
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
