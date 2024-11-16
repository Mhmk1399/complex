import  { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout ,Section } from '@/lib/types';
interface CollapseFormProps {
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
  <div className="mb-4">
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

export const CollapseForm: React.FC<CollapseFormProps> = ({ setUserInputData, userInputData, layout }) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'collapse')[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: prev.blocks.map((block: Section, i: number) => 
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const handleBlockSettingChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: prev.blocks.map((block: Section, i: number) => 
        i === index ? { 
          ...block, 
          setting: { ...block.setting, [field]: value }
        } : block
      )
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
      <h2 className="text-xl font-bold mb-4">Collapse Settings</h2>

      {/* Main Heading Settings */}
      <div className="mb-6">
        <h3 className=" mb-2">Main Heading</h3>
        <input
          type="text"
          value={userInputData?.blocks?.[0]?.heading ?? ''}
          onChange={(e) => handleBlockChange(0, 'heading', e.target.value)}
          className="w-full p-2 border rounded"
        />
        {/* Font Weight Controls */}

  <div>
    <label className="block mb-1">Heading Font Weight</label>
    <select
      name="headingFontWeight"
      value={userInputData?.setting?.headingFontWeight?.toLocaleString() ?? 'normal'}
      onChange={()=>handleSettingChange}
      className="w-full p-2 border rounded"
    >
      <option value="normal">Normal</option>
      <option value="bold">Bold</option>
      <option value="lighter">Lighter</option>
      <option value="bolder">Bolder</option>
     
    </select>
 
</div>

      </div>

      {/* Collapse Items */}
      {[1, 2, 3, 4].map((num, index) => (
        <div key={num} className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">Collapse Item {num}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Text</label>
              <input
                type="text"
                value={userInputData?.blocks?.[index]?.[`text${num}`] ?? ''}
                onChange={(e) => handleBlockChange(index, `text${num}`, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Content</label>
              <textarea
                value={userInputData?.blocks?.[index]?.[`content${num}`] ?? ''}
                onChange={(e) => handleBlockChange(index, `content${num}`, e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <ColorInput
                label={`Text Color ${num}`}
                name={`textColor${num}`}
                value={userInputData?.blocks?.[index]?.setting?.[`textColor${num}`] ?? '#000000'}
                onChange={(e) => handleBlockSettingChange(index, `textColor${num}`, e.target.value)}
              />
              <ColorInput
                label={`Content Color ${num}`}
                name={`contentColor${num}`}
                value={userInputData?.blocks?.[index]?.setting?.[`contentColor${num}`] ?? '#000000'}
                onChange={(e) => handleBlockSettingChange(index, `contentColor${num}`, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Global Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Global Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="Background Color"
            name="background"
            value={userInputData?.setting?.background?.toLocaleString() ?? '#672f93'}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="Heading Color"
            name="headingColor"
            value={userInputData?.setting?.headingColor?.toLocaleString() ?? '#ffffff'}
            onChange={handleSettingChange}
          />
        </div>

        {/* Spacing Settings */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].map((spacing) => (
            <div key={spacing}>
              <label className="block mb-1">{spacing.charAt(0).toUpperCase() + spacing.slice(1)}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={userInputData?.setting?.[spacing as keyof object] ?? '0'}
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
