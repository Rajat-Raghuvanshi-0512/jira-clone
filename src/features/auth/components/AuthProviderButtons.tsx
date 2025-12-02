import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export const AuthProviderButtons = () => {
  return (
    <>
      <Button variant="secondary" className="w-full" size="lg">
        <FcGoogle className="size-5 mr-2" />
        Login with Google
      </Button>
      <Button variant="secondary" className="w-full" size="lg">
        <FaGithub className="size-5 mr-2" />
        Login with GitHub
      </Button>
    </>
  );
};
