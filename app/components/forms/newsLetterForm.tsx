import  { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout,Section } from '@/lib/types';
interface NewsLetterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<Section>>;
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
        value={value || '#000000'}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const NewsLetterForm: React.FC<NewsLetterFormProps> = ({ setUserInputData, userInputData, layout }) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'newsletter')[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value
      }
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: Section) => ({
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
      <h2 className="text-xl font-bold mb-4">Newsletter Settings</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Heading</label>
            <input
              type="text"
              name="heading"
              value={userInputData?.blocks?.heading ?? ''}
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
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Heading Color"
            name="headingColor"
            value={userInputData?.blocks?.setting?.headingColor?.toLocaleString() ?? '#ffffff'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Description Color"
            name="descriptionColor"
            value={userInputData?.blocks?.setting?.descriptionColor?.toLocaleString() ?? '#e4e4e4'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Button Background Color"
            name="btnBackgroundColor"
            value={userInputData?.blocks?.setting?.btnBackgroundColor?.toLocaleString() ?? '#ea7777'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Button Text Color"
            name="btnTextColor"
            value={userInputData?.blocks?.setting?.btnTextColor?.toLocaleString() ?? '#ffffff'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Form Background"
            name="formBackground"
            value={userInputData?.blocks?.setting?.formBackground ?.toLocaleString()?? '#005002'}
            onChange={handleBlockSettingChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1">Heading Font Size</label>
            <input
              type="range"
              name="headingFontSize"
              value={userInputData?.blocks?.setting?.headingFontSize ?.toLocaleString()?? '27px'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Description Font Size</label>
            <input
              type="range"
              name="descriptionFontSize"
              value={userInputData?.blocks?.setting?.descriptionFontSize ?.toLocaleString()?? '18px'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1">Heading Font Weight</label>
            <select
              name="headingFontWeight"
              value={userInputData?.blocks?.setting?.headingFontWeight?.toLocaleString() ?? 'bold'}
              onChange={()=>handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Description Font Weight</label>
            <select
              name="descriptionFontWeight"
              value={userInputData?.blocks?.setting?.descriptionFontWeight?.toLocaleString() ?? 'normal'}
              onChange={()=>handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Spacing</h3>
        <div className="grid grid-cols-2 gap-4">
          {['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].map((spacing) => (
            <div key={spacing}>
              <label className="block mb-1">{spacing.charAt(0).toUpperCase() + spacing.slice(1)}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={userInputData?.setting?.[spacing as keyof typeof userInputData.setting]?.toLocaleString() ?? '0'}
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
