import { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout, Section } from '@/lib/types';

interface SlideFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<Section>>;
  userInputData: Section;
  layout: Layout;
}

interface Block {
  imageSrc?: string;
  text?: string;
  description?: string;
  btnText?: string;
  btnLink?: string;
  imageAlt?: string;
  setting?: Record<string, string>;
}

interface FormSection {
  blocks: Block[];
  setting: Record<string, string>;
}

export const SlideForm: React.FC<SlideFormProps> = ({ setUserInputData, userInputData, layout }) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'slideshow')[0];
    // Ensure blocks is an array
    if (!Array.isArray(initialData.blocks)) {
      initialData.blocks = [];
    }
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof Block) => {
    const { value } = e.target;
    setUserInputData((prev: Section | FormSection | Layout | any) => ({
      ...prev,
      blocks: Array.isArray(prev.blocks)
        ? prev.blocks.map((block: Block, i: number) =>
            i === index ? { ...block, [field]: value } : block
          )
        : [],
      setting: prev.setting
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: Section) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Slideshow Settings</h2>

      {/* Slides Content */}
      {[0, 1].map((index) => (
        <div key={index} className="mb-8 p-4 border rounded">
          <h3 className="font-semibold mb-4">Slide {index + 1}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Image Source</label>
              <input
                type="text"
                value={(userInputData?.blocks?.[index] as Block)?.imageSrc || ''}
                onChange={(e) => handleBlockChange(e, index, 'imageSrc')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Heading Text</label>
              <input
                type="text"
                value={(userInputData?.blocks?.[index] as Block)?.text || ''}
                onChange={(e) => handleBlockChange(e, index, 'text')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                value={(userInputData?.blocks?.[index] as Block)?.description || ''}
                onChange={(e) => handleBlockChange(e, index, 'description')}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1">Button Text</label>
              <input
                type="text"
                value={(userInputData?.blocks?.[index] as Block)?.btnText || ''}
                onChange={(e) => handleBlockChange(e, index, 'btnText')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Button Link</label>
              <input
                type="text"
                value={(userInputData?.blocks?.[index] as Block)?.btnLink || ''}
                onChange={(e) => handleBlockChange(e, index, 'btnLink')}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          {(['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'] as const).map((spacing) => (
            <div key={spacing}>
              <label className="block mb-1">{spacing.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={parseInt(userInputData?.setting?.[spacing] || '0')}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
