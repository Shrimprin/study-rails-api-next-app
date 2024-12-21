import camelcaseKeys from "camelcase-keys";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { useUserState } from "@/hooks/useGlobalState";
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn";
import { fetcher } from "@/utils";

type ArticleProps = {
  id: number;
  title: string;
  status: string;
};

const CurrentArticles: NextPage = () => {
  useRequireSignedIn();
  const [user] = useUserState();

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/articles";
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher);

  if (error) return <Error />;
  if (!data) return <Loading />;

  const articles: ArticleProps[] = camelcaseKeys(data);

  return (
    <div className="min-h-screen border-t border-gray-300 pb-8">
      <div className="max-w-md mx-auto pt-6 px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">記事の管理</h2>
        </div>

        {articles.map((article: ArticleProps, i: number) => (
          <div key={i}>
            <div className="flex justify-between items-center min-h-20">
              <div className="pr-3">
                <h3 className="text-lg font-bold text-black">
                  {article.title}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                {article.status === "下書き" && (
                  <div className="inline text-xs text-center border border-gray-400 p-1 rounded text-gray-400 font-bold">
                    {article.status}
                  </div>
                )}
                {article.status === "公開中" && (
                  <div className="inline text-xs text-center border border-blue-500 p-1 rounded text-blue-500 font-bold">
                    {article.status}
                  </div>
                )}
                <div className="flex space-x-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <button title="編集する" className="text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                      </svg>
                    </button>
                  </div>
                  <Link href={"/current/articles/" + article.id}>
                    <div className="bg-gray-100 p-2 rounded-full">
                      <button title="表示を確認" className="text-gray-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 4.5C7.305 4.5 3.135 7.11 1 12c2.135 4.89 6.305 7.5 11 7.5s8.865-2.61 11-7.5c-2.135-4.89-6.305-7.5-11-7.5zm0 13c-3.59 0-6.5-2.91-6.5-6.5S8.41 4.5 12 4.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentArticles;
