import styled from "@emotion/styled";
import { AccordionItem as Item } from "@szhsin/react-accordion";
import Arrow from "../../images/Arrow";

const Container = styled(Item)`
  border-bottom: 2px solid var(--color);
  padding: 0 2rem;

  h3 > button {
    font-size: 1.5rem;
    font-family: var(--font-light);
    display: flex;
    background: transparent;
    padding: 0;
    margin: 0;
    line-height: 4rem;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: none;
  }`

const AccordionItem = ({ header, ...rest }) => (
  <Container
    {...rest}
    header={
      <>
        {header}
        <Arrow flipped={true} />
      </>
    }
    buttonProps={{
      className: ({ isEnter }) =>
        `${isEnter}`
    }}
  />
);

export default AccordionItem;
