import { type JSX } from "react";
import { FaGithub } from "react-icons/fa";

const Footer = (): JSX.Element => {
  return (
    <footer className="h-[4rem] flex justify-center items-center bg-[#ffebc5]">
      <a
        href="https://github.com/dpclfk/LostarkMarketLog"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-base hover:underline"
      >
        <FaGithub size={20} />
        GitHub
      </a>
    </footer>
  );
};

export default Footer;
