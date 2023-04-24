import styled from "@emotion/styled";
import { useRef } from "react";
import Arrow from "../../images/Arrow";

const Container = styled.li`
    border-bottom: 2px solid var(--color);
    padding: 0 2rem;

  
  > button {
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
  }
  
  .control {
    font-size: 20px;
  }
  
  /* activate toggle */
  
  &.active  {
      > button {
        color: var(--second);
      }
      .content {
        height: auto;
        overflow: visible;
      }
  } 
  .content {
    height: 0;
    overflow: hidden;
    transition: height ease 0.2s;
  }
  `

const AccordionItem = ({ label, isCollapsed, handleClick, children }) => {

    const contentEl = useRef();

    return (
        <Container className={isCollapsed ? "isCollapsed" : "active"}>
            <button onClick={handleClick}>
                {label}
                <Arrow flipped={isCollapsed} />
            </button>
            <div
                ref={contentEl}
                className="content"
                aria-expanded={isCollapsed}
            ><div>
                    {children}
                </div>
            </div>
        </Container>
    );
};

export default AccordionItem;
