"use client";

import React, { useState } from "react";
import RichText from "../components/sections/richText";
import Header from "../components/sections/header";
import Banner from "../components/sections/banner";

const Page = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  return (
    <div>
      <Header setSelectedComponent={setSelectedComponent} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <RichText />
      <br />
     
      <Banner />
    </div>
  );
};

export default Page;
