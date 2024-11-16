import { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout, Section } from '@/lib/types';

interface VideoFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<Section>>;
  userInputData: Section;
  layout: Layout;
}

interface ExtendedBlockSetting {
  headingColor?: string;
  backgroundVideoSection?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  videoWidth?: string;
  videoRadious?: string;
  videoPoster?: string;
  videoLoop?: boolean;
  videoMute?: boolean;
  videoAutoplay?: boolean;
}

const ColorInput = ({ label, name, value, onChange }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <div className="flex flex-row gap-6 items-center"> 
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
  </>
);

export const VideoForm: React.FC<VideoFormProps> = ({ setUserInputData, userInputData, layout }) => {
  useEffect(() => {
    const initialData = Compiler(layout, 'video')[0];
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
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: inputValue
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
      <h2 className="text-xl font-bold mb-4">Video Settings</h2>

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
            <label className="block mb-1">Video URL</label>
            <input
              type="text"
              name="videoUrl"
              value={userInputData?.blocks?.videoUrl ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Video Alt Text</label>
            <input
              type="text"
              name="videoAlt"
              value={userInputData?.blocks?.videoAlt ?? ''}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className=" space-y-4">
          <ColorInput
            label="Heading Color"
            name="headingColor"
            value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.headingColor?.toString() ?? '#000000'}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="Background Color"
            name="backgroundVideoSection"
            value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.backgroundVideoSection?.toString() ?? '#e4e4e4'}
            onChange={handleBlockSettingChange}
          />

          <div>
            <label className="block mb-1">Heading Font Size</label>
            <input
              type="range"
              name="headingFontSize"
              value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.headingFontSize?.toString() ?? '30px'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Heading Font Weight</label>
            <select
              name="headingFontWeight"
              value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.headingFontWeight?.toString() ?? 'bold'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Video Width</label>
            <input
              type="range"
              name="videoWidth"
              value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoWidth?.toString() ?? '1000px'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Video Border Radius</label>
            <input
              type="range"
              name="videoRadious"
              value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoRadious?.toString() ?? '20px'}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Video Poster</label>
            <input
              type="text"
              name="videoPoster"
              value={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoPoster?.toString() ?? ''}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Video Controls */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoLoop"
              checked={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoLoop ?? true}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label>Loop</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoMute"
              checked={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoMute ?? false}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label>Mute</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoAutoplay"
              checked={(userInputData?.blocks?.setting as ExtendedBlockSetting)?.videoAutoplay ?? true}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label>Autoplay</label>
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
                value={userInputData?.setting?.[spacing as keyof typeof userInputData.setting]?.toString() ?? '0'}
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
