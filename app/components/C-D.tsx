import { Compiler } from "./compiler";
import { Layout } from "@/lib/types";
import data from "@/public/template/homelg.json";
import { v4 as uuidv4 } from "uuid";

// Add this to the Create function in C-D.tsx

export const Create = (
  sectionName: string,
  layout: Layout,
  setLayout: (layout: Layout) => void
) => {
  // Special case for CanvasEditor
  if (sectionName === "CanvasEditor") {
    const uniqueComponentName = `${sectionName}-${uuidv4().slice(0, 8)}`;
    
    // Create a new CanvasEditor section with proper structure
    const newSection = {
      type: uniqueComponentName,
      setting: {
        paddingTop: "20",
        paddingBottom: "20",
        paddingLeft: "20",
        paddingRight: "20",
        marginTop: "30",
        marginBottom: "30",
        backgroundColor: "#ffffff"
      },
      blocks: {
        elements: [
          {
            id: uuidv4(),
            type: "heading",
            content: "عنوان جدید",
            style: {
              x: 50,
              y: 50,
              width: 300,
              height: 60,
              fontSize: 24,
              fontWeight: "bold",
              color: "#000000",
              backgroundColor: "transparent",
              borderRadius: 0,
              padding: 0,
              textAlign: "right",
              zIndex: 1
            }
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content: "این یک متن نمونه است. شما می‌توانید این متن را ویرایش کنید یا المان‌های جدید به صفحه اضافه کنید.",
            style: {
              x: 50,
              y: 130,
              width: 400,
              height: 100,
              fontSize: 16,
              fontWeight: "normal",
              color: "#333333",
              backgroundColor: "transparent",
              borderRadius: 0,
              padding: 0,
              textAlign: "right",
              zIndex: 1
            }
          }
        ],
        setting: {
          canvasWidth: "100%",
          canvasHeight: "500px",
          backgroundColor: "#f9fafb",
          gridSize: 10,
          showGrid: true
        }
      }
    };

    const updatedLayout = {
      ...layout,
      sections: {
        ...layout.sections,
        children: {
          sections: [
            ...(layout.sections?.children?.sections || []),
            newSection,
          ],
          order: [
            ...(layout.sections?.children?.order || []),
            uniqueComponentName,
          ],
        },
      },
    };

    setLayout(updatedLayout as Layout);
    return;
  }

  // Original code for other components
  const templateData = Compiler(data, sectionName)[0];

  if (templateData) {
    const uniqueComponentName = `${sectionName}-${uuidv4().slice(0, 8)}`;
    // Create new section with proper structure
    const newSection = {
      ...templateData,
      type: uniqueComponentName,
      blocks: {
        imageSrc: "",
        imageAlt: "",
        heading: "",
        description: "",
        ...templateData.blocks,
      },
    };

    const updatedLayout = {
      ...layout,
      sections: {
        ...layout.sections,
        children: {
          sections: [
            ...(layout.sections?.children?.sections || []),
            newSection,
          ],
          order: [
            ...(layout.sections?.children?.order || []),
            uniqueComponentName,
          ],
        },
      },
    };

    setLayout(updatedLayout as Layout);
  }
};


export const Delete = (
  sectionName: string,
  layout: Layout,
  setLayout: (layout: Layout) => void
) => {
  const updatedLayout = {
    ...layout,
    sections: {
      ...layout.sections,
      children: {
        sections: layout.sections?.children?.sections.filter(
          (section) => section.type !== sectionName
        ),
        order: layout.sections?.children?.order.filter(
          (orderItem) => orderItem !== sectionName
        ),
      },
    },
  };

  setLayout(updatedLayout as Layout);
};

// Add this to the Compiler function in compiler.tsx to handle the new component type
// This is just a reference for what should be in the template data


// In app/components/C-D.tsx, in the Create function, add a special case for CanvasEditor:

export const CreateCanvasEditor = (
  sectionName: string,
  layout: Layout,
  setLayout: (layout: Layout) => void
) => {
  const templateData = Compiler(data, sectionName)[0];

  if (templateData) {
    const uniqueComponentName = `${sectionName}-${uuidv4().slice(0, 8)}`;
    
    // Special case for CanvasEditor to ensure proper initialization
    if (sectionName === "CanvasEditor") {
      const newSection = {
        type: uniqueComponentName,
        setting: {
          paddingTop: "20",
          paddingBottom: "20",
          paddingLeft: "20",
          paddingRight: "20",
          marginTop: "30",
          marginBottom: "30",
          backgroundColor: "#ffffff"
        },
        blocks: {
          elements: [],
          setting: {
            canvasWidth: "100%",
            canvasHeight: "500px",
            backgroundColor: "#f9fafb",
            gridSize: 10,
            showGrid: true
          }
        }
      };

      const updatedLayout = {
        ...layout,
        sections: {
          ...layout.sections,
          children: {
            sections: [
              ...(layout.sections?.children?.sections || []),
              newSection,
            ],
            order: [
              ...(layout.sections?.children?.order || []),
              uniqueComponentName,
            ],
          },
        },
      };

      setLayout(updatedLayout as Layout);
      return;
    }

    // Create new section with proper structure for other components
    const newSection = {
      ...templateData,
      type: uniqueComponentName,
      blocks: {
        imageSrc: "",
        imageAlt: "",
        heading: "",
        description: "",
        ...templateData.blocks,
      },
    };

    const updatedLayout = {
      ...layout,
      sections: {
        ...layout.sections,
        children: {
          sections: [
            ...(layout.sections?.children?.sections || []),
            newSection,
          ],
          order: [
            ...(layout.sections?.children?.order || []),
            uniqueComponentName,
          ],
        },
      },
    };

    setLayout(updatedLayout as Layout);
  }
};
