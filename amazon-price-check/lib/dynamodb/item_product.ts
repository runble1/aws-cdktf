// lib/dynamodb-product-item-construct.ts
import { DynamodbTableItem } from "@cdktf/provider-aws/lib/dynamodb-table-item";
import { Construct } from "constructs";

export interface DynamoDbProductItemProps {
  tableName: string;
  productId: string;
  title: string;
  url: string;
  category: string;
  lowPrice: number;
}

export class DynamoDbProductItemConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DynamoDbProductItemProps) {
    super(scope, id);
    
    const item = {
      "ProductId": { "S": props.productId },
      "title": { "S": props.title },
      "url": { "S": props.url },
      "category": { "S": props.category },
      "lowPrice": { "N": props.lowPrice.toString() }
    };

    new DynamodbTableItem(this, 'ProductTableItem', {
      tableName: props.tableName,
      hashKey: props.productId,
      item: JSON.stringify(item),
    });
  }
}
