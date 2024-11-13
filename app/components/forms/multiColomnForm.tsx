import  { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout, Section } from '@/lib/types';

interface MultiColumnFormProps {
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
  <div className="flex flex-col gap-2">
    <label className="block mb-1" htmlFor={name}>{label}</label>
    <input
      type="color"
      id={name}
      name={name}
      value={value || '#000000'}
      onChange={onChange}
      className="border p-0.5 rounded-full"
    />
  </div>
);

export const MultiColumnForm: React.FC<MultiColumnFormProps> = ({ setUserInputData, userInputData, layout }) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'multicolumn')[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, columnNum: number) => {
    const { name, value } = e.target;
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [columnNum-1]: {
          ...prev.blocks[columnNum-1],
          [`${name}${columnNum}`]: value
        }
      }
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <h2 className="text-xl font-bold mb-4">Multi Column Settings</h2>

      {/* Main Heading Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Main Heading</h3>
        <input
          type="text"
          name="heading"
          value={userInputData?.setting?.heading?.toLocaleString() ?? ''}
          onChange={handleSettingChange}
          className="w-full p-2 border rounded"
          placeholder="Main Heading"
        />
      </div>

      {/* Column Content */}
      {[1, 2, 3].map((columnNum) => (
  <div key={columnNum} className="mb-6 p-4 border rounded">
    <h3 className="font-semibold mb-2">Column {columnNum}</h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={userInputData?.blocks?.[columnNum-1]?.[`title${columnNum}`] || ''}
          onChange={(e) => handleBlockChange(e, columnNum)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={userInputData?.blocks?.[columnNum-1]?.[`description${columnNum}`] || ''}
          onChange={(e) => handleBlockChange(e, columnNum)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1">Image Source</label>
        <input
          type="text"
          name="imageSrc"
          value={userInputData?.blocks?.[columnNum-1]?.[`imageSrc${columnNum}`] || ''}
          onChange={(e) => handleBlockChange(e, columnNum)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Button Label</label>
        <input
          type="text"
          name="btnLable"
          value={userInputData?.blocks?.[columnNum-1]?.[`btnLable${columnNum}`] || ''}
          onChange={(e) => handleBlockChange(e, columnNum)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Button Link</label>
        <input
          type="text"
          name="btnLink"
          value={userInputData?.blocks?.[columnNum-1]?.[`btnLink${columnNum}`] || ''}
          onChange={(e) => handleBlockChange(e, columnNum)}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  </div>
))}
      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Heading Color"
            name="headingColor"
            value={userInputData?.setting?.headingColor ?? '#ffffff'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Title Color"
            name="titleColor"
            value={userInputData?.setting?.titleColor?.toLocaleString() ?? '#ffa62b'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Description Color"
            name="descriptionColor"
            value={userInputData?.setting?.descriptionColor?.toLocaleString() ?? '#e4e4e4'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Background Color"
            name="backgroundColorBox"
            value={userInputData?.setting?.backgroundColorBox?.toLocaleString() ?? '#82c0cc'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Button Color"
            name="btnColor"
            value={userInputData?.setting?.btnColor?.toLocaleString() ?? '#ffffff'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Button Background Color"
            name="btnBackgroundColor"
            value={userInputData?.setting?.btnBackgroundColor?.toLocaleString() ?? '#16697a'}
            onChange={handleSettingChange}
          />
        </div>

        {/* Image Settings */}
        <div className="mt-4 gap-4">
          <div>
            <label className="block mb-1">Image Behavior</label>
            <select
              name="imageBehavior"
              value={userInputData?.setting?.imageBehavior?.toLocaleString() ?? 'cover'}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
          <div className='cols-span-2'>
            <label className="block mb-1">Image Radius (px)</label>
            <input
              type="range"
              name="imageRadious"
              value={userInputData?.setting?.imageRadious?.replace('px', '') ?? '10'}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
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
                value={parseInt(userInputData?.setting?.[spacing] ?? '0')}
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
