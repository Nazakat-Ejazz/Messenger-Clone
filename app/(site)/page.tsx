import Image from "next/image";

import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto h-full min-h-full sm:w-full  sm:max-w-md">
        <Image
          alt="logo"
          height="64"
          width="64"
          className="mx-auto w-auto"
          src="/images/logo.png"
        />
      </div>
      {/* Auth Form */}
      <AuthForm />
    </div>
  );
}
