import styled from "@emotion/styled";
import React, { useState } from "react";
import AccordionItem from "./AcordionItem";

const Container = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const Accordion = ({ defaultIndex, onItemClick, children }) => {

  const [bindIndex, setBindIndex] = useState(defaultIndex);

  const changeItem = itemIndex => {
    if (typeof onItemClick === 'function') onItemClick(itemIndex);
    if (itemIndex !== bindIndex) setBindIndex(itemIndex);
  };
  const items = children.filter(item => item.type.name === 'AccordionItem');
  return (<Container>
    {items.map(({ props }) => (
      <AccordionItem
        key={`accordion-item-${props.index}`}
        isCollapsed={bindIndex !== props.index}
        label={props.label}
        handleClick={() => changeItem(props.index)}
        children={props.children}
      />
    ))}
  </Container>)
}

export default Accordion;