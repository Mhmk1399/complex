import { Compiler } from "./compiler";
import { Layout } from "@/lib/types";
import data from "@/public/template/homelg.json";
import { v4 as uuidv4 } from "uuid";

export const Create = (
  sectionName: string,
  layout: Layout,
  setLayout: (layout: Layout) => void
) => {
  const templateData = Compiler(data, sectionName)[0];
  console.log(templateData, "ttttttt");

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
    console.log(newSection, "nnnnnn");

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

    // Log to verify updated layout

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
