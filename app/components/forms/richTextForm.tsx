import  { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout,Section } from '@/lib/types';

interface RichTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<Layout>>;
  userInputData: Section;
  layout: Layout;
}

const ColorInput = ({ label, name, value, onChange }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <label className="block mb-1" htmlFor={name}>{label}</label>
    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const RichText: React.FC<RichTextFormProps> = ({ setUserInputData, userInputData , layout}) => {


  useEffect(() => {
    const initialData = Compiler(layout, 'rich-text') ;
    setUserInputData(initialData[0]);
    
  }, []);


  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev : Layout) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value
      }
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: Layout) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value
        }
      }
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: Layout) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Rich Text Settings</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Heading</label>
            <input
              type="text"
              name="textHeading"
              value={userInputData?.blocks?.textHeading ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1">Button Text</label>
            <input
              type="text"
              name="btnText"
              value={userInputData?.blocks?.btnText ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Button Link</label>
            <input
              type="text"
              name="btnLink"
              value={userInputData?.blocks?.btnLink ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Heading Color"
            name="textHeadingColor"
            value={userInputData?.blocks?.setting?.textHeadingColor?.toString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="background Color"
            name="background"
            value={userInputData?.blocks?.setting?.background?.toString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Description Color"
            name="descriptionColor"
            value={userInputData?.blocks?.setting?.descriptionColor?.toString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />

          <ColorInput
            label="Button Text Color"
            name="btnTextColor"
            value={userInputData?.blocks?.setting?.btnTextColor?.toString() ?? '#ffffff'}
            onChange={handleBlockSettingChange}
          />

          <ColorInput
            label="Button Background Color"
            name="btnBackgroundColor"
            value={userInputData?.blocks?.setting?.btnBackgroundColor?.toString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Spacing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Padding Top</label>
            <input
              type="range"
              name="paddingTop"
              value={userInputData?.setting?.paddingTop?.toString() ?? '0'}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Padding Bottom</label>
            <input
              type="range"
              name="paddingBottom"
              value={userInputData?.setting?.paddingBottom?.toString() ?? '0'}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Margin Top</label>
            <input
              type="range"
              name="marginTop"
              value={userInputData?.setting?.marginTop?.toString() ?? '0'}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Margin Bottom</label>
            <input
              type="range"
              name="marginBottom"
              value={userInputData?.setting?.marginBottom?.toString() ?? '0'}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};