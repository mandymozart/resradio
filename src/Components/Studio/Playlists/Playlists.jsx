import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import React from "react";
import { GetPlaylistsQuery, PlaylistBriefFragment, PlaylistTagsFragement } from './../../../Queries/playlists';
import PlaylistItem from './PlaylistItem';

const playlistsQuery = gql`
${GetPlaylistsQuery}
${PlaylistBriefFragment}
${PlaylistTagsFragement}
`

const Container = styled.div`
h4 {
  padding: 1rem 2rem;
  margin: 0;
}
.add {
  padding: 2rem;
  text-align: center;
}
`

const Playlists = () => {

    const { loading, error, data } = useQuery(playlistsQuery);

    if (loading) return <>Loading...</>;
    if (error) return <>Error : {error.message}</>;
    return (
        <Container>
            <h4>Playlists ({data.allPlaylists.totalCount})</h4>
            <div>
                {data.allPlaylists.edges.map((item) => {
                    return (
                        <PlaylistItem playlist={item.node} key={item.node._meta.id} />
                    )
                }
                )}
            </div>
            <div className="add"><a href="http://resradio.prismic.io" target="_blank">Add Playlist</a></div>
        </Container>
    )
}

export default Playlists