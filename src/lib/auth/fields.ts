import type { DBFieldAttribute, DBFieldType } from "better-auth/db";

export type UserFields = {
  name: string;
  type: DBFieldType;
  input: boolean;
  required?: boolean;
};

export const userFields: UserFields[] = [
  {
    name: "phoneNumber",
    type: "string",
    input: true,
  },
  {
    name: "status",
    type: "string",
    input: true,
  },
  {
    name: "role",
    type: "string",
    input: true,
  },
  {
    name: "macAddress",
    type: "boolean",
    input: true,
  },
  // Add other fields here
];

export const userFieldsObject: { [key: string]: DBFieldAttribute } =
  userFields.reduce<{ [key: string]: DBFieldAttribute }>((acc, field) => {
    acc[field.name] = {
      type: field.type,
      input: field.input,
      required: field.required,
    };
    return acc;
  }, {});