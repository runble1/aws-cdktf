import { Construct } from "constructs";
import { DynamodbTable } from "@cdktf/provider-aws/lib/dynamodb-table";

export class DynamoDbTable extends Construct {
  public readonly table: DynamodbTable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new DynamodbTable(this, "ProductPrices", {
      name: "ProductPrices",
      billingMode: "PROVISIONED",
      readCapacity: 5,
      writeCapacity: 5,
      hashKey: "ProductID",
      rangeKey: "CheckDate",
      attribute: [
        { name: "ProductID", type: "S" },
        { name: "CheckDate", type: "S" }
      ],
      tags: {
        Purpose: "AmazonPriceTracking",
      },
    });
  }
}
