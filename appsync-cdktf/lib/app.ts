import { TerraformOutput, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import * as path from "path";
import { AwsProvider } from "../.gen/providers/aws/provider";
import { AppSyncApi } from "./appsync/api";
import { DynamoDbTable } from "./dynamodb/table";
import { DynamoDbTableItem } from "./dynamodb/table_item"
import { NodejsFunction } from "./lambda/function";

export class MyInfrastructureStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-northeast-1",
    });

    const dynamoDbTable = new DynamoDbTable(this, "DynamoDbTable");
    new DynamoDbTableItem(this, "DynamoDbTableItem", {
      tableName: dynamoDbTable.table.name,
      hashKey: "ProductID",
      rangeKey: "CheckDate"
    });

    const appsyncApi = new AppSyncApi(
      this,
      "cdktf-appsync",
      dynamoDbTable.table.name,
    );

    new TerraformOutput(this, "appsyncEndpoint", {
      value: appsyncApi.graphqlUrl,
    });
    
    /*
    const nodejsFunctionInstance = new NodejsFunction(this, "hello-world", {
      handler: "index.handler",
      functionName: "helloWorldFunction",
      path: path.join(__dirname, "..", "functions/hello-world"),
    });*/
    
    const nodejsFunctionInstance = new NodejsFunction(this, "call-appsync", {
      handler: "index.handler",
      functionName: "helloWorldFunction",
      path: path.join(__dirname, "..", "functions/call-appsync"),
    });

    new TerraformOutput(this, "lambdaFunctionUrl", {
      value: nodejsFunctionInstance.lambdaFunctionUrl.functionUrl,
    });
  }
}
