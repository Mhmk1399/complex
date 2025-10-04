"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function AuthHandler({ children }: Props) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      // 👇 Only show toast on first visit in this session
      const hasShownToast = sessionStorage.getItem("auth_toast_shown");
      let loadingToast: string | null = null;

      if (!hasShownToast) {
        loadingToast = toast.loading("در حال بررسی احراز هویت...");
        sessionStorage.setItem("auth_toast_shown", "true");
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.dismiss(loadingToast || "");
          toast.error("برای ادامه، لطفاً وارد حساب خود شوید.");
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        toast.dismiss(loadingToast || "");

        if (!res.ok || !data?.valid) {
          localStorage.removeItem("token");
          toast.error("توکن منقضی شده یا نامعتبر است. لطفاً دوباره وارد شوید.");
          router.replace("/login");
          return;
        }

        if (!hasShownToast) {
          toast.success("احراز هویت با موفقیت انجام شد");
        }

        setIsVerified(true);
      } catch (error) {
        console.log("Auth verification error:", error);
        toast.dismiss(loadingToast || "");
        if (!hasShownToast) toast.error("خطا در بررسی احراز هویت");
        router.replace("/login");
      }
    };

    verifyToken();
  }, [router]);

  if (isVerified === null) {
    // we skip showing UI since toast is enough feedback
    return null;
  }

  return <>{children}</>;
}
