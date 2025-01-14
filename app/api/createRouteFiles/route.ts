import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const newRoute = request.headers.get('new-route');

    if (!token || !newRoute) {
        return NextResponse.json(
            { error: 'Missing token or route name' },
            { status: 400 }
        );
    }

    let decodedToken;
    try {
        decodedToken = jwt.decode(token);
        if (!decodedToken) {
            throw new Error('Failed to decode token');
        }

        const targetDir = (decodedToken as jwt.JwtPayload).targetDirectory;
        const appDir = path.join(targetDir, 'app', newRoute);

        // Create directory and files
        fs.mkdirSync(appDir, { recursive: true });
        
        // Create page.tsx with existing content
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
  const [orders, setOrders] = useState<string[]>([]);
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
        process.env.NEXT_PUBLIC_API_URL+'/api/sections?'+routePath,
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
          const baseComponentName = componentName.split("-")[0];
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];

          return Component ? (
            <div
              key={componentName} // Using the full componentName which includes the UUID
              style={{ order: index }}
              className="w-full"
            >
              <Component sections={data} isMobile={isMobile} componentName={componentName} />
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}`;
        fs.writeFileSync(pageFilePath, fileContent);

        return NextResponse.json({ 
            message: 'Route created successfully' 
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to create route' +error
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const routeToDelete = request.headers.get('route-name');

    if (!token || !routeToDelete) {
        return NextResponse.json(
            { error: 'Missing token or route name' },
            { status: 400 }
        );
    }

    try {
        const decodedToken = jwt.decode(token) as jwt.JwtPayload;
        const targetDir = decodedToken.targetDirectory;
        const appDir = path.join(targetDir, 'app', routeToDelete);

        fs.rmdirSync(appDir, { recursive: true });

        return NextResponse.json({ 
            message: 'Route deleted successfully' 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to delete route' +error
        }, { status: 500 });
    }
}