import { IconArticle, IconUser, IconRefresh } from "@tabler/icons-react";
import camelcaseKeys from "camelcase-keys";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import MarkdownText from "@/components/MarkdownText";
import { fetcher } from "@/utils";

type ArticleProps = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
};

const ArticleDetail: NextPage = () => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/articles/";
  const { id } = router.query;

  const { data, error } = useSWR(id ? url + id : null, fetcher);
  if (error) return <Error />;
  if (!data) return <Loading />;

  const article: ArticleProps = camelcaseKeys(data);

  return (
    <div className="bg-gray-100 pb-6 min-h-screen">
      <div className="flex lg:hidden items-center bg-white border-t border-gray-300 h-14 pl-4 text-gray-600">
        <div className="pr-1">
          <IconUser />
        </div>
        <div className="mr-2">
          <p>著者:</p>
        </div>
        <p className="font-bold text-black">{article.user.name}</p>
      </div>
      <div className="container mx-auto max-w-screen-lg">
        <div className="pt-6 pb-3">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold">{article.title}</h2>
          </div>
          <p className="block lg:hidden text-center text-gray-600 mt-5">
            {article.createdAt}に公開
          </p>
        </div>
        <div className="flex gap-6">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto p-6">
              <MarkdownText content={article.content} />
            </div>
          </div>
          <div className="hidden lg:block w-72 min-w-72">
            <div className="shadow-none rounded-lg">
              <ul className="text-gray-600">
                <li className="border-b border-gray-300">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <div className="pr-1">
                        <IconUser />
                      </div>
                      <span>著者</span>
                    </div>
                    <span>{article.user.name}</span>
                  </div>
                </li>
                <li className="border-b border-gray-300">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <div className="pr-1">
                        <IconArticle />
                      </div>
                      <span>公開</span>
                    </div>
                    <span>{article.createdAt}</span>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <div className="pr-1">
                        <IconRefresh />
                      </div>
                      <span>本文更新</span>
                    </div>
                    <span>{article.updatedAt}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
