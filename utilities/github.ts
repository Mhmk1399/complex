import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file
const GITHUB_OWNER = "Mhmk1399";

/**
 * Fetches the raw content of a file from the GitHub repository.
 * @param filePath - Path of the file in the repository (e.g., "public/template/homesm.json").
 * @returns The raw content of the file as a string.
 */

function getRepoFromUrl(url: string | null): string {
  if (!url) return "userwebsite"; // default fallback

  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "userwebsite";
  } catch {
    return "userwebsite";
  }
}

export async function fetchGitHubFile(
  filePath: string,
  repoUrl?: string
): Promise<string> {
  const GITHUB_REPO = getRepoFromUrl(repoUrl || null);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  console.log("Fetching URL:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    // Extract Base64-encoded content and decode it
    const fileContent = response.data.content;
    const decodedContent = Buffer.from(fileContent, "base64").toString("utf-8");
    return decodedContent; // Return the decoded raw content of the file
  } catch (error: any) {
    console.error(
      "Error fetching file from GitHub:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error("Failed to fetch file from GitHub");
  }
}

export async function saveGitHubFile(
  filePath: string,
  content: string,
  repoUrl?: string
): Promise<void> {
  const GITHUB_REPO = getRepoFromUrl(repoUrl || null);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // First get the current file to get its SHA (needed for updating)
    const currentFile = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
      .catch(() => null); // File might not exist yet

    const encodedContent = Buffer.from(content).toString("base64");

    const payload = {
      message: `Update ${filePath}`,
      content: encodedContent,
      ...(currentFile?.data?.sha && { sha: currentFile.data.sha }), // Include SHA if file exists
    };

    await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
  } catch (error: any) {
    console.error(
      "Error saving file to GitHub:",
      error.response?.data || error.message
    );
    throw new Error("Failed to save file to GitHub");
  }
}

export async function deleteGitHubFile(
  filePath: string,
  repoUrl?: string
): Promise<void> {
  const GITHUB_REPO = getRepoFromUrl(repoUrl || null);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // Get the current file to get its SHA (required for deletion)
    const currentFile = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const payload = {
      message: `Delete ${filePath}`,
      sha: currentFile.data.sha,
    };

    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      data: payload,
    });
  } catch (error: any) {
    console.error(
      "Error deleting file from GitHub:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete file from GitHub");
  }
}
///asdasda

export async function listGitHubTemplates(repoUrl?: string): Promise<string[]> {
  const GITHUB_REPO = getRepoFromUrl(repoUrl || null);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/template`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === "file")
        .map((file) => file.name.replace(/\.json$/, ""))
        .map((name) => name.replace(/(lg|sm|Sm|Lg)$/, ""))
        .filter((name, index, array) => array.indexOf(name) === index);
    }

    return [];
  } catch (error: any) {
    console.error(
      "Error listing templates from GitHub:",
      error.response?.data || error.message
    );
    throw new Error("Failed to list templates from GitHub");
  }
}

export async function createRoutePage(
  routeName: string,
  repoUrl?: string
): Promise<void> {
  const pageContent = `"use client";
import { useEffect, useState } from "react";
import ImageText from "@/components/imageText";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import Banner from "@/components/banner";
import CollapseFaq from "@/components/collapseFaq";
import MultiColumn from "@/components/multiColumn";
import MultiRow from "@/components/multiRow";
import SlideShow from "@/components/slideShow";
import Video from "@/components/video";
import { Collection } from "@/components/collection";
import RichText from "@/components/richText";
import ProductList from "@/components/productList";
import { Story } from "@/components/story";
import Gallery from "@/components/gallery";
import { OfferRow } from "@/components/offerRow";
import { ProductsRow } from "@/components/productsRow";
import SlideBanner from "@/components/slideBanner";
import {
  BannerSection,
  CollapseSection,
  CollectionSection,
  ContactFormDataSection,
  GallerySection,
  ImageTextSection,
  MultiColumnSection,
  MultiRowSection,
  NewsLetterSection,
  OfferRowSection,
  ProductListSection,
  RichTextSection,
  SlideBannerSection,
  SlideSection,
  StorySection,
  VideoSection,
} from "@/lib/types";

type AllSections = 
  RichTextSection &
  BannerSection &
  ImageTextSection &
  VideoSection &
  ContactFormDataSection &
  NewsLetterSection &
  CollapseSection &
  MultiColumnSection &
  SlideSection &
  MultiRowSection &
  CollectionSection &
  StorySection &
  OfferRowSection &
  GallerySection &
  SlideBannerSection &
  ProductListSection;
  
  export default function Page() {
    const [data, setData] = useState<AllSections[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [orders, setOrders] = useState<string[]>([]);
  
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
      Story,
      OfferRow,
      Gallery,
      SlideBanner,
      ProductsRow,
    };
  
     useEffect(() => {
      const handleResize = async () => {
        const isMobileView = window.innerWidth < 430;
        setIsMobile(isMobileView);
  
        const currentRouteName = window.location.pathname.split("/")[1];
  
        const templateSuffix = isMobileView ? "sm" : "lg";
        const templatePath = \`\${currentRouteName}\${templateSuffix}\`;
  
        const template = await import(
          \`../../public/template/\${templatePath}.json\`
        );
  
        const testData = template.default.children.sections;
  
        setData(testData);
        setOrders(template.default.children.order);
      };
         handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    
      if (!data) {
      return <div>Loading...</div>;
    }
      return (
      <div className="grid grid-cols-1 pt-4 px-1">
        {orders.map((componentName, index) => {
          const baseComponentName = componentName.split("-")[0];
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];
  
          return Component ? (
            <div key={componentName} style={{ order: index }} className="w-full">
              <Component
                sections={data}
                isMobile={isMobile}
                componentName={componentName}
              />
            </div>
          ) : null;
        })}
      </div>
    );
}`;

  const filePath = `app/${routeName}/page.tsx`;
  await saveGitHubFile(filePath, pageContent, repoUrl);
}

export async function deleteRoutePage(
  routeName: string,
  repoUrl?: string
): Promise<void> {
  const filePath = `app/${routeName}/page.tsx`;
  await deleteGitHubFile(filePath, repoUrl);
}
