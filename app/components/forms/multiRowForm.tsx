import { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout, MultiRowSection, MultiRowBlock } from '@/lib/types';

interface MultiRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiRowSection>>;
  userInputData: MultiRowSection;
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

export const MultiRowForm: React.FC<MultiRowFormProps> = ({ setUserInputData, userInputData, layout }) => {
    useEffect(() => {
        const initialData = Compiler(layout, 'multirow');
        if (initialData && initialData[0]) {
          setUserInputData(initialData[0]);
        }
      }, []);      

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [index]: {
          ...prev.blocks[index],
          [name]: value
        }
      }
    }));
  };
  

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value
      }
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      title: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Multi Row Settings</h2>

      {/* Main Title Setting */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Main Title</h3>
        <input
          type="text"
          value={userInputData?.title ?? ''}
          onChange={handleTitleChange}
          className="w-full p-2 border rounded"
          placeholder="Main Title"
        />
      </div>

      {/* Row Content */}
      {Object.entries(userInputData?.blocks || {}).map(([key, block], index) => {
  if (key === 'setting') return null;
  return (
    <div key={index} className="mb-6 p-4 border rounded">
      <h3 className="font-semibold mb-2">Row {index + 1}</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Heading</label>
          <input
            type="text"
            name="heading"
            value={block.heading || ''}
            onChange={(e) => handleBlockChange(e, index)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Rest of the form fields */}
      </div>
    </div>
  );
})}

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Title Color"
            name="titleColor"
            value={userInputData?.setting?.titleColor ?? '#000000'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Heading Color"
            name="headingColor"
            value={userInputData?.setting?.headingColor ?? '#fcbf49'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Description Color"
            name="descriptionColor"
            value={userInputData?.setting?.descriptionColor ?? '#e4e4e4'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Background Color Box"
            name="backgroundColorBox"
            value={userInputData?.setting?.backgroundColorBox ?? '#2b2d42'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Button Color"
            name="btnColor"
            value={userInputData?.setting?.btnColor ?? '#ffffff'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Button Background Color"
            name="btnBackgroundColor"
            value={userInputData?.setting?.btnBackgroundColor ?? '#bc4749'}
            onChange={handleSettingChange}
          />
        </div>

        {/* Image Settings */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Image Align</label>
            <select
              name="imageAlign"
              value={userInputData?.setting?.imageAlign ?? 'row'}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="row">Row</option>
              <option value="row-reverse">Row Reverse</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Image Radius (px)</label>
            <input
              type="range"
              name="imageRadius"
              min="0"
              max="100"
              value={parseInt(userInputData?.setting?.imageRadius ?? '45')}
              onChange={handleSettingChange}
              className="w-full"
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
                value={parseInt(userInputData?.setting?.[spacing] ?? '20')}
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
