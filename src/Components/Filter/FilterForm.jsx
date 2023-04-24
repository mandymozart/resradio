import styled from "@emotion/styled";
import Accordion from "../Accordion/Accordion";
import AccordionItem from "../Accordion/AcordionItem";
import FilterSummary from "./FilterSummary";
import { GenreFilter } from "./GenreFilter";
import MoodFilter from "./MoodFilter";
import { TempoFilter } from "./TempoFilter";

const Container = styled.div`
/* background: var(--second); */
text-transform: uppercase;
color: var(--background);
label {
    > span {
        display: block;
        margin-bottom: 0.5rem;
    }
}
margin-bottom: 2rem;

.react-select__control {
    background-color: var(--second);
    border-color: var(--background);
    border: 2px solid var(--background);
    border-radius: 0;
    &:hover{
        border-color: var(--yellow);
    }
}
.react-select__menu {
    background-color: var(--second);
    border-color: var(--background);
    border: 2px solid var(--background);
    border-radius: 0;
}
.react-select__option {
    &:hover {
        background-color:var(--second) ;
        color: var(--yellow); ;
    }
}
.react-select__value-container {
    padding: .5rem;
    gap: .5rem;
    font-size: 1.25rem;
}
.react-select__input-container {
    padding: 0 .5rem;
}
.react-select__input {
        color: var(--background) !important;

}

.react-select__multi-value__label {
    background: var(--background);
    color: var(--second);
    font-size: 1rem;
    font-family: var(--font-bold);
    padding: 0 0 0 1rem;
    line-height: 2rem;
    border-radius: 0;
    margin: 0;
    
}
.react-select__multi-value__remove {
    background: var(--background);
    color: var(--second);
    border-radius: 0;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg {

    }
    &:hover {
        color: var(--red);
        background: var(--background);
    }
}
.react-select__indicator {
    svg {
        width: 2rem;
        margin: 0;
        padding: 0;
        height: 1.25rem;
        color: var(--background);
        &:hover{
        color: var(--yellow);
    }
        display: inline-block;
        path {
            display: inline-block;
        }
    }
}
.react-select__dropdown-indicator {
    
}
`;

const categorys = {
    mood: "ZBmvZBYAAC8AXkGa", tempo: "ZBmvlRYAADMAXkID", genre: "ZBmvrxYAAC0AXkI3"
}
const FilterForm = () => {


    return (
        <Container>
            <Accordion onItemClick={console.log}>
                <AccordionItem label="Mood" index="1">
                    <MoodFilter id={categorys.mood} />
                </AccordionItem>
                <AccordionItem label="Genre" index="2">
                    <GenreFilter id={categorys.genre} />
                </AccordionItem>
                <AccordionItem label="Tempo" index="3">
                    <TempoFilter id={categorys.tempo} />
                </AccordionItem>
            </Accordion>
            <FilterSummary />
        </Container>
    )
}

export default FilterForm;