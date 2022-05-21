import { Link } from "@remix-run/react";
import Logo from "./Logo";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  return (
    <header className="hidden md:my-0 md:mx-auto md:block md:w-full md:max-w-screen-lg md:px-8 md:py-8">
      <div className="relative text-primary">
        <nav className="flex justify-between">
          <Logo />
          <ul className="flex space-x-12">
            <Link to="/posts">Posts</Link>
            <Link to="/about">About</Link>
            <Link to="/snippets">Snippets</Link>
            <li>
              <ThemeToggler />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
