import React from "react";
import styled from "styled-components";

interface BoxValues {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
}

// Styled-components for layout and styles
const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  color: #ecf0f1;
  width: 320px;
  height: 250px;
  border: 1px solid #34495e;
  border-radius: 10px;
  position: relative;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(56, 85, 156, 0.8);
`;

const Label = styled.span`
  font-size: 14px;
  color: #bdc3c7;
  position: absolute;
`;

const InputBox = styled.input`
  width: 50px;
  height: 30px;
  background: #34495e;
  border: 1px solid #95a5a6;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #ecf0f1;
  outline: none;
  border-radius: 10px;
  margin: 5px 0;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  :focus {
    border-color: #1abc9c;
  }
`;

const PaddingMarginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #34495e;
  border: 1px solid #95a5a6;
  width: 140px;
  height: 140px;
  border-radius: 10px;
  position: relative;
  margin: 20px 0;
  padding: 10px;
`;

const InputLabel = styled.div`
  position: absolute;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ecf0f1;
  text-align: center;
`;

const MarginPaddingEditor: React.FC<MarginPaddingEditorProps> = ({
  margin,
  padding,
  onChange,
}) => {
  const handleChange = (
    type: "margin" | "padding",
    side: "top" | "bottom" | "left" | "right",
    value: string
  ) => {
    const numericValue = parseFloat(value) || 0; // Ensure numeric input
    onChange(type, {
      ...[margin, padding][type === "margin" ? 0 : 1],
      [side]: numericValue,
    });
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
          style={{ position: "absolute", top: "-30px", left: "31%" }}
        />

        {/* Padding Inputs */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Top Padding */}
          <InputBox
            type="number"
            value={padding.top || 0}
            onChange={(e) => handleChange("padding", "top", e.target.value)}
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Bottom Padding */}
          <InputBox
            type="number"
            value={padding.bottom || 0}
            onChange={(e) => handleChange("padding", "bottom", e.target.value)}
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Left Padding */}
          <InputBox
            type="number"
            value={padding.left || 0}
            onChange={(e) => handleChange("padding", "left", e.target.value)}
            style={{
              position: "absolute",
              left: "-30px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />

          {/* Right Padding */}
          <InputBox
            type="number"
            value={padding.right || 0}
            onChange={(e) => handleChange("padding", "right", e.target.value)}
            style={{
              position: "absolute",
              right: "-30px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
        {/* Margin Bottom Input */}
        <InputBox
          type="number"
          value={margin.bottom || 0}
          onChange={(e) => handleChange("margin", "bottom", e.target.value)}
          style={{ position: "absolute", bottom: "-30px", left: "31%" }}
        />
      </PaddingMarginBox>
      <Label style={{ bottom: "110px"  , color:"yellow"}}>PADDING</Label>
    </EditorWrapper>
  );
};

export default MarginPaddingEditor;
