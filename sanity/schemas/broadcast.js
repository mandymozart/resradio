export default {
  name: "broadcast",
  title: "Broadcast",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "hostedBy",
      title: "Hosted by",
      type: "string"
    },
    {
      name: "prismicId",
      title: "Prismic Broadcast Id",
      type: "string"
    },
    {
      name: "begin",
      title: "Begin",
      type: "datetime",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "hostedBy",
    },
  },
};
