"use client";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useEffect } from "react";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo?.design?.backgroundColor) {
      document.body.style.backgroundColor = userInfo.design.backgroundColor;
    }
  }, [userInfo?.design?.backgroundColor]);

  return <>{children}</>;
}
