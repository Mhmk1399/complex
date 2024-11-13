import React, { useEffect } from 'react';
import { Compiler } from '../compiler';
import { Layout,Section,Link } from '@/lib/types';
interface HeaderFormProps {
  layout: Layout;
  setUserInputData: React.Dispatch<React.SetStateAction<Section>>;
  userInputData: Section;
}



export const HeaderForm: React.FC<HeaderFormProps> = ({ setUserInputData, userInputData ,layout }) => {

  // Add default values to prevent undefined values
  const defaultValues = {
    blocks: {
      imageLogo: '',
      imageAlt: '',
      setting: {
        titleColor: '#000000',
        backgroundColorNavbar: '#ffffff',
        itemColor: '#000000',
        itemHoverColor: '#000000',
        itemFontSize: '16',
        imageWidth: '100',
        imageHeight: '100'
      },
      links: []
    },
    setting: {
      paddingTop: '0',
      paddingBottom: '0',
      marginBottom: '0'
    }
  };

  // Modify the useEffect to include default values
  

  const [isDataReady, setIsDataReady] = React.useState(false);

  useEffect(() => {
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, 'sectionHeader')
    };
    setUserInputData(initialData);
    setIsDataReady(true);
  }, []);

  if (!isDataReady) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }

  // First, add this helper function at the top with the other interfaces
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
          className="border  p-0.5 rounded-full"
        />
        
        
      </div>
    </>
  );


  const handleLinkSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;

    const newLink = {
      name: selectedUrl === '/' ? 'Home' :
        selectedUrl.charAt(1).toUpperCase() + selectedUrl.slice(2),
      url: selectedUrl
    };

    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: [...prev.blocks.links, newLink]
      }
    }));
  };

  const linkOptions = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Blog', url: '/blog' },
    { name: 'Shop', url: '/shop' },
    { name: 'Login', url: '/login' }
  ];
  const removeLink = (urlToRemove: string) => {
    setUserInputData((prev: Section) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: prev.blocks.links.filter((link: Link) => link.url !== urlToRemove)
      }
    }));
  };
  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="p-2">
      <hr className='my-3' />

      <h2 className="text-xl font-bold mb-4">Header Settings</h2>

      {/* Basic Information */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Basic Information</h3>

        <label className="block mb-1" htmlFor="imageLogo">Logo URL</label>
        <input
          type="text"
          id="imageLogo"
          name="imageLogo"
          value={userInputData?.blocks?.imageLogo || ''}
          onChange={handleBlockChange}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block " htmlFor="imageAlt">Image Alt Text</label>
        <input
          type="text"
          id="imageAlt"
          name="imageAlt"
          value={userInputData?.blocks?.imageAlt}
          onChange={handleBlockChange}
            className="w-full p-2 border rounded"
        />
      </div>
<hr className='my-3' />
      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Style Settings</h3>
        <div className="grid md:grid-cols-2 grid-cols-2 gap-2">
          
            <ColorInput
              label="Title Color"
              name="titleColor"
              value={userInputData?.blocks?.setting?.titleColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />

            <ColorInput 
            
              label="Background Color Navbar"
              name="backgroundColorNavbar"
              value={userInputData?.blocks?.setting?.backgroundColorNavbar?.toLocaleString() }
              onChange={handleBlockSettingChange}
            />

            <ColorInput
              label="Item Color"
              name="itemColor"
              value={userInputData?.blocks?.setting.itemColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />

            <ColorInput
              label="Item Hover Color"
              name="itemHoverColor"
              value={userInputData?.blocks?.setting.itemHoverColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
          

          <label className="block mb-1" htmlFor="titleFontSize">Title Font Size</label>
          <input
            type="range"
            id="itemFontSize"
            name="itemFontSize"
            value={userInputData?.blocks?.setting?.itemFontSize?.toLocaleString()}
            onChange={handleBlockSettingChange}
            className="p-2 border rounded"
          />

          <label className="block mb-1" htmlFor="imageWidth">Image Width</label>
          <input
            type="range"
            id="imageWidth"
            name="imageWidth"
            value={userInputData?.blocks?.setting?.imageWidth?.toLocaleString()}
            onChange={handleBlockSettingChange}
            className="p-2 border rounded"
          />

          <label className="block mb-1" htmlFor="imageHeight">Image Height</label>
          <input
            type="range"
            id="imageHeight"
            name="imageHeight"
            value={userInputData?.blocks?.setting.imageHeight?.toLocaleString()}
            onChange={handleBlockSettingChange}
            className="p-2 border rounded"
          />
        </div>
      </div>
      <hr className='my-3' />

      {/* Layout Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Layout Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-1" htmlFor="paddingTop">Padding Top</label>
          <input
            type="range"
            id="paddingTop"
            name="paddingTop"
            value={userInputData?.setting?.paddingTop}
            onChange={handleSettingChange}
            className="p-2 border rounded"
          />
          <label className="block mb-1" htmlFor="paddingTop">marginBottom </label>
          <input
            type="range"
            id="marginBottom"
            name="marginBottom"
            value={userInputData?.setting?.marginBottom}
            onChange={handleSettingChange}
            className="p-2 border rounded"
          />

          <label className="block mb-1" htmlFor="paddingBottom">Padding Bottom</label>
          <input
            type="range"
            id="paddingBottom"
            name="paddingBottom"
            value={userInputData?.setting?.paddingBottom}
            onChange={handleSettingChange}
            className="p-2 border rounded"
          />

          
        </div>
      </div>
      <hr className='my-3' />

      {/* Navigation Links */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Navigation Links</h3>
        <label className="block mb-1" htmlFor="linkSelect">Select a link</label>
        <select
          id="linkSelect"
          onChange={handleLinkSelect}
          className='w-full p-2 border rounded mb-4'
          defaultValue=""
        >
          <option value="">Select a link</option>
          {linkOptions?.map((link, index) => (
            <option key={`${link.url}-${index}`} value={link.url}>
              {link.name}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          {userInputData?.blocks?.links?.map((link: Link, index: number) => (
            <div key={`${link.url}-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{link.name} - {link.url}</span>
              <button
                onClick={() => removeLink(link.url)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
