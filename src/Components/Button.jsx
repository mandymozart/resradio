import styled from "@emotion/styled";
import React from "react";

const Container = styled.button`
  display: inline-flex;
  text-align: center;
  align-items: center;
  border: 1px solid ${(props) => (props.ghost ? "transparent" : "var(--color)")};
  color: ${(props) => (props.active ? "var(--background)" : "var(--color)")};
  background: ${(props) => (props.ghost ? "transparent" : "var(--background)")};
  padding: ${(props) => (props.hasIcon ? "0" : "0 1rem")};
  line-height: ${props => props.large ? "3rem" : "1.5rem"};
  font-family: var(--font-light);
  font-weight: 400;
  letter-spacing: 0.05rem;
  font-size: 1.2rem;
  ${props => props.large && "padding: 0 2rem;"}
  cursor: pointer;
  &:hover {
    color: var(--second);
    border-color: ${(props) => (props.ghost ? "transparent" : "var(--second)")};
    background: transparent;
  }
`;

const Button = ({ active, large, hasIcon, ghost, children, ...props }) => {
  return (
    <Container active={active} large={large} hasIcon={hasIcon} ghost={ghost} {...props}>
      {children}
    </Container>
  );
};

export default Button;
