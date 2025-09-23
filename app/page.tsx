"use client";
import { Main } from "./components/main";
import { Suspense } from "react";
// import AuthHandler from "./components/AuthHandler";

function HomeContent() {
  return <Main />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <AuthHandler> */}
        <HomeContent />
      {/* </AuthHandler> */}
    </Suspense>
  );
}
