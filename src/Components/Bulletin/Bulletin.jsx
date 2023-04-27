import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import _ from "lodash";
import React from "react";
import { GetBulletinsQuery } from "../../Queries/bulletins";
import cherry from "../../images/cherry.png";
import SectionLoader from "../SectionLoader";
import Announcement from "./Announcement";

const Container = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    img {
        transform: scale(0.5);
    }

`

const Cherry = () => {
    return (
        <img src={cherry} />
    )
}

const Bulletin = ({ bulletin }) => {
    return (<>
        <a href={bulletin.link.url} target={bulletin.link.target}>
            <img src={bulletin.image.url} alt={bulletin.image.alt} />
        </a>
    </>)
}

const Bulletins = () => {
    const { loading, error, data } = useQuery(GetBulletinsQuery)

    if (loading) return <SectionLoader />
    if (error) return <>{error.message}</>
    if (!data) return <></>
    const getList = () => {
        let list = []
        data.allBulletins.edges.forEach((node) => {
            console.log(node)
            list.push({
                key: node.node._meta.id,
                component: <Bulletin bulletin={node.node} />
            })
        })
        list.push({
            key: "announcement",
            component: <Announcement />
        })
        return _.shuffle(list)
    }

    return (
        <Container>
            {getList().map((item) => item.component)}
        </Container>
    )
}

export default Bulletins;