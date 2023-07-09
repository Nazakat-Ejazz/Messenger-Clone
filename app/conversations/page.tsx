"use client";

import clsx from "clsx";

import userConversation from "../hooks/useConversation";

import EmptyState from "../components/EmptyState";

const Home = () => {
  const { isOpen } = userConversation();

  return (
    <div
      className={clsx(
        `
        lg:pl-80 h-full lg:block
    `,
        isOpen ? "block" : "hidden"
      )}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
