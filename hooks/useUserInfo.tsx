"use client";
import useSWR from "swr";

interface UserInfo {
  _id: string;
  storeId: string;
  basic: {
    storeName: string;
    logo: string;
    description: string;
  };
  design: {
    backgroundColor: string;
    font: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const data = await res.json();
  
  // Handle token expiration
  if (!res.ok && data.expired) {
    localStorage.removeItem("token");
    const redirectUrl = process.env.NODE_ENV === "development" 
      ? "http://localhost:3000" 
      : process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.tomakdigitalagency.ir";
    window.location.href = redirectUrl;
    throw new Error("Token expired");
  }
  
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch");
  }
  
  return data;
};

export const useUserInfo = () => {
  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR<UserInfo>("/api/userInfo", fetcher, {
    refreshInterval: 180000,
  });

  return {
    userInfo,
    loading: isLoading,
    error,
    basic: userInfo?.basic,
    contact: userInfo?.contact,
  };
};
