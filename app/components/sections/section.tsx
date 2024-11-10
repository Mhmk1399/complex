"use client";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";
interface Block {
  textHeading?: string;
}

const RichText = styled.section`
  padding-top: ${nullData.sections.children.sections[2].setting?.paddingTop};
  padding-bottom: ${nullData.sections.children.sections[2].setting
    ?.paddingBottom};
`;

const Section = () => {
  return (
    <RichText style={{ display: "flex" }}>
      <h1>
        {(nullData.sections.children.sections[2].blocks as any)?.textHeading}
      </h1>
    </RichText>
  );
};

export default Section;
