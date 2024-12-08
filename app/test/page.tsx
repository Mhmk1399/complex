import { promises as fs } from 'fs'
import path from 'path'

interface BannerSection {
  type: string;
  blocks: {
    imageSrc: string;
    imageAlt: string;
    text: string;
    description: string;
    setting: {
      descriptionColor: string;
      descriptionFontSize: string;
      descriptionFontWeight: string;
      textColor: string;
      textFontSize: string;
      textFontWeight: string;
      backgroundColorBox: string;
      backgroundBoxRadious: string;
      opacityImage: number;
      opacityTextBox: number;
      imageRadious: string;
      imageBehavior: string;
    }
  };
  setting: {
    paddingTop: string;
    paddingBottom: string;
    marginTop: string;
    marginBottom: string;
  }
}


export default async function Page() {
const getJsonData = async () => {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'template', 'null.json')
    console.log('Attempting to read from:', jsonPath)
    
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('Error reading JSON file:', error)
    throw error
  }
}
const extractSections = (data: any) => {
  const sections = {
    banners: [] as BannerSection[],
    // Add other section arrays as needed
  };

  data.sections.children.sections.forEach((section: any) => {
    if (section.type === "Banner") {
      sections.banners.push(section);
    }
    // Add other section type checks
  });

  return sections;
};

  try {
    const jsonData = await getJsonData();
    const sections = extractSections(jsonData);
    
    return (
      <div>
        {/* Render Banner Sections */}
        {sections.banners.map((banner, index) => (
          <div 
            key={index}
            style={{
              paddingTop: `${banner.setting.paddingTop}px`,
              paddingBottom: `${banner.setting.paddingBottom}px`,
              marginTop: `${banner.setting.marginTop}px`,
              marginBottom: `${banner.setting.marginBottom}px`,
              position: 'relative',
            }}
          >
            <div style={{
              backgroundColor: banner.blocks.setting.backgroundColorBox,
              borderRadius: banner.blocks.setting.backgroundBoxRadious, 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <img 
                src={banner.blocks.imageSrc}
                alt={banner.blocks.imageAlt}
                style={{
                  opacity: banner.blocks.setting.opacityImage,
                  borderRadius: banner.blocks.setting.imageRadious,
                  objectFit: banner.blocks.setting.imageBehavior as any
                }}
              />
              <h2 style={{
                color: banner.blocks.setting.textColor,
                fontSize: `${banner.blocks.setting.textFontSize}px`,
                fontWeight: banner.blocks.setting.textFontWeight
              }}>
                {banner.blocks.text}
              </h2>
              <p style={{
                color: banner.blocks.setting.descriptionColor,
                fontSize: `${banner.blocks.setting.descriptionFontSize}px`,
                fontWeight: banner.blocks.setting.descriptionFontWeight
              }}>
                {banner.blocks.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return <div>Error loading content</div>;
  }
}