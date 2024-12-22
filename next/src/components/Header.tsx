import axios, { AxiosResponse, AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUserState } from "@/hooks/useGlobalState";

const Header = () => {
  const [user] = useUserState();
  const router = useRouter();

  const hideHeaderPathnames = ["/current/articles/edit/[id]"];
  if (hideHeaderPathnames.includes(router.pathname)) return <></>;

  const addNewArticle = () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/articles";

    const headers = {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      client: localStorage.getItem("client"),
      uid: localStorage.getItem("uid"),
    };

    axios({ method: "POST", url: url, headers: headers })
      .then((res: AxiosResponse) => {
        router.push("/current/articles/edit/" + res.data.id);
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message);
      });
  };

  return (
    <header className="bg-white text-black py-3 shadow-none">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <Image src="/logo.png" width={133} height={40} alt="logo" />
            </Link>
          </div>
          {user.isFetched && (
            <>
              {!user.isSignedIn && (
                <div>
                  <Link href="/sign_in">
                    <button className="bg-blue-500 text-white text-lg rounded-md shadow-none px-4 py-2">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/sign_up">
                    <button className="border border-blue-500 text-lg rounded-md shadow-none px-4 py-2 ml-2">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
              {user.isSignedIn && (
                <div>
                  <p>{user.name}</p>
                  <Link href="/current/articles">
                    <button className="bg-blue-500 text-white text-lg rounded-md shadow-none px-4 py-2 mr-2">
                      記事の管理
                    </button>
                  </Link>
                  <button
                    className="bg-green-500 text-white text-lg rounded-md shadow-none px-4 py-2 mr-2"
                    onClick={addNewArticle}
                  >
                    記事を作成する
                  </button>
                  <Link href="/sign_out">
                    <button className="bg-red-500 text-white text-lg rounded-md shadow-none px-4 py-2">
                      Sign out
                    </button>
                  </Link>
                </div>
              )}{" "}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
