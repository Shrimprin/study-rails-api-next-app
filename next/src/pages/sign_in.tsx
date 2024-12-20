import axios, { AxiosResponse, AxiosError } from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useUserState, useSnackbarState } from "@/hooks/useGlobalState";

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useUserState();
  const [, setSnackbar] = useSnackbarState();

  const { handleSubmit, control } = useForm<SignInFormData>({
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
  };
  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    setIsLoading(true);
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/sign_in";
    const headers = { "Content-Type": "application/json" };

    axios({ method: "POST", url: url, data: data, headers: headers })
      .then((res: AxiosResponse) => {
        localStorage.setItem("access-token", res.headers["access-token"]);
        localStorage.setItem("client", res.headers["client"]);
        localStorage.setItem("uid", res.headers["uid"]);
        setUser({
          ...user,
          isFetched: false,
        });
        setSnackbar({
          message: "サインインに成功しました",
          severity: "success",
          pathname: "/",
        });
        router.push("/");
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message);
        setSnackbar({
          message: "登録ユーザーが見つかりません",
          severity: "error",
          pathname: "/sign_in",
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    placeholder="メールアドレス"
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      fieldState.invalid ? "border-red-500" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm`}
                  />
                  {fieldState.invalid && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="password"
                    placeholder="パスワード"
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      fieldState.invalid ? "border-red-500" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-b-md sm:text-sm`}
                  />
                  {fieldState.invalid && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={isLoading}
            >
              {isLoading ? "送信中..." : "送信する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
