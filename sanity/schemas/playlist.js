export default {
  name: "playlist",
  title: "Playlist",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "url",
      title: "Url",
      type: "string",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "online" },
          { title: "Offline", value: "offline" },
        ],
      },
    },
    {
      name: "belongsTo",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "belongsTo.email",
    },
  },
};
