import styled from "@emotion/styled";
import { useRef, useState } from "react";
import Arrow from "../../images/Arrow";

const Container = styled.li`
    border-bottom: 1px solid var(--color);

  
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
  
  .answer {
    color: var(--background);
  }
  
  /* activate toggle */
  &.active  {
      > button {
        
      }
      .answer_wrapper {
        overflow: visible;
      }
  } 
  .answer_wrapper {
    height: 0;
    overflow: hidden;
    transition: height ease 0.2s;
  }
  `

const AccordionItem = ({ title, children }) => {

    const [clicked, setClicked] = useState(false);
    const contentEl = useRef();

    const handleToggle = () => {
        setClicked((prev) => !prev);
    };

    return (
        <Container className={`accordion_item ${clicked ? "active" : ""}`}>
            <button onClick={handleToggle}>
                {title}
                <Arrow flipped={!clicked} />
            </button>
            <div
                ref={contentEl}
                className="answer_wrapper"
                style={
                    clicked
                        ? { height: contentEl.current.scrollHeight }
                        : { height: "0px" }
                }
            >
                <div className="answer">{children}</div>
            </div>
        </Container>
    );
};

export default AccordionItem;
