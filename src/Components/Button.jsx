import styled from "@emotion/styled";
import React from "react";

const Container = styled.button`
  border: 1px solid var(--color);
  border-radius: 2px;
  color: ${(props) => (props.active ? "var(--background)" : "var(--color)")};
  background: ${(props) =>
    props.active ? "var(--color)" : "var(--background)"};
  line-height: 1.5rem;
  font-family: "Scope-LightExpanded", "Courir", -apple-system,
    BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
    "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-weight: 400;
  letter-spacing: 0.05rem;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    color: var(--second);
    background: var(--color);
  }
`;

const Button = ({ active, children, ...props }) => {
  return (
    <Container active={active} {...props}>
      {children}
    </Container>
  );
};

export default Button;
