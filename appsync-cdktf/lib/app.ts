import { TerraformOutput, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import * as path from "path";
import { AwsProvider } from "../.gen/providers/aws/provider";
import { AppSyncApi } from "./appsync/api";
import { setupResolvers } from "./appsync/resolver";
import { DynamoDbTable } from "./dynamodb/table";
import { NodejsFunction } from "./lambda/function";

export class MyInfrastructureStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-northeast-1",
    });

    const dynamoDbTable = new DynamoDbTable(this, "DynamoDbTable");

    const appsyncApi = new AppSyncApi(
      this,
      "cdktf-appsync",
      dynamoDbTable.table.name,
    );

    setupResolvers(
      this,
      appsyncApi.apiId, // AppSync API のID
      appsyncApi.dataSourceName, // データソース名
      dynamoDbTable.table.name, // DynamoDB テーブル名
    );

    const nodejsFunctionInstance = new NodejsFunction(this, "hello-world", {
      handler: "index.handler",
      functionName: "helloWorldFunction",
      path: path.join(__dirname, "..", "functions/helloworld"),
    });

    new TerraformOutput(this, "lambdaFunctionUrl", {
      value: nodejsFunctionInstance.lambdaFunctionUrl.functionUrl,
    });

    new TerraformOutput(this, "appsyncEndpoint", {
      value: appsyncApi.graphqlUrl,
    });
  }
}
