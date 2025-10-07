"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function TokenHandler({ children }: Props) {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processUrlToken = async () => {
      const urlToken = searchParams.get("token");
      
      // If no URL token, just proceed (existing token flow will handle)
      if (!urlToken) {
        setIsProcessing(false);
        return;
      }

      try {
        // Verify the URL token
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: urlToken }),
        });

        const data = await res.json();

        if (res.ok && data?.valid) {
          // Store valid token in localStorage
          localStorage.setItem("token", urlToken);
          toast.success("ورود موفقیت‌آمیز");
          
          // Clean URL by removing token parameter
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.toString());
        } else {
          // Invalid token - redirect back to dashboard
          toast.error("توکن نامعتبر است");
          const redirectUrl = process.env.NODE_ENV === "development" 
            ? "http://localhost:3000" 
            : "https://dashboard.tomakdigitalagency.ir";
          window.location.href = redirectUrl;
          return;
        }
      } catch (error) {
        console.error("Token processing error:", error);
        toast.error("خطا در پردازش توکن");
        const redirectUrl = process.env.NODE_ENV === "development" 
          ? "http://localhost:3000" 
          : "https://dashboard.tomakdigitalagency.ir";
        window.location.href = redirectUrl;
        return;
      }

      setIsProcessing(false);
    };

    processUrlToken();
  }, [searchParams]);

  if (isProcessing) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}