import React, { useEffect, useState } from 'react';

interface RichTextData {
  type: string;
  blocks: {
    textHeading: string;
    description: string;
    btnText: string;
    btnLink: string;
    setting: {
      textHeadingColor: string;
      textHeadingFontSize: string;
      textHeadingFontWeight: string;
      descriptionColor: string;
      descriptionFontSize: string;
      descriptionFontWeight: string;
      btnTextColor: string;
      btnBackgroundColor: string;
      allTextPosition: string;
      textAlignmentBoxDesktop: string;
      textAlignmentBoxMobile: string;
    };
  };
  setting: {
    paddingTop: string;
    paddingBottom: string;
    marginTop: string;
    marginBottom: string;
  };
}

export const RichText = () => {
  const [formData, setFormData] = useState<RichTextData>({
    type: 'rich-text',
    blocks: {
      textHeading: '',
      description: '',
      btnText: '',
      btnLink: '',
      setting: {
        textHeadingColor: '#333',
        textHeadingFontSize: '20px',
        textHeadingFontWeight: 'bold',
        descriptionColor: '#333',
        descriptionFontSize: '16px',
        descriptionFontWeight: 'normal',
        btnTextColor: '#fff',
        btnBackgroundColor: '#333',
        allTextPosition: 'center',
        textAlignmentBoxDesktop: 'center',
        textAlignmentBoxMobile: 'center'
      }
    },
    setting: {
      paddingTop: '20px',
      paddingBottom: '20px',
      marginTop: '0px',
      marginBottom: '0px'
    }
  });

  const handleChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof RichTextData] as Record<string, unknown>,
        [field]: value
      }
    }));
  };

  const handleSettingChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [field]: value
        }
      }
    }));
  };
  useEffect(() => {
    
  console.log(formData);
  
    
  }, [formData])
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form className="space-y-6">
        {/* Content Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Content</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium">Heading</label>
              <input
                type="text"
                value={formData.blocks.textHeading}
                onChange={(e) => handleChange('blocks', 'textHeading', e.target.value)}
                className="mt-1 block w-full rounded-md border shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={formData.blocks.description}
                onChange={(e) => handleChange('blocks', 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border shadow-sm p-2"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Button Text</label>
              <input
                type="text"
                value={formData.blocks.btnText}
                onChange={(e) => handleChange('blocks', 'btnText', e.target.value)}
                className="mt-1 block w-full rounded-md border shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Button Link</label>
              <input
                type="text"
                value={formData.blocks.btnLink}
                onChange={(e) => handleChange('blocks', 'btnLink', e.target.value)}
                className="mt-1 block w-full rounded-md border shadow-sm"
              />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium">Heading Font Size</label>
              <input
                type="range"
                value={formData.blocks.setting.textHeadingFontSize}
                onChange={(e) => handleSettingChange('blocks', 'textHeadingFontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border shadow-sm"
              />
            </div>
        </div>

        {/* Style Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Style Settings</h2>
          <div className="flex flex-wrap gap-4">
            <div className='rounded-full'>
              <label className="block text-sm font-medium">Heading Color</label>
              <input
                type="color"
                value={formData.blocks.setting.textHeadingColor}
                onChange={(e) => handleSettingChange('blocks', 'textHeadingColor', e.target.value)}
                className="mt-1 w-8 rounded-full"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium">Description Color</label>
              <input
                type="color"
                value={formData.blocks.setting.descriptionColor}
                onChange={(e) => handleSettingChange('blocks', 'descriptionColor', e.target.value)}
                className="mt-1 w-8 rounded-full"              />
            </div>
            <div>
              <label className="block text-sm font-medium">Button Background Color</label>
              <input
                type="color"
                value={formData.blocks.setting.btnBackgroundColor}
                onChange={(e) => handleSettingChange('blocks', 'btnBackgroundColor', e.target.value)}
                className="mt-1 w-8 rounded-full"              />
            </div>
          </div>
        </div>

        {/* Spacing Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Spacing</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">Padding Top</label>
              <input
                type="range"
                value={formData.setting.paddingTop}
                onChange={(e) => handleChange('setting', 'paddingTop', e.target.value)}
                className="mt-1 block w-full rounded-md "
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Padding Bottom</label>
              <input
                type="range"
                value={formData.setting.paddingBottom}
                onChange={(e) => handleChange('setting', 'paddingBottom', e.target.value)}
                className="mt-1 block w-full rounded-md "
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Margin Top</label>
              <input
                type="range"
                value={formData.setting.marginTop}
                onChange={(e) => handleChange('setting', 'marginTop', e.target.value)}
                className="mt-1 block w-full rounded-md "
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Margin Bottom</label>
              <input
                type="range"
                value={formData.setting.marginBottom}
                onChange={(e) => handleChange('setting', 'marginBottom', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">allTextPosition</label>
              <select name="" id="" className='w-full border rounded-lg p-1' onChange={(e) => handleChange('setting', 'allTextPosition', e.target.value)}>
                <option value="center">center</option>
                <option value="left">left</option>
                <option value="right">right</option>

              </select>
            </div>
          </div>
        </div>

       
      </form>
    </div>
  );
};
