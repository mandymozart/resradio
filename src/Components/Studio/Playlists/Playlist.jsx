import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getPlaylistQuery } from "../../../Queries/playlists";
import { BREAKPOINT_XS } from "../../../config";
import KeyFieldParagraph from "../../KeyFieldParagraph";
import SectionLoader from "../../SectionLoader";
import ThumbnailImage from '../../TeaserImage/ThumbnailImage';
import StudioPlayer from "../StudioPlayer/StudioPlayerReloaded";
dayjs.extend(localizedFormat);

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 1rem;
    h4 {
        margin: 0;
        margin-top: 1rem;
    }
    .meta{ 
        font-size: 1rem;
    }
`

const Description = styled.section`
  font-size: 1.5rem;
  margin-top: 3rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
    padding: 1rem;
    margin-top: 1rem;
  }
  gap: 2rem;
`;

const Playlist = () => {

    const { uid } = useParams();

    const { loading, error, data } = useQuery(getPlaylistQuery, { variables: { uid: uid } });
    const [broadcasts, setBroadcasts] = useState();
    const [faultyBroadcasts, setFaultyBroadcasts] = useState();


    useEffect(() => {
        // init Player
        if (data) {
            const valid = data.allPlaylists.edges[0].node.broadcasts.filter(i => i.broadcast.audio?.includes(".mp3")).filter(i => i.broadcast.duration || i.broadcast.length);
            const faulty = data.allPlaylists.edges[0].node.broadcasts.filter(i => !i.broadcast.audio?.includes(".mp3")).filter(i => !i.broadcast.duration || !i.broadcast.length);
            setBroadcasts(valid)
            setFaultyBroadcasts(faulty)
            console.log("These broadcasts were faulty and ommited from the list:", faulty);
        }
    }, [data])


    if (loading || !broadcasts) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const playlist = data.allPlaylists.edges[0].node;
    return (
        <Container>
            <div>
                <ThumbnailImage image={playlist.image.thumbnail ? playlist.image.thumbnail : playlist.image} />
            </div>
            <div>
                <h4>{playlist.title}</h4>
                <div className="meta">
                    {broadcasts.length} Broadcasts {faultyBroadcasts.length > 0 && (<>/ This list contains {faultyBroadcasts.length} misconfigured Broadcasts</>)}
                </div>
                <Description>
                    {playlist.description ? (
                        <KeyFieldParagraph text={playlist.description} />
                    ) : (
                        <div></div>
                    )}
                </Description>

            </div>
            <div>
                <StudioPlayer broadcasts={broadcasts} setBroadcasts={setBroadcasts} />
            </div>
        </Container>
    )
}

export default Playlist;