import { Link } from "remix";
import Spacer from "~/components/Spacer";
import ThemeToggler from "~/components/ThemeToggler";
import Illustration from "~/illustration";

export default function Index() {
  return (
    <>
      <div className="relative flex flex-col-reverse">
        <Illustration />
        <div className="absolute top-0 w-full">
          <div className="my-0 mx-auto max-w-screen-lg py-8">
            <header className="relative text-primary">
              <nav className="flex justify-between">
                <div>KTM</div>
                <ul className="flex space-x-12">
                  <li>Posts</li>
                  <li>About</li>
                  <li>
                    <ThemeToggler />
                  </li>
                </ul>
              </nav>
            </header>
          </div>
        </div>
      </div>
      <main className="my-0 mx-auto max-w-screen-lg">
        <Link to="/posts"> Posts</Link>
      </main>
    </>
  );
}
