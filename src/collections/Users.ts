import type { Access, CollectionConfig } from "payload"

const isSelf: Access = ({ req }) => {
  if (req.user?.collection !== "users") return false

  return {
    id: {
      equals: req.user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    create: () => true,
    delete: isSelf,
    read: isSelf,
    update: isSelf,
  },
  admin: {
    hidden: true,
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
  versions: false,
}
