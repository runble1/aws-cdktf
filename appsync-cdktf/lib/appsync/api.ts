import { TerraformOutput, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { AppsyncApiKey } from "../../.gen/providers/aws/appsync-api-key";
import { AppsyncGraphqlApi } from "../../.gen/providers/aws/appsync-graphql-api";
import { AwsProvider } from "../../.gen/providers/aws/provider";
//import { createAppsyncIamRole } from "./iam";

import * as fs from "fs";

export class AppSyncApi extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // AWSプロバイダーの設定
    new AwsProvider(this, "AWS", {
      region: "ap-northeast-1",
    });

    // IAM ロールの作成
    /*
    const appsyncRole = createAppsyncIamRole(
      this,
      "sample_httpDS_IoTEvents_role",
      "appsync.amazonaws.com",
    );*/

    // スキーマファイルの内容を読み込む
    const schemaContent = fs.readFileSync("./lib/appsync/schema.graphql", "utf-8");

    // AppSync GraphQL APIの定義
    const appsyncApi = new AppsyncGraphqlApi(this, "example", {
      authenticationType: "API_KEY",
      name: "cdktf-appsync",
      schema: schemaContent,
    });

    new AppsyncApiKey(this, "MyAppSyncApiKey", {
      apiId: appsyncApi.id,
    });

    new TerraformOutput(this, "appsyncEndpoint", {
      value: appsyncApi.uris,
    });
  }
}
