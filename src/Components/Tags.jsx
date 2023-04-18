import styled from "@emotion/styled";
import React from "react";
import Tag from "./Tag";

const Container = styled.span``;

const Tags = ({ tags }) => {
  if (!tags) return <></>;
  return (
    <Container>
      {tags.map((tag, index) => (
        <span key={"tag" + index}>
          <Tag>{tag.name}</Tag>{" "}
        </span>
      ))}
    </Container>
  );
};

export default Tags;
