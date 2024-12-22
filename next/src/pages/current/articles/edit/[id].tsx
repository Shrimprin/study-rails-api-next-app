import axios, { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import MarkdownText from "@/components/MarkdownText";
import { useUserState, useSnackbarState } from "@/hooks/useGlobalState";
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn";
import { fetcher } from "@/utils";

type ArticleProps = {
  title: string;
  content: string;
  status: string;
};

type ArticleFormData = {
  title: string;
  content: string;
};

const CurrentArticlesEdit: NextPage = () => {
  useRequireSignedIn();
  const router = useRouter();
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [previewChecked, setPreviewChecked] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePreviewChecked = () => {
    setPreviewChecked(!previewChecked);
  };

  const handleChangeStatusChecked = () => {
    setStatusChecked(!statusChecked);
  };

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/articles/";
  const { id } = router.query;
  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  );

  const article: ArticleProps = useMemo(() => {
    if (!data) {
      return {
        title: "",
        content: "",
        status: false,
      };
    }
    return {
      title: data.title == null ? "" : data.title,
      content: data.content == null ? "" : data.content,
      status: data.status,
    };
  }, [data]);

  const { handleSubmit, control, reset, watch } = useForm<ArticleFormData>({
    defaultValues: article,
  });

  useEffect(() => {
    if (data) {
      reset(article);
      setStatusChecked(article.status == "公開中");
      setIsFetched(true);
    }
  }, [data, article, reset]);

  const onSubmit: SubmitHandler<ArticleFormData> = (data) => {
    if (data.title == "") {
      return setSnackbar({
        message: "記事の保存にはタイトルが必要です",
        severity: "error",
        pathname: "/current/articles/edit/[id]",
      });
    }

    if (statusChecked && data.content == "") {
      return setSnackbar({
        message: "本文なしの記事は公開はできません",
        severity: "error",
        pathname: "/current/articles/edit/[id]",
      });
    }

    setIsLoading(true);

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/current/articles/" + id;

    const headers = {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      client: localStorage.getItem("client"),
      uid: localStorage.getItem("uid"),
    };

    const status = statusChecked ? "published" : "draft";

    const patchData = { ...data, status: status };

    axios({
      method: "PATCH",
      url: patchUrl,
      data: patchData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: "記事を保存しました",
          severity: "success",
          pathname: "/current/articles/edit/[id]",
        });
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message);
        setSnackbar({
          message: "記事の保存に失敗しました",
          severity: "error",
          pathname: "/current/articles/edit/[id]",
        });
      });
    setIsLoading(false);
  };

  if (error) return <Error />;
  if (!data || !isFetched) return <Loading />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-100 min-h-screen"
    >
      <div className="fixed w-full bg-gray-100">
        <div className="flex justify-between items-center p-4">
          <div className="w-12">
            <Link href="/current/articles">
              <button className="p-2">戻る </button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <input
                type="checkbox"
                checked={previewChecked}
                onChange={handleChangePreviewChecked}
                className="mr-2"
              />
              <label>プレビュー</label>
            </div>
            <div className="text-center">
              <input
                type="checkbox"
                checked={statusChecked}
                onChange={handleChangeStatusChecked}
                className="mr-2"
              />
              <span className="text-sm sm:text-base">下書き／公開</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              {isLoading ? "更新中..." : "更新する"}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-28 pb-12 flex justify-center">
        {!previewChecked && (
          <div className="w-full max-w-2xl">
            <div className="mb-4">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Write in Title"
                    className={`w-full p-2 border ${fieldState.invalid ? "border-red-500" : "border-gray-300"} rounded`}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <textarea
                    {...field}
                    placeholder="Write in Markdown Text"
                    rows={25}
                    className={`w-full p-2 border ${fieldState.invalid ? "border-red-500" : "border-gray-300"} rounded`}
                  />
                )}
              />
            </div>
          </div>
        )}
        {previewChecked && (
          <div className="w-full max-w-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-center pt-2 pb-4">
              {watch("title")}
            </h2>
            <div className="shadow-none rounded-lg">
              <div className="px-6 sm:px-10 mt-6 sm:mt-10">
                <MarkdownText content={watch("content")} />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default CurrentArticlesEdit;
