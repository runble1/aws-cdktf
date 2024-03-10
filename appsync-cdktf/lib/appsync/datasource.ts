import { Construct } from "constructs";
import { AppsyncDatasource } from "../../.gen/providers/aws/appsync-datasource";

export interface AppSyncDataSourceProps {
  apiId: string;
  roleNameArn: string;
  dynamodbTableName: string;
}

export class AppSyncDataSource extends Construct {
  public readonly name: string;

  constructor(scope: Construct, id: string, props: AppSyncDataSourceProps) {
    super(scope, id);

    const dataSource = new AppsyncDatasource(this, "DynamoDbDataSource", {
      apiId: props.apiId,
      name: `${id}DataSource`,
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: props.roleNameArn,
      dynamodbConfig: {
        tableName: props.dynamodbTableName,
        region: "ap-northeast-1",
      },
    });

    this.name = dataSource.name;
  }
}
