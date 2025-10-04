"use client";
import { Main } from "./components/main";
import { Suspense } from "react";
import AuthHandler from "./contexts/authHandler";
 
function HomeContent() {
  return <Main />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>در حال بارگذاری</div>}>
      <AuthHandler>
        <HomeContent />
      </AuthHandler>
    </Suspense>
  );
}
