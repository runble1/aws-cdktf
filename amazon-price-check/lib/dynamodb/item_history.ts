// lib/dynamodb-history-item-construct.ts
import { DynamodbTableItem } from "@cdktf/provider-aws/lib/dynamodb-table-item";
import { Construct } from "constructs";

export interface DynamoDbHistoryItemProps {
  tableName: string;
  productId: string;
  checkTimestamp: string;
  price: number;
}

export class DynamoDbHistoryItemConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DynamoDbHistoryItemProps) {
    super(scope, id);
    
    const item = {
      "ProductId": { "S": props.productId },
      "CheckTimestamp": { "S": props.checkTimestamp },
      "price": { "N": props.price.toString() }
    };

    new DynamodbTableItem(this, 'HistoryTableItem', {
      tableName: props.tableName,
      hashKey: props.productId,
      rangeKey: props.checkTimestamp,
      item: JSON.stringify(item),
    });
  }
}
