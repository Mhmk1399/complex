import React from "react";
import styled from "styled-components";
import nullData from "../../../public/template/null.json";

const RichText = styled.section`
  color: ${nullData.sections.children[0].sections[2].setting?.paddingTop};
`;

const Section = () => {
  return (
    <RichText>
      <h1></h1>
    </RichText>
  );
};

export default Section;
