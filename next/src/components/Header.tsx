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
              {user.isSignedIn && <p>{user.name}</p>}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
