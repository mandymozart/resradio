import { usePrismicDocumentByUID } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import Loader from "../Loader";
import TeaserImage from "../TeaserImage/TeaserImage";

const BroadcastSliceItem = ({ uid }) => {
  const [isHovered, setHovered] = useState(false);
  const [document, { state, error }] = usePrismicDocumentByUID(
    "broadcasts",
    uid,
    {
      fetchLinks: "shows.title",
    }
  );
  useEffect(() => {
    // console.log(document, uid);
  }, [document]);
  if (state === "loading") return <Loader />;
  else if (state === "failed") return <></>;
  else if (state === "loaded")
    return (
      <FadeIn>
        <ItemContainer
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link
            to={document.url}
            className={clsx("image", { rotate: isHovered })}
          >
            <TeaserImage image={document.data.image} />
          </Link>
          <div className="meta">
            <Link to={document.url}>
              <h4>{document.data.title}</h4>
            </Link>
            by{" "}
            <Link to={document.data.hostedby.url}>
              {document.data.hostedby.data.title}
            </Link>
            <p>
              {dayjs(document.data.begin).format("ddd, MMM D, YYYY HH:mm")}{" "}
              &mdash; {dayjs(document.data.end).format("HH:mm")}
            </p>
          </div>
        </ItemContainer>
      </FadeIn>
    );
  return <></>;
};
export default BroadcastSliceItem;
