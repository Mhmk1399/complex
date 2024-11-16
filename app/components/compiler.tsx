import { Layout,Section } from "@/lib/types";
export const Compiler = (data: string | object, name: string) => {
  // Create deep copy of the data using structuredClone
  const processedData = typeof data === 'string' 
    ? JSON.parse(data)
    : structuredClone(data);

  if (name === 'layout') {
    return processedData;
  }

  if (name === 'sectionHeader' || name === 'sectionFooter') {
    const sectionKey = name === 'sectionHeader' ? 'sectionHeader' : 'sectionFooter';
    return structuredClone(processedData.sections[sectionKey]);
  }
  
  return structuredClone(
    processedData.sections.children.sections.filter(
      (section: Section) => section.type === name
    )
  );
}
export const JasonChanger = (data: string | object, name: string, newData: Layout) => {
  let processedData = typeof data === 'string' 
    ? JSON.parse(data)
    : structuredClone(data);

  if (name === 'layout') {
    return processedData;
  }

  if (name === 'sectionHeader') {
    processedData.sections.sectionHeader = newData;
    return processedData;
  
  }

  if (name === 'sectionFooter') {
    processedData.sections.sectionFooter = newData;
    return processedData;
  }

  // For other sections, find and update in children sections
  processedData.sections.children.sections = processedData.sections.children.sections.map(
    (section: Section) => {
      if (section.type === name) {
        return newData;
      }
      return section;
    }
  );

  return processedData;
  
  
}

   
