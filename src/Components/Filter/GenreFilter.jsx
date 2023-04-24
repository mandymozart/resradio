import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Select from 'react-select';
import { GetTagsQuery } from "../../Queries/tags";
import useFilterStore from "../../Stores/FilterStore";
import SectionLoader from "../SectionLoader";
import Genre from "./Genre";

const Container = styled.div`
`;

export const GenreFilter = ({ id }) => {
    const { loading, error, data } = useQuery(GetTagsQuery, { variables: { categoryId: id } })


    const { genres, setGenres } = useFilterStore();

    function handleSelect(data) {
        setGenres(data);
    }


    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const genresOptions = data.allTags.edges.map((tag) => {
        console.log(tag)
        return { value: tag.node._meta.id, name: tag.node.name, description: tag.node.description }
    })
    const tagOptions = data.allTags.edges.map((tag) => {
        console.log(tag)
        return { value: tag.node._meta.id, label: tag.node.name }
    })
    return (
        <Container>
            {genresOptions.map(genre =>
                <Genre
                    genre={genre}
                    selected={genres.find(g => g.value === genre.value)}
                    onClick={console.log("toggle")}
                />
            )}
            <label>
                <Select isMulti
                    options={tagOptions}
                    value={genres}
                    onChange={handleSelect}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />

            </label>
        </Container>
    )
}

