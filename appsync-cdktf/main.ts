import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from "./.gen/providers/aws/provider";
import { AppsyncGraphqlApi } from './.gen/providers/aws/appsync-graphql-api';
import * as fs from 'fs';

class MyAppSyncStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    
    // AWSプロバイダーの設定
    new AwsProvider(this, 'AWS', {
      region: 'ap-northeast-1', // 必要に応じてリージョンを設定
    });

    // スキーマファイルの内容を読み込む
    const schemaContent = fs.readFileSync('./schema.graphql', 'utf-8');

    // AppSync GraphQL APIの定義
    new AppsyncGraphqlApi(this, "example", {
      authenticationType: "AWS_IAM",
      name: "cdktf-appsync",
      schema: schemaContent
    });
  }
}

const app = new App();
new MyAppSyncStack(app, "MyAppSync");
app.synth();
