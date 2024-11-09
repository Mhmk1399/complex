export const Compiler = (data: string | object, name: string) => {
  // Create deep copy of the data using structuredClone
  let processedData = typeof data === 'string' 
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
      (section: any) => section.type === name
    )
  );
}
