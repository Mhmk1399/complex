import { useEffect } from "react";
import { Compiler } from "../compiler";
import { ProductSection, Layout, ProductCardData } from "@/lib/types";

interface ProductListProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ProductSection>>;
  userInputData: ProductSection;
  layout: Layout;
  selectedComponent: string;
}

const ColorInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
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

export const ProductListForm: React.FC<ProductListProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const blocks = Array.isArray(userInputData.blocks)
    ? userInputData.blocks
    : [];

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, [selectedComponent]);
  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value,
      },
    }));
  };
  const handleProductChange = (index: number, field: string, value: string) => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.setting,
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Layout Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="gridColumns"
            value={userInputData.setting.gridColumns}
            onChange={handleSettingChange}
            placeholder="Grid Columns"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="backgroundColor"
            value={userInputData.setting.backgroundColor}
            onChange={handleSettingChange}
            placeholder="Background Color"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="paddingTop"
            value={userInputData.setting.paddingTop}
            onChange={handleSettingChange}
            placeholder="Padding Top"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="paddingBottom"
            value={userInputData.setting.paddingBottom}
            onChange={handleSettingChange}
            placeholder="Padding Bottom"
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        {blocks.map((product, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <h4 className="font-medium mb-2">Product {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  handleProductChange(index, "name", e.target.value)
                }
                placeholder="Product Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={product.price}
                onChange={(e) =>
                  handleProductChange(index, "price", e.target.value)
                }
                placeholder="Price"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={product.imageSrc}
                onChange={(e) =>
                  handleProductChange(index, "imageSrc", e.target.value)
                }
                placeholder="Image Source"
                className="border p-2 rounded"
              />
              <textarea
                value={product.description}
                onChange={(e) =>
                  handleProductChange(index, "description", e.target.value)
                }
                placeholder="Description"
                className="border p-2 rounded col-span-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductListForm;
