'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignout } from "../../lib/hooks/auth";
import { UserContext } from "../../lib/context/user";

const SignOutPage = () => {
  const {setUser} = useContext(UserContext);
  const router = useRouter();
  const {request} = useSignout();
  const doRequest = async () => {
    await request();
    setUser(null);
    router.push('/');
  }

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signin you out...</div>;
}

export default SignOutPage;