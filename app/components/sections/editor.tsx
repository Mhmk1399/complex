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
  width: 100%;
  max-width: 256px;
  height: auto;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const InputBox = styled.input`
  width: 40px;
  height: 32px;
  border: 1px solid #d1d5db;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  outline: none;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.2s ease;
  position: relative;

  :hover {
    border-color: #3b82f6;
  }

  :focus {
    border-color: #3b82f6;
    box-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
  }
`;

const MarginBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px dashed #93c5fd;
  border-radius: 10px;
  background: #f8fafc;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaddingBox = styled.div`
  width: 70%;
  height: 70%;
  border: 2px solid #60a5fa;
  border-radius: 8px;
  background: #eff6ff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled.div`
  width: 35%;
  height: 35%;
  border-radius: 6px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
  border: 1px solid #cbd5e1;
`;

const SmallLabel = styled.span`
  font-size: 12px;
  color: #374151;
  font-weight: 600;
  position: absolute;
  background: #ffffff;
  padding: 0 6px;
  border-radius: 4px;
`;

const PreviewBox = styled.div<{ margin: BoxValues; padding: BoxValues }>`
  margin-top: 28px;
  width: 100%;
  max-width: 256px;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const PreviewMarginBox = styled.div<{ margin: BoxValues }>`
  margin: ${(props) =>
    `${props.margin.top}px ${props.margin.right}px ${props.margin.bottom}px ${props.margin.left}px`};
  border: 2px dashed #93c5fd;
  border-radius: 10px;
  background: #ffffff;
  padding: 8px;
`;

const PreviewPaddingBox = styled.div<{ padding: BoxValues }>`
  padding: ${(props) =>
    `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`};
  border: 2px solid #60a5fa;
  border-radius: 8px;
  background: #eff6ff;
`;

const PreviewContent = styled.div`
  background: #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
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
    let numericValue = parseFloat(value) || 0;

    // Prevent negative values for left/right margins
    if (type === "margin" && (side === "left" || side === "right")) {
      numericValue = Math.max(0, numericValue);
    }

    onChange(type, {
      ...[margin, padding][type === "margin" ? 0 : 1],
      [side]: numericValue,
    });
  };

  return (
    <EditorWrapper>
      <MarginBox>
        {/* Margin Inputs */}
        <div>
          <InputBox
            type="number"
            value={margin.top || 0}
            onChange={(e) => handleChange("margin", "top", e.target.value)}
            style={{
              position: "absolute",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div>
          <InputBox
            type="number"
            value={margin.bottom || 0}
            onChange={(e) => handleChange("margin", "bottom", e.target.value)}
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div>
          <InputBox
            type="number"
            min="0"
            value={margin.left || 0}
            onChange={(e) => handleChange("margin", "left", e.target.value)}
            style={{
              position: "absolute",
              left: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
        <div>
          <InputBox
            type="number"
            min="0"
            value={margin.right || 0}
            onChange={(e) => handleChange("margin", "right", e.target.value)}
            style={{
              position: "absolute",
              right: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>

        <PaddingBox>
          {/* Padding Inputs */}
          <div>
            <InputBox
              type="number"
              value={padding.top || 0}
              onChange={(e) => handleChange("padding", "top", e.target.value)}
              style={{
                position: "absolute",
                top: "0px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <div>
            <InputBox
              type="number"
              value={padding.bottom || 0}
              onChange={(e) =>
                handleChange("padding", "bottom", e.target.value)
              }
              style={{
                position: "absolute",
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <div>
            <InputBox
              type="number"
              value={padding.left || 0}
              onChange={(e) => handleChange("padding", "left", e.target.value)}
              style={{
                position: "absolute",
                left: "-2px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          <div>
            <InputBox
              type="number"
              value={padding.right || 0}
              onChange={(e) => handleChange("padding", "right", e.target.value)}
              style={{
                position: "absolute",
                right: "-2px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <ContentBox>باکس</ContentBox>
        </PaddingBox>
      </MarginBox>

      {/* Preview Box */}
      <PreviewBox margin={margin} padding={padding}>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">نمایش</h3>
        <PreviewMarginBox margin={margin}>
          <PreviewPaddingBox padding={padding}>
            <PreviewContent>باکس</PreviewContent>
          </PreviewPaddingBox>
        </PreviewMarginBox>
      </PreviewBox>
    </EditorWrapper>
  );
};
export default MarginPaddingEditor;
