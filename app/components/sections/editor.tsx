import React from "react";
import styled from "styled-components";

// Styled-components for layout and styles
const EditorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  color: #fff;
  width: 300px;
  height: 200px;
  border: 1px solid #444;
  border-radius: 10px;
  position: relative;
`;

const Label = styled.span`
  font-size: 12px;
  color: #aaa;
  position: absolute;
`;

const InputBox = styled.input`
  width: 50px;
  height: 25px;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #00bcd4;
  outline: none;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PaddingMarginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #222;
  border: 1px solid #444;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  position: relative;
`;

const InputLabel = styled.div`
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
`;

// Type definitions for props and state
interface BoxValues {
  top: number;
  bottom: number;
}

interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
}

const MarginPaddingEditor: React.FC<MarginPaddingEditorProps> = ({
  margin,
  padding,
  onChange,
}) => {
  const handleChange = (
    type: "margin" | "padding",
    side: "top" | "bottom",
    value: string
  ) => {
    const numericValue = parseFloat(value) || 0; // Ensure numeric input
    onChange(type, { ...[margin, padding][type === "margin" ? 0 : 1], [side]: numericValue });
  };

  return (
    <EditorWrapper>
      <Label style={{ top: "5px" }}>MARGIN</Label>
      <PaddingMarginBox>
        {/* Margin Top Input */}
        <InputBox
          type="number"
          value={margin.top || 0}
          onChange={(e) => handleChange("margin", "top", e.target.value)}
          style={{ position: "absolute", top: "-30px" , left: "17%" }}
        />

        {/* Padding Inputs */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <InputBox
            type="number"
            value={padding.top || 0}
            onChange={(e) => handleChange("padding", "top", e.target.value)}
            style={{ marginBottom: "10px" , marginLeft: "-31%" }}
          />
          <InputBox
            type="number"
            value={padding.bottom || 0}
            onChange={(e) => handleChange("padding", "bottom", e.target.value)}
            style={{ marginTop: "10px" , marginLeft: "-31%" }}
          />
        </div>

        {/* Margin Bottom Input */}
        <InputBox
          type="number"
          value={margin.bottom || 0}
          onChange={(e) => handleChange("margin", "bottom", e.target.value)}
          style={{ position: "absolute", bottom: "-30px" , left: "17%" }}
        />
      </PaddingMarginBox>
      <Label style={{ bottom: "90px" }}>PADDING</Label>
    </EditorWrapper>
  );
};
export default MarginPaddingEditor;
