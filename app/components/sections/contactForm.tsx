"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";
import { ContactFormDataSection, Layout } from "@/lib/types";

interface ContactFormProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const FormContainer = styled.div<{
  $data: ContactFormDataSection;
  $preview: "sm" | "default";
}>`
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.formBackground || "#f8f9fa"};
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.boxRadiuos || "10"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks?.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks?.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks?.setting?.shadowBlur || 10}px 
     ${props.$data.blocks?.setting?.shadowSpread || 0}px 
     ${props.$data.blocks?.setting?.shadowColor || "#fff"}`};
`;

const FormHeading = styled.h2<{
  $data: ContactFormDataSection;
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    `${props.$data?.blocks?.setting?.headingFontSize || "28"}px`};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label<{
  $data: ContactFormDataSection;
}>`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  margin-right: 10px;
  color: ${(props) => props.$data?.blocks?.setting?.labelColor || "#333"};
`;

const Input = styled.input<{
  $data: ContactFormDataSection;
}>`
  max-width: 100%;
  width: ${(props) => props.$data.blocks?.setting?.inputWidth || "10"}px;
  padding: 12px;
  margin-right: 10px;
  margin-left: 10px;
  border: 2px solid #e1e5e9;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.inputRadiuos || "10"}px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea<{
  $data: ContactFormDataSection;
}>`
  max-width: 100%;
  width: ${(props) => props.$data.blocks?.setting?.inputWidth || "10"}px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.inputRadiuos || "10"}px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s ease;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button<{
  $data: ContactFormDataSection;
  $preview: "sm" | "default";
}>`
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data?.blocks?.setting?.btnTextColor || "#ffffff"};
  padding: ${(props) => (props.$preview === "sm" ? "10px 20px" : "12px 30px")};
  border: none;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.btnRadiuos || "10"}px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: ${(props) => props.$data.blocks?.setting?.btnWidth || "10"}px;
  max-width: 100%;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data?.blocks?.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: contactFormBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnPulse {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: contactFormBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === "brightness") {
      return `
        ${selector} {
          animation: contactFormBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === "blur") {
      return `
        ${selector} {
          animation: contactFormBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === "saturate") {
      return `
        ${selector} {
          animation: contactFormBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === "contrast") {
      return `
        ${selector} {
          animation: contactFormBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: contactFormBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnOpacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: contactFormBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    return "";
  }}
`;

const ContactForm: React.FC<ContactFormProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setPreview(window.innerWidth <= 425 ? "sm" : previewWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as ContactFormDataSection;

  if (!sectionData) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically send the form data to your API
      console.log("Form submitted:", formData);

      // Show success message or handle response
      alert("پیام شما با موفقیت ارسال شد!");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <FormContainer
      $data={sectionData}
      $preview={preview}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg"
          : ""
      }`}
    >
      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}

      <FormHeading $data={sectionData} $preview={preview}>
        {sectionData.blocks?.heading || "تماس با ما"}
      </FormHeading>

      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="w-full  flex flex-col justify-center items-center px-4"
      >
        <FormGroup>
          <Label $data={sectionData} htmlFor="name">
            نام و نام خانوادگی *
          </Label>
          <Input
            $data={sectionData}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="نام و نام خانوادگی خود را وارد کنید"
          />
        </FormGroup>

        <FormGroup>
          <Label $data={sectionData} htmlFor="phone">
            شماره تماس
          </Label>
          <Input
            $data={sectionData}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="شماره تماس خود را وارد کنید"
          />
        </FormGroup>

        <FormGroup>
          <Label $data={sectionData} htmlFor="message">
            پیام *
          </Label>
          <TextArea
            $data={sectionData}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            placeholder="پیام خود را اینجا بنویسید..."
          />
        </FormGroup>

        <SubmitButton type="submit" $data={sectionData} $preview={preview}>
          ارسال پیام
        </SubmitButton>
      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  Delete(actualName, layout, setLayout);
                  setShowDeleteModal(false);
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </FormContainer>
  );
};

export default ContactForm;
