import camelcaseKeys from "camelcase-keys";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import ArticleCard from "@/components/ArticleCard";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { fetcher } from "@/utils";

type ArticleProps = {
  id: number;
  title: string;
  createdAt: string;
  fromToday: string;
  user: {
    name: string;
  };
};

const Index: NextPage = () => {
  const router = useRouter();
  const page = "page" in router.query ? Number(router.query.page) : 1;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/articles/?page=" + page;

  const { data, error } = useSWR(url, fetcher);
  if (error) return <Error />;
  if (!data) return <Loading />;

  const articles = camelcaseKeys(data.articles);
  const meta = camelcaseKeys(data.meta);

  const handleChange = (value: number) => {
    router.push("/?page=" + value);
  };

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="max-w-2xl mx-auto pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4">
          {articles.map((article: ArticleProps, i: number) => (
            <div key={i} className="col-span-1">
              <Link href={"/articles/" + article.id}>
                <ArticleCard
                  title={article.title}
                  fromToday={article.fromToday}
                  userName={article.user.name}
                />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center py-6 space-x-4">
          <button
            className="text-gray-600 hover:text-black"
            onClick={() => handleChange(meta.currentPage - 1)}
            disabled={meta.currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full ${
                meta.currentPage === i + 1
                  ? "bg-gray-300 text-black"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => handleChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="text-gray-600 hover:text-black"
            onClick={() => handleChange(meta.currentPage + 1)}
            disabled={meta.currentPage === meta.totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
