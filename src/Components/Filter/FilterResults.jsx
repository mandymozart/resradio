import styled from "@emotion/styled";
import FilterBroadcastList from "../Broadcasts/FilterBroadcastList";

const Container = styled.div`
  min-height: 100vh;
`;

const FilterResults = () => {
  return (
    <Container>
      <FilterBroadcastList />
    </Container>
  )
}

export default FilterResults