import  { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout ,Section } from '@/lib/types';
interface BannerFormProps {
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

export const BannerForm: React.FC<BannerFormProps> = ({ setUserInputData, userInputData , layout}) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'banner')[0];
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

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <h2 className="text-xl font-bold mb-4">Banner Settings</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Image Source</label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Heading Text</label>
            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text ?? ''}
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
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Text Color"
            name="textColor"
            value={userInputData?.blocks?.setting?.textColor?.toLocaleString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Description Color"
            name="descriptionColor"
            value={userInputData?.blocks?.setting?.descriptionColor?.toLocaleString() ?? '#333333'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Background Color"
            name="backgroundColorBox"
            value={userInputData?.blocks?.setting?.backgroundColorBox?.toLocaleString() ?? '#ffffff'}
            onChange={handleBlockSettingChange}
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1">Image Behavior</label>
          <select
            name="imageBehavior"
            value={userInputData?.blocks?.setting?.imageBehavior?.toLocaleString() ?? 'cover'}
            onChange={handleBlockSettingChange}
            className="w-full p-2 border rounded"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Spacing</h3>
        <div className="grid grid-cols-2 gap-4">
          {(['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'] as const).map((spacing) => (
            <div key={spacing}>
              <label className="block mb-1">{spacing.charAt(0).toUpperCase() + spacing.slice(1)}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={userInputData?.setting?.[spacing]?.toLocaleString() ?? '0'}
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
