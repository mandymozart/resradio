import { useAllPrismicDocumentsByType } from "@prismicio/react"
import React from "react"

const EventList = () => {
    const [documents] = useAllPrismicDocumentsByType('event')
    return (
        <>{JSON.stringify(documents)}</>
    )
}
export default EventList;