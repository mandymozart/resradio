import styled from "@emotion/styled";
import React from "react";
import Tag from "./Tag";

const Container = styled.div`
  font-size: 1rem;
  &.rtl {
    text-align: right;
  }
`;

const Tags = ({ tags, rtl }) => {
  if (tags?.length < 1) return <></>;
  return (
    <Container className={rtl ? "rtl" : ""}>
      {tags?.map((tag, index) => {
        if (!tag) return <span key={"tag" + index}></span>
        return (
          <span key={"tag" + index}>
            <Tag>{tag}</Tag>{" "}
          </span>
        )
      })}
    </Container>
  );
};

export default Tags;
