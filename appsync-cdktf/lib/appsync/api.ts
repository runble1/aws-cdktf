import { Construct } from "constructs";
import * as fs from "fs";
import { AppsyncApiKey } from "../../.gen/providers/aws/appsync-api-key";
import { AppsyncDatasource } from "../../.gen/providers/aws/appsync-datasource";
import { AppsyncGraphqlApi } from "../../.gen/providers/aws/appsync-graphql-api";
import { createAppsyncIamRole } from "./iam";

export class AppSyncApi extends Construct {
  public readonly graphqlUrl: any;

  constructor(scope: Construct, name: string, dynamodbTableName: string) {
    super(scope, name);

    // IAM ロールの作成
    const appsyncRole = createAppsyncIamRole(
      this,
      `${name}Role`,
      "appsync.amazonaws.com",
    );

    // スキーマファイルの内容を読み込む
    const schemaContent = fs.readFileSync(
      "./lib/appsync/schema.graphql",
      "utf-8",
    );

    // AppSync GraphQL APIの定義
    const appsyncApi = new AppsyncGraphqlApi(this, "example", {
      authenticationType: "API_KEY",
      name: name,
      schema: schemaContent,
    });

    // AppSync のデータソースとして DynamoDB テーブルを設定
    new AppsyncDatasource(this, "MyDynamoDbDataSource", {
      apiId: appsyncApi.id,
      name: "MyDynamoDbDataSource",
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: appsyncRole.arn,
      dynamodbConfig: {
        tableName: dynamodbTableName, // DynamoDB テーブルの名前を指定
        region: "ap-northeast-1",
      },
    });

    // AppSync API キーの作成
    new AppsyncApiKey(this, "MyAppSyncApiKey", {
      apiId: appsyncApi.id,
    });

    this.graphqlUrl = appsyncApi.uris;
  }
}
