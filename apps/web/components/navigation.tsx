import Link from "next/link";
import {useRouter} from "next/router";

const Navigation = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full">
      <div className="flex justify-center p-4 space-x-4 text-sm text-gray-500">
        <Link href="/">
          <a className={router.pathname == "/" ? "text-gray-900" : ""}>Home</a>
        </Link>
        <Link href="/realtime">
          <a className={router.pathname == "/realtime" ? "text-gray-900" : ""}>
            Realtime
          </a>
        </Link>
        <Link href="/account/profile-ssg">
          <a
            className={
              router.pathname == "/account/profile-ssg" ? "text-gray-900" : ""
            }
          >
            Profile SSG
          </a>
        </Link>
        <Link href="/account/profile-ssr">
          <a
            className={
              router.pathname == "/account/profile-ssr" ? "text-gray-900" : ""
            }
          >
            Profile SSR
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
