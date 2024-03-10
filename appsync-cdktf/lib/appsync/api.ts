import { Construct } from "constructs";
import * as fs from "fs";
import { AppsyncGraphqlApi } from "../../.gen/providers/aws/appsync-graphql-api";
import { createAppsyncIamRole } from "./iam";
import { AppSyncDataSource, AppSyncDataSourceProps } from "./datasource";
import { createAppsyncResolver, AppSyncResolverProps } from "./resolver";

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
      "./schema/schema.graphql",
      "utf-8",
    );

    // GraphQL API
    const appsyncApi = new AppsyncGraphqlApi(this, "example", {
      authenticationType: "AWS_IAM",
      name: name,
      schema: schemaContent,
    });
    this.graphqlUrl = appsyncApi.uris;

    // DataSource
    const dataSourceProps: AppSyncDataSourceProps = {
      apiId: appsyncApi.id,
      roleNameArn: appsyncRole.arn,
      dynamodbTableName: dynamodbTableName,
    };
    const dataSource = new AppSyncDataSource(this, "MyDynamoDbDataSource", dataSourceProps);

    // Resolver
    const resolverProps: AppSyncResolverProps = {
      apiId: appsyncApi.id,
      dataSourceName: dataSource.name,
    };
    new createAppsyncResolver(this, "MyAppSyncResolver", resolverProps);
  }
}
