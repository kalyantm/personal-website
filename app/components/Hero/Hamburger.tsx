import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "react-feather";
import Modal from "react-modal";
import ThemeToggler from "./ThemeToggler";
import { Link } from "@remix-run/react";
import Spacer from "../Spacer";
import HamburgerIcon from "./HamburgerIcon";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Posts", to: "/posts" },
  { label: "About", to: "/about" },
  // { label: "Snippets", to: "/snippets" },
];

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HamburgerIcon isOpen={open} onClick={() => setOpen(!open)} />
      <AnimatePresence>
        <Modal
          id="modal"
          isOpen={open}
          contentLabel="Example Modal"
          className="top-0 left-0 h-full w-full bg-main-bg p-4 text-xl text-primary"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spacer height={16} />
            <Logo />
            <Spacer height={64} />
            <motion.ul
              initial={{ x: "-100vw" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            >
              {NAV_LINKS.map((link, i) => (
                <li key={i} className="py-4">
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </motion.ul>
            <Spacer height={64} />
            <ThemeToggler isMobile={true} />
          </motion.div>
        </Modal>
      </AnimatePresence>
    </>
  );
}
