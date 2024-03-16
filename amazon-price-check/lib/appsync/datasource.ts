import { Construct } from "constructs";
import { AppsyncDatasource } from "../../.gen/providers/aws/appsync-datasource";

export interface AppSyncDataSourceProps {
  apiId: string;
  roleNameArn: string;
  productTableName: string;
  historyTableName: string;
}

export class AppSyncDataSource extends Construct {
  public readonly productTableDataSourceName: string;
  public readonly historyTableDataSourceName: string;

  constructor(scope: Construct, id: string, props: AppSyncDataSourceProps) {
    super(scope, id);

    const productTableDataSource = new AppsyncDatasource(this, "Product", {
      apiId: props.apiId,
      name: `${id}ProductTableDataSource`,
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: props.roleNameArn,
      dynamodbConfig: {
        tableName: props.productTableName,
        region: "ap-northeast-1",
      },
    });

    const historyTableDataSource = new AppsyncDatasource(this, "History", {
      apiId: props.apiId,
      name: `${id}HistoryTableDataSource`,
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: props.roleNameArn,
      dynamodbConfig: {
        tableName: props.historyTableName,
        region: "ap-northeast-1",
      },
    });

    this.productTableDataSourceName = productTableDataSource.name;
    this.historyTableDataSourceName = historyTableDataSource.name;
  }
}
