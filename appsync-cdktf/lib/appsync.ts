import { Construct } from "constructs";
import { TerraformStack, TerraformOutput } from "cdktf";
import { AwsProvider } from "../.gen/providers/aws/provider";
import { AppsyncGraphqlApi } from "../.gen/providers/aws/appsync-graphql-api";
import * as fs from 'fs';

export class MyAppSyncStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    
    // AWSプロバイダーの設定
    new AwsProvider(this, 'AWS', {
      region: 'ap-northeast-1',
    });

    // スキーマファイルの内容を読み込む
    const schemaContent = fs.readFileSync('./lib/schema.graphql', 'utf-8');

    // AppSync GraphQL APIの定義
    const appsyncApi = new AppsyncGraphqlApi(this, "example", {
      authenticationType: "AWS_IAM",
      name: "cdktf-appsync",
      schema: schemaContent
    });

    new TerraformOutput(this, "appsyncEndpoint", {
      value: appsyncApi.uris,
    });
  }
}
