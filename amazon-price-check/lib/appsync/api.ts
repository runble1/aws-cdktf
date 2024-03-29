import { Construct } from "constructs";
import * as fs from "fs";
import { AppsyncGraphqlApi } from "../../.gen/providers/aws/appsync-graphql-api";
import { createAppsyncIamRole } from "./iam";
import { AppSyncDataSource, AppSyncDataSourceProps } from "./datasource";
import { createAppsyncResolver, AppSyncResolverProps } from "./resolver";

export class AppSyncApi extends Construct {
  public readonly appSyncGraphqlApi: AppsyncGraphqlApi;
  public readonly graphqlUrl: any;

  constructor(scope: Construct, name: string, productTableName: string, historyTableName: string) {
    super(scope, name);

    // IAM ロールの作成
    const appsyncRole = createAppsyncIamRole(
      this,
      `${name}Role`,
      "appsync.amazonaws.com",
    );

    // スキーマファイルの内容を読み込む
    const schemaContent = fs.readFileSync(
      "./schema/schema.gql",
      "utf-8",
    );

    // GraphQL API
    this.appSyncGraphqlApi = new AppsyncGraphqlApi(this, "this", {
      authenticationType: "AWS_IAM",
      name: name,
      schema: schemaContent,
    });
    this.graphqlUrl = this.appSyncGraphqlApi.uris

    // DataSource
    const dataSourceProps: AppSyncDataSourceProps = {
      apiId: this.appSyncGraphqlApi.id,
      roleNameArn: appsyncRole.arn,
      productTableName: productTableName,
      historyTableName: historyTableName,
    };
    const dataSource = new AppSyncDataSource(this, "MyDynamoDbDataSource", dataSourceProps);

    // Resolver
    const resolverProps: AppSyncResolverProps = {
      apiId: this.appSyncGraphqlApi.id,
      productDataSourceName: dataSource.productTableDataSourceName,
      historyDataSourceName: dataSource.historyTableDataSourceName
    };
    new createAppsyncResolver(this, "MyAppSyncResolver", resolverProps);
  }
}
