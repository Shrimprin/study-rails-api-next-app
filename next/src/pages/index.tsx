import camelcaseKeys from "camelcase-keys";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import ArticleCard from "@/components/ArticleCard";
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
  const url = "http://localhost:3000/api/v1/articles";

  const { data, error } = useSWR(url, fetcher);
  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Loading />;

  const articles = camelcaseKeys(data.articles);

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
      </div>
    </div>
  );
};

export default Index;
