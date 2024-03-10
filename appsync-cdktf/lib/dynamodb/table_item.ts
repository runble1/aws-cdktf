// lib/dynamodb-table-item-construct.ts
import { DynamodbTableItem } from "@cdktf/provider-aws/lib/dynamodb-table-item";
import { Construct } from "constructs";

export interface DynamoDbTableItemProps {
  tableName: string;
  hashKey: string;
  rangeKey: string;
}

export class DynamoDbTableItem extends Construct {
  constructor(scope: Construct, id: string, props: DynamoDbTableItemProps) {
    super(scope, id);

    new DynamodbTableItem(this, 'DynamoDbItem', {
      tableName: props.tableName,
      hashKey: "ProductID",
      rangeKey: "CheckDate",
      item: JSON.stringify({
        "ProductID": { "S": "EXAMPLE123" },
        "CheckDate": { "S": "2023-02-18" },
        "Price": { "N": "100" },
        "PreviousPrice": { "N": "95" },
        "PriceChange": { "N": "5" },
        "Title": { "S": "Example Product Title" },
        "URL": { "S": "https://www.amazon.com/dp/EXAMPLE123" }
      }),
    });
  }
}
