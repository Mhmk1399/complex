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

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 340px;
  height: 220px;
  position: relative;
`;

const Label = styled.span`
  font-size: 13px;
  color: #777;
  font-weight: 500;
  position: absolute;
`;

const InputBox = styled.input`
  width: 48px;
  height: 28px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  outline: none;
  border-radius: 6px;
  margin: 5px 0;
  transition: 0.2s ease;

  :focus {
    border-color: #3498db;
    box-shadow: 0 0 4px rgba(52, 152, 219, 0.4);
  }
`;

const PaddingMarginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  position: relative;
  margin: 20px 0;
  padding: 10px;
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
    const numericValue = parseFloat(value) || 0;
    onChange(type, {
      ...[margin, padding][type === "margin" ? 0 : 1],
      [side]: numericValue,
    });
  };

  return (
    <EditorWrapper className="bg-white rounded-lg">
      <Label style={{ top: "5px", color: "#000", right: "9px" }}>
        فاصله خارجی
      </Label>
      <PaddingMarginBox className="bg-white">
        <InputBox
          type="number"
          value={margin.top || 0}
          onChange={(e) => handleChange("margin", "top", e.target.value)}
          style={{
            position: "absolute",
            top: "-30px",
            left: "33%",
            color: "#000",
          }}
        />
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <InputBox
            type="number"
            value={padding.top || 0}
            onChange={(e) => handleChange("padding", "top", e.target.value)}
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#fff ",
            }}
          />
          <InputBox
            type="number"
            value={padding.bottom || 0}
            onChange={(e) => handleChange("padding", "bottom", e.target.value)}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <InputBox
            type="number"
            value={padding.left || 0}
            onChange={(e) => handleChange("padding", "left", e.target.value)}
            style={{
              position: "absolute",
              left: "-34px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <InputBox
            type="number"
            value={padding.right || 0}
            onChange={(e) => handleChange("padding", "right", e.target.value)}
            style={{
              position: "absolute",
              right: "-34px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
        <InputBox
          type="number"
          value={margin.bottom || 0}
          onChange={(e) => handleChange("margin", "bottom", e.target.value)}
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "33%",
            color: "#000",
          }}
        />
      </PaddingMarginBox>
      <Label style={{ bottom: "100px", color: "#000" }}>فاصله داخلی</Label>
    </EditorWrapper>
  );
};

export default MarginPaddingEditor;
