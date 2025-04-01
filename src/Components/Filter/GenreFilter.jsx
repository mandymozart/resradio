import styled from "@emotion/styled";
import useSWR from "swr";
import SectionLoader from "../SectionLoader";
import Genre from "./Genre";

const Container = styled.div`
margin-bottom: 1.5rem;
`;

const GenreFilter = () => {
    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { loading, error, data } = useSWR("https://resradio.cdn.prismic.io/api/tags", fetcher)

    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    return (
        <Container>
            {data?.sort().map(genre =>
                <Genre key={genre}
                    genre={genre}
                />
            )}
        </Container>
    )
}

export default GenreFilter
