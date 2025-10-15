"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function TokenHandler({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processToken = async () => {
      const urlToken = searchParams.get("token");
      const localStorageToken = localStorage.getItem("token");
      
      // If no tokens at all, redirect to dashboard
      if (!urlToken && !localStorageToken) {
        setIsProcessing(false);
        router.push("https://dashboard.tomakdigitalagency.ir/");
        return;
      }

      // If only localStorage token exists (page reload case), just proceed
      if (!urlToken && localStorageToken) {
        setIsProcessing(false);
        return;
      }

      // If URL token exists, verify it
      if (urlToken) {
        try {
          const res = await fetch("/api/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: urlToken }),
          });

          const data = await res.json();
          
          if (res.ok && data?.valid) {
            localStorage.setItem("token", urlToken);
            toast.success("ورود موفقیتآمیز");
            
            // Clean URL by removing token parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, "", url.toString());
          } else {
            toast.error("توکن نامعتبر است");
            localStorage.removeItem("token");
            router.push("https://dashboard.tomakdigitalagency.ir/");
            return;
          }
        } catch (error) {
          console.error("Token processing error:", error);
          toast.error("خطا در پردازش توکن");
          localStorage.removeItem("token");
          router.push("https://dashboard.tomakdigitalagency.ir/");
          return;
        }
      }

      setIsProcessing(false);
    };

    processToken();
  }, [searchParams, router]);

  if (isProcessing) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}