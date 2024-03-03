// lib/dynamodb/table.ts
import { DynamodbTable } from "@cdktf/provider-aws/lib/dynamodb-table";
import { Construct } from "constructs";

export class DynamoDbTable extends Construct {
  public readonly table: DynamodbTable;

  constructor(scope: Construct, tableName: string) {
    super(scope, tableName);

    this.table = new DynamodbTable(this, tableName, {
      name: tableName,
      hashKey: "id",
      attribute: [{ name: "id", type: "S" }],
      billingMode: "PAY_PER_REQUEST",
    });
  }
}
