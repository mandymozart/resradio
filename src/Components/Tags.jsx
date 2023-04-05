import styled from "@emotion/styled";
import React from "react";
import Tag from "./Tag";

const Container = styled.div`
font-size: 1rem;
text-align: right;
`;

const Tags = ({ tags }) => {
  if (tags?.length < 1) return <></>;
  return (
    <Container>
      {tags.map((tag, index) => {
        if (!tag?.tag) return <span key={"tag" + index}></span>
        return (
          <span key={"tag" + index}>
            <Tag>{tag.tag.name}</Tag>{" "}
          </span>
        )
      })}
    </Container>
  );
};

export default Tags;
