import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

export async function createRouteFiles(newRoute: string, decodedToken: jwt.JwtPayload) {
    const targetDir = decodedToken.targetDirectory;
    const routeName = newRoute;
    const appDir = path.join(targetDir, 'app', routeName);

    // Create the directory
    try {
        fs.mkdirSync(appDir);
        console.log('Directory created successfully');
    } catch (error) {
        console.error('Error creating directory:', error);
        return Response.json(
            { error: 'Failed to create directory' },
            { status: 500 }
        );
    }

    // Create the page.tsx file and add a string to it
    const pageFilePath = path.join(appDir, 'page.tsx');
    const fileContent = `"use client";
import { useEffect, useState } from "react";
import ImageText from "@/components/imageText";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import { usePathname } from "next/navigation";
import Banner from "@/components/banner";
import CollapseFaq from "@/components/collapseFaq";
import MultiColumn from "@/components/multiColumn";
import MultiRow from "@/components/multiRow";
import SlideShow from "@/components/slideShow";
import Video from "@/components/video";
import { Collection } from "@/components/collection";
import RichText from "@/components/richText";
import ProductList from "@/components/productList";

export default function Page() {
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const pathname = usePathname();

  const componentMap = {
    RichText,
    Banner,
    ImageText,
    Video,
    ContactForm,
    NewsLetter,
    CollapseFaq,
    MultiColumn,
    SlideShow,
    MultiRow,
    ProductList,
    Collection,
  };

  useEffect(() => {
    const getData = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
      }
      const routePath = pathname.split("/").pop() || "home";

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL+/api/sections?+$routePath,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();

      setData(data.Children.sections);
      setOrders(data.Children.order);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    };
    getData();
  }, [pathname]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 mt-32">
        {orders.map((componentName, index) => {
          const baseComponentName = componentName;
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];

          return Component ? (
            <div
              key={componentName} // Using the full componentName which includes the UUID
              style={{ order: index }}
              className="w-full"
            >
              <Component sections={data} isMobile={isMobile} />
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}`;

    try {
        fs.writeFileSync(pageFilePath, fileContent);
        console.log('page.tsx file created successfully');
    } catch (error) {
        console.error('Error creating page.tsx file:', error);
        return Response.json(
            { error: 'Failed to create page.tsx file' },
            { status: 500 }
        );
    }
}
export async function deleteRouteFiles (route: string, decodedToken: jwt.JwtPayload) {
    
   
   
    const targetDir = decodedToken.targetDirectory;
    const routeName = route;
    const appDir = path.join(targetDir, 'app', routeName);
    try {
        fs.rmdirSync(appDir, { recursive: true });
        console.log('Directory deleted successfully');
    } catch (error) {
        console.error('Error deleting directory:', error);
        return Response.json(
            { error: 'Failed to delete directory' },
            { status: 500 }
        );
    }
    
}