import { Construct } from "constructs";
import { DynamodbTable } from "@cdktf/provider-aws/lib/dynamodb-table";

export class DynamoDbTable extends Construct {
  public readonly productTable: DynamodbTable;
  public readonly historyTable: DynamodbTable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.productTable = new DynamodbTable(this, "Product", {
      name: "Product",
      billingMode: 'PAY_PER_REQUEST',
      hashKey: "ProductId",
      attribute: [
        { name: "ProductId", type: "S" },
      ],
      tags: {
        Purpose: "DynamoDB",
      },
    });

    this.historyTable = new DynamodbTable(this, 'History', {
      name: 'History',
      billingMode: 'PAY_PER_REQUEST',
      hashKey: 'ProductId',
      rangeKey: 'CheckTimestamp',
      attribute: [
        { name: 'ProductId', type: 'S' },
        { name: 'CheckTimestamp', type: 'S' }
      ],
    });
  }
}
