import Image from "next/image";
import Link from "next/link";
import { useUserState } from "@/hooks/useGlobalState";

const Header = () => {
  const [user] = useUserState();

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
                  <button className="border border-blue-500 text-lg rounded-md shadow-none px-4 py-2 ml-2">
                    Sign Up
                  </button>
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
                  <button className="bg-green-500 text-white text-lg rounded-md shadow-none px-4 py-2 mr-2">
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
