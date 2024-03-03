import { TerraformOutput, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { AwsProvider } from "../.gen/providers/aws/provider";
import { AppSyncApi } from "./appsync/api";
import { DynamoDbTable } from "./dynamodb/table";

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

    // AppSync エンドポイントの出力
    new TerraformOutput(this, "appsyncEndpoint", {
      value: appsyncApi.graphqlUrl,
    });
  }
}
