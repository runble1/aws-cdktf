// lib/dynamodb-table-item-construct.ts
import { DynamodbTableItem } from "@cdktf/provider-aws/lib/dynamodb-table-item";
import { Construct } from "constructs";

export class DynamoDbTableItemConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    tableName: string,
    item: { [key: string]: any },
  ) {
    super(scope, id);

    new DynamodbTableItem(this, "DynamoDbItem", {
      tableName: tableName,
      hashKey: item.hashKey, // DynamoDB テーブルのハッシュキーの属性名
      item: JSON.stringify(
        Object.entries(item).reduce((acc, [key, value]) => {
          acc[key] = { S: value }; // ここではすべての値を文字列として扱います。必要に応じて型を調整してください。
          return acc;
        }, {}),
      ),
    });
  }
}
