import { useState } from "react";
import { HamburgerIcon } from "~/illustration/hamburger";
import { X } from "react-feather";
import Modal from "react-modal";
import ThemeToggler from "./ThemeToggler";
import { Link } from "remix";
import Spacer from "../Spacer";

const customStyles = {
  content: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
};

// Modal.setAppElement("#root");

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  console.log("open", open);
  return (
    <>
      <button
        className="absolute top-6 right-4 z-10 md:hidden"
        onClick={() => setOpen(true)}
      >
        {!open && <HamburgerIcon />}
      </button>
      <Modal
        id="modal"
        isOpen={open}
        contentLabel="Example Modal"
        className="top-0 left-0 h-full w-full bg-main-bg p-4 text-primary"
      >
        <button
          className="absolute top-6 right-4 z-10 md:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={32} />
        </button>
        <div className="text-xl">
          <Spacer height={12} />
          <div>KTM</div>
          <Spacer height={64} />
          <ul>
            <li className="py-4">
              <Link to="/">Home</Link>
            </li>
            <li className="py-4">
              <Link to="/posts">Posts</Link>
            </li>
            <li className="py-4">
              <Link to="/about">About</Link>
            </li>
          </ul>
          <Spacer height={64} />
          <ThemeToggler />
        </div>
      </Modal>
    </>
  );
}
