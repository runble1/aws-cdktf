import { Construct } from "constructs";
import * as fs from "fs";
import { AppsyncApiKey } from "../../.gen/providers/aws/appsync-api-key";
import { AppsyncDatasource } from "../../.gen/providers/aws/appsync-datasource";
import { AppsyncGraphqlApi } from "../../.gen/providers/aws/appsync-graphql-api";
import { createAppsyncIamRole } from "./iam";

export class AppSyncApi extends Construct {
  public readonly graphqlUrl: any;
  public readonly apiId: string; // AppSync API の ID を保持するプロパティ
  public readonly dataSourceName: string; // データソース名を保持するプロパティ

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
      "./schema/schema.graphql",
      "utf-8",
    );

    // AppSync GraphQL APIの定義
    const appsyncApi = new AppsyncGraphqlApi(this, "example", {
      authenticationType: "API_KEY",
      name: name,
      schema: schemaContent,
    });

    this.apiId = appsyncApi.id;
    this.graphqlUrl = appsyncApi.uris;

    // AppSync のデータソースとして DynamoDB テーブルを設定
    const dataSource = new AppsyncDatasource(this, "MyDynamoDbDataSource", {
      apiId: appsyncApi.id,
      name: "MyDynamoDbDataSource",
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: appsyncRole.arn,
      dynamodbConfig: {
        tableName: dynamodbTableName, // DynamoDB テーブルの名前を指定
        region: "ap-northeast-1",
      },
    });

    this.dataSourceName = dataSource.name; // データソース名を保存


    // AppSync API キーの作成
    new AppsyncApiKey(this, "MyAppSyncApiKey", {
      apiId: appsyncApi.id,
    });
  }
}
