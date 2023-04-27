import styled from "@emotion/styled";
import { Accordion, } from '@szhsin/react-accordion';
import AccordionItem from "../Accordion/AcordionItem";
import TempoRangeSlider from "../RangeSlider/TempoRangeSlider";
import FilterSummary from "./FilterSummary";
import GenreFilter from "./GenreFilter";
import MoodFilter from "./MoodFilter";

const Container = styled.div`
margin-bottom: 2rem;
/* .szh-accordion__item {
    border-bottom: 2px solid var(--color);
    padding: 0 2rem;

}
  .szh-accordion__item-heading button {
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
   */
`;

const FilterForm = () => {
    return (
        <Container>
            <Accordion>
                <AccordionItem header="Mood">
                    <MoodFilter />
                </AccordionItem>
                <AccordionItem header="Genre">
                    <GenreFilter />
                </AccordionItem>
                <AccordionItem header="Tempo">
                    <TempoRangeSlider />
                </AccordionItem>
            </Accordion>
            <FilterSummary />
        </Container>
    )
}

export default FilterForm;