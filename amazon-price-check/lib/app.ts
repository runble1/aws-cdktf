import { TerraformOutput, TerraformStack, Fn } from "cdktf";
import { Construct } from "constructs";
import * as path from "path";
import { AwsProvider } from "../.gen/providers/aws/provider";
import { AppSyncApi } from "./appsync/api";
import { DynamoDbTable } from "./dynamodb/table";
import { DynamoDbProductItemConstruct } from "./dynamodb/item_product"
import { DynamoDbHistoryItemConstruct } from "./dynamodb/item_history"
import { NodejsFunction } from "./lambda/function";

export class MyInfrastructureStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-northeast-1",
    });

    const dynamoDbTable = new DynamoDbTable(this, "DynamoDbTableProduct");


    const productTableProps = {
      tableName: dynamoDbTable.productTable.name,
      productId: "EXAMPLE123",
      title: "Example Product Title",
      url: "https://www.example.com/product/EXAMPLE123",
      category: "Example Category",
      lowPrice: 100.00
    };
    new DynamoDbProductItemConstruct(this, "DynamoDbProductItem", productTableProps);

    const historyTableProps = {
      tableName: dynamoDbTable.historyTable.name,
      productId: "EXAMPLE123",
      checkTimestamp: "2023-02-18T00:00:00Z",
      price: 95.00
    };

    new DynamoDbHistoryItemConstruct(this, "DynamoDbHistoryItem", historyTableProps);

    const appsyncApi = new AppSyncApi(
      this,
      "cdktf-appsync",
      dynamoDbTable.productTable.name,
      dynamoDbTable.historyTable.name,
    );

    const graphqlUrl = Fn.lookup(appsyncApi.graphqlUrl, "GRAPHQL", "");
    new TerraformOutput(this, "appsyncEndpoint", {
      value: graphqlUrl
    });

    const nodejsFunctionInstance = new NodejsFunction(this, "call-appsync", {
      handler: "index.handler",
      functionName: "helloWorldFunction",
      path: path.join(__dirname, "..", "functions/call-appsync"),
      graphqlUrl: graphqlUrl
    });

    new TerraformOutput(this, "lambdaFunctionUrl", {
      value: nodejsFunctionInstance.lambdaFunctionUrl.functionUrl,
    });
  }
}
