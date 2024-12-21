import camelcaseKeys from "camelcase-keys";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import MarkdownText from "@/components/MarkdownText";
import { useUserState } from "@/hooks/useGlobalState";
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn";
import { fetcher } from "@/utils";

type CurrentArticleProps = {
  title: string;
  content: string;
  createdAt: string;
  status: string;
};

const CurrentArticleDetail: NextPage = () => {
  useRequireSignedIn();
  const [user] = useUserState();
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/articles/";
  const { id } = router.query;

  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  );
  if (error) return <Error />;
  if (!data) return <Loading />;

  const article: CurrentArticleProps = camelcaseKeys(data);

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="block lg:hidden bg-white border-t border-gray-300 h-14 text-gray-600">
        <div className="max-w-sm mx-auto flex justify-around items-center h-full">
          <div className="flex gap-2">
            <p className="mr-1 text-sm sm:text-base">
              ステータス: {article.status}
            </p>
          </div>
          <div className="flex gap-2">
            <p className="mr-1 text-sm sm:text-base">
              公開: {article.createdAt}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 pb-3">
          <div className="flex items-center gap-2 mx-auto">
            <div className="w-10 h-10">
              <Link href={"/current/articles"}>
                <p className="rounded-full cursor-pointer">戻る </p>
              </Link>
            </div>
            <div className="text-center w-full">
              <h2 className="text-lg sm:text-xl font-bold leading-10">
                {article.title}
              </h2>
            </div>
          </div>
          <p className="block lg:hidden text-center text-gray-600 mt-5">
            {article.createdAt}に公開
          </p>
        </div>
        <div className="flex gap-6">
          <div className="w-full">
            <div className="shadow-none rounded-lg max-w-2xl mx-auto">
              <div className="px-6 sm:px-10 mt-6 sm:mt-10">
                <MarkdownText content={article.content} />
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-72 min-w-72">
            <div className="shadow-none rounded-lg">
              <ul className="text-gray-600">
                <li className="border-b border-gray-300">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <span>ステータス</span>
                    </div>
                    <span>{article.status}</span>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <span>公開</span>
                    </div>
                    <span>{article.createdAt}</span>
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

export default CurrentArticleDetail;
