import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../../Hooks/useDebounce.";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import ClearSmall from "../../images/ClearSmall";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import InlineLoader from "../InlineLoader";

const Container = styled.div`
    position: fixed;
    right: 0;
    bottom: 0;
    width: 50vw;
    height: 6rem;
    background: var(--grey);
    .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
`;

const Player = styled.div`
  display: flex;
    align-items: center;
    height: 6rem;
    padding: 0 2rem 2rem 0 0;
  h3 {
    font-size: 1rem;
    font-family: var(--font-bold);
    margin-bottom: 0; 
    text-transform: none;
  }
  font-size: 1.5rem;
  button {
    background: none;
    border: none;
    padding: 0;
    width: 6rem;
    cursor: pointer;
    margin: 0;
    svg {
        height: 3rem;
    }
    &:hover{
      color: var(--second);
    }
  }
  .left {
    display: flex;
    align-items: center; 
  }
  .info {
    flex: 1;
    font-size: 1rem;
  }
  .image {
    text-align: right;
    img {
        width: 4rem;
        height: 4rem;
        margin-right: 2rem;
    }
  }

`

export const getBroadcastQuery = gql`
${GetBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`
const BroadcastPlayer = () => {
    const { playing, setPlaying, isPlaying, setIsPlaying } = useBroadcastStore()

    const [getData, { loading, error, data }] = useLazyQuery(
        getBroadcastQuery, {
        variables: {
            uid: playing
        }
    });

    const debouncedRequest = useDebounce(() => {
        console.log("got request")
        if (playing !== undefined)
            getData()
    });

    useEffect(() => {
        const unsub = useBroadcastStore.subscribe(debouncedRequest)
    }, [])


    const play = () => {
        setIsPlaying(true)
    }
    const pause = () => {
        setIsPlaying(false)
    }

    const close = () => {
        pause()
        setPlaying(undefined)
    }

    if (loading) return <Container><InlineLoader /></Container>
    if (error) return <Container><InlineLoader /></Container>
    if (!playing) return <></>
    const broadcast = data?.allBroadcastss?.edges[0]?.node
    if (broadcast)
        return (
            <Container>
                <Player>

                    {isPlaying ? (<button onClick={() => pause()}>
                        <PauseBig />
                    </button>) : (
                        <button onClick={() => play()}>
                            <PlayBig />
                        </button>
                    )}
                    <div className="info">
                        <Link to={"../broadcasts/" + broadcast._meta.uid}>
                            <h3>{broadcast.hostedby.title}</h3>
                            <div>{broadcast.title}</div>
                        </Link>
                    </div>
                    {/* <div className="image">
                        <ThumbnailImage image={broadcast.image.thumbnail} />
                    </div> */}
                </Player>
                <div className="close" onClick={() => close()}>
                    <ClearSmall />
                </div>
            </Container>
        );
};

export default BroadcastPlayer;
