"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { Layout, FooterSection } from "@/lib/types";
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  children: { _id: string; name: string }[];
  storeId: string;
  slug: string;
}

interface FooterProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  selectedComponent: string;
  previewWidth: "sm" | "default";
}

const FooterContainer = styled.footer<{
  $data: FooterSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding: ${(props) => {
    const top = props.$data?.setting?.paddingTop || "24";
    const bottom = props.$data?.setting?.paddingBottom || "24";
    const left = props.$data?.setting?.paddingLeft || "16";
    const right = props.$data?.setting?.paddingRight || "16";
    return props.$preview === "sm"
      ? `${parseInt(top) * 0.7}px ${parseInt(right) * 0.7}px ${
          parseInt(bottom) * 0.7
        }px ${parseInt(left) * 0.7}px`
      : `${top}px ${right}px ${bottom}px ${left}px`;
  }};
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#f8f9fa"};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  text-align: center;
  transition: all 0.2s ease;
  border-radius: ${(props) => props.$data?.blocks?.setting?.bgRadius || "0"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const FooterText = styled.h2<{
  $data: FooterSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  font-size: ${(props) => {
    const baseFontSize = props.$data?.blocks?.setting?.textFontSize || "20";
    return props.$preview === "sm"
      ? `${parseInt(baseFontSize) * 0.8}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.textFontWeight || "600"};
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#1f2937"};
  margin: 0;
  padding: ${(props) => (props.$preview === "sm" ? "4px 8px" : "6px 12px")};
`;

const FooterDescription = styled.p<{
  $data: FooterSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  font-size: ${(props) => {
    const baseFontSize =
      props.$data?.blocks?.setting?.descriptionFontSize || "14";
    return props.$preview === "sm"
      ? `${parseInt(baseFontSize) * 0.85}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "400"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#6b7280"};
  margin: 0;
  padding: ${(props) => (props.$preview === "sm" ? "0 16px" : "0 24px")};
  line-height: 1.5;
  max-width: 800px;
`;

const SocialLinks = styled.div<{
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: flex;
  justify-content: center;
  gap: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  margin: ${(props) => (props.$preview === "sm" ? "8px 0" : "12px 0")};
  padding: ${(props) => (props.$preview === "sm" ? "8px" : "12px")};
  transition: all 0.3s ease-in-out;
`;

const FooterLinks = styled.div<{
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  margin: ${(props) => (props.$preview === "sm" ? "8px 0" : "12px 0")};
  padding: ${(props) => (props.$preview === "sm" ? "8px" : "12px")};
`;

const NumberPart = styled.div<{
  $data: FooterSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#1f2937"};
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: ${(props) => (props.$preview === "sm" ? "14px" : "15px")};
  background: #ffffff;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #3b82f6;
    }
  }
`;

const ScrollTopButton = styled.button<{
  $data: FooterSection;
}>`
  position: absolute;
  top: 16px;
  left: 16px;
  height: 36px;
  background: ${(props) =>
    props.$data?.blocks?.setting?.scrollButtonBg || "#ffffff"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.scrollButtonColor || "#374151"};
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0 12px;
  z-index: 10;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
`;

const FooterLink = styled(Link)<{ $data: FooterSection }>`
  font-weight: 500;
  text-decoration: none;
  color: ${(props) => props.$data?.blocks?.setting?.linkColor || "#374151"};
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    color: #3b82f6;
    background: #f8fafc;
  }
`;

const Logo = styled(Image)<{
  $data: FooterSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const CategoryGrid = styled.div<{
  $preview: "sm" | "default";
  $previewWidth: "sm" | "default";
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${(props) => (props.$preview === "sm" ? "160px" : "200px")}, 1fr)
  );
  gap: ${(props) => (props.$preview === "sm" ? "12px" : "24px")};
  width: 100%;
  max-width: 1000px;
  padding: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const ParentCategoryLink = styled(Link)<{
  $data: FooterSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.categoryColor || "#1f2937"};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  text-align: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$data?.blocks?.setting?.categoryBg || "#ffffff"};
  border: 1px solid #e5e7eb;
  text-decoration: none;
  display: block;

  &:hover {
    opacity: 0.7;
    transform: translateX(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ChildCategoryLink = styled(Link)<{
  $data: FooterSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.categoryColor || "#6b7280"};
  font-weight: 400;
  font-size: 12px;
  padding: 4px 8px;
  text-align: right;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: block;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
    transform: translateX(2px);
  }
`;

const CategorySection = styled.div`
  display: flex;
  flex-col;
  gap: 6px;
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-col;
  gap: 2px;
  padding-right: 8px;
  border-right: 2px solid #f3f4f6;
`;

const SocialLinkItem = styled(Link)`
  transition: transform 0.2s ease;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px) scale(1.05);
  }
`;

const Footer: React.FC<FooterProps> = ({
  setSelectedComponent,
  layout,
  selectedComponent,
  previewWidth,
}) => {
  const [preview, setPreview] = useState(previewWidth);
  const [enamadExists] = useState(false);
  const [enamad] = useState({});
  const [categories, setCategories] = useState<Category[]>([]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers: HeadersInit = {
          Authorization: `Bearer ${localStorage.getItem("complexToken")}`,
          "Content-Type": "application/json",
        };

        const response = await fetch("/api/category", {
          method: "GET",
          headers: headers,
        });
        const data = await response.json();
        const fetchedCategories = Array.isArray(data)
          ? data
          : [
              {
                _id: "1",
                name: "لپ تاپ",
                children: [],
                storeId: "",
                slug: "laptops",
              },
            ];

        setCategories(fetchedCategories);
      } catch (error) {
        console.log("Error fetching categories", error);

        setCategories([
          {
            _id: "1",
            name: "لپ تاپ",
            children: [],
            storeId: "",
            slug: "laptops",
          },
          {
            _id: "2",
            name: "موبایل",
            children: [],
            storeId: "",
            slug: "phones",
          },
          {
            _id: "3",
            name: "تبلت",
            children: [],
            storeId: "",
            slug: "tablets",
          },
          {
            _id: "4",
            name: "ساعت هوشمند",
            children: [],
            storeId: "",
            slug: "smartwatches",
          },
          {
            _id: "5",
            name: "هدفون",
            children: [],
            storeId: "",
            slug: "headphones",
          },
          {
            _id: "6",
            name: "لوازم جانبی",
            children: [],
            storeId: "",
            slug: "accessories",
          },
        ]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.sectionFooter as FooterSection;

  if (!sectionData) {
    return null;
  }

  const {
    text,
    links,
    description,
    instagramLink,
    telegramLink,
    whatsappLink,
    logo,
    phoneNumber,
    textNumber,
  } = sectionData?.blocks;

  return (
    <FooterContainer
      $preview={preview}
      dir="rtl"
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent("sectionFooter")}
      className={`${
        selectedComponent === "sectionFooter"
          ? "border-2 border-blue-500 rounded"
          : ""
      }`}
    >
      {"sectionFooter" === selectedComponent ? (
        <div className="absolute -top-6 -left-1 z-10">
          <div className="bg-blue-500 py-1 px-3 rounded text-white text-sm">
            sectionFooter
          </div>
        </div>
      ) : null}

      <Logo
        $preview={preview}
        $previewWidth={previewWidth}
        $data={sectionData}
        src={logo || "/assets/images/logo.webp"}
        width={preview === "sm" ? 60 : 80}
        height={preview === "sm" ? 60 : 80}
        alt="Logo"
      />

      <NumberPart
        $data={sectionData}
        $preview={preview}
        $previewWidth={previewWidth}
      >
        <Link href={`tel:${phoneNumber || "123123123"}`}>{phoneNumber}</Link>
        {textNumber && (
          <span className="text-xs opacity-70 mr-2">{textNumber}</span>
        )}
      </NumberPart>

      <ScrollTopButton
        $data={sectionData}
        onClick={(e) => {
          e.stopPropagation();
          scrollToTop();
        }}
      >
        <FaArrowUp size={12} />
        <span> بازگشت به بالا </span>
      </ScrollTopButton>

      <FooterText
        $preview={preview}
        $previewWidth={previewWidth}
        $data={sectionData}
      >
        {text || "Footer Text"}
      </FooterText>

      <FooterDescription
        $preview={preview}
        $previewWidth={previewWidth}
        $data={sectionData}
      >
        {description}
      </FooterDescription>

      <SocialLinks
        className="flex flex-row gap-4 my-4"
        $preview={preview}
        $previewWidth={previewWidth}
      >
        <SocialLinkItem
          href={instagramLink ? instagramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/instagram.png"
            alt="Instagram"
            width={preview === "sm" ? 24 : 28}
            height={preview === "sm" ? 24 : 28}
          />
        </SocialLinkItem>
        <SocialLinkItem
          href={whatsappLink ? whatsappLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/whatsapp.png"
            alt="Whatsapp"
            width={preview === "sm" ? 24 : 28}
            height={preview === "sm" ? 24 : 28}
          />
        </SocialLinkItem>
        <SocialLinkItem
          href={telegramLink ? telegramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/telegram.png"
            alt="Telegram"
            width={preview === "sm" ? 24 : 28}
            height={preview === "sm" ? 24 : 28}
          />
        </SocialLinkItem>
      </SocialLinks>

      <CategoryGrid $preview={preview} $previewWidth={previewWidth}>
        {categories
          .filter((category) => category.children.length > 0)
          .map((category) => (
            <CategorySection key={category._id}>
              <ParentCategoryLink
                href={`/category/${category.name}`}
                $data={sectionData}
              >
                {category.name}
              </ParentCategoryLink>

              <ChildrenContainer>
                {category.children.map((child, index) => (
                  <ChildCategoryLink
                    key={`${category._id}-${child._id}-${index}`}
                    href={`/category/${child.name}`}
                    $data={sectionData}
                  >
                    {child.name}
                  </ChildCategoryLink>
                ))}
              </ChildrenContainer>
            </CategorySection>
          ))}
      </CategoryGrid>

      {links && Array.isArray(links) && links.length > 0 && (
        <FooterLinks $previewWidth={previewWidth} $preview={preview}>
          {links.map((link, index) => (
            <FooterLink
              key={index}
              href={link?.url || "#"}
              $data={sectionData}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link?.label || "Link"}
            </FooterLink>
          ))}
        </FooterLinks>
      )}

      {enamadExists && (
        <div className="hover:scale-105 transition-transform duration-200">
          <Link href={enamad} target="_blank">
            <Image
              src="/assets/images/enamad.jpg"
              alt="Enamad Certification"
              width={80}
              height={40}
              className="rounded border"
            />
          </Link>
        </div>
      )}
    </FooterContainer>
  );
};

export default Footer;
