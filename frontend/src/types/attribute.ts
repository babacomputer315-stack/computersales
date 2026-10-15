import AttributeValue from "./attributeValue";

export default interface Attribute {
  id: number;
  name: string;
  slug: string;
  values: AttributeValue[];
  createdAt: string;
  updatedAt: string;
}
