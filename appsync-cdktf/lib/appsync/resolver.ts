// lib/appsync/resolver.ts
import { Construct } from "constructs";
import { AppsyncResolver } from "../../.gen/providers/aws/appsync-resolver";

export function setupResolvers(
  scope: Construct,
  apiId: string,
  dataSourceName: string,
  tableName: string,
) {
  // getTaskList クエリのリゾルバ
  new AppsyncResolver(scope, "getTaskListResolver", {
    apiId: apiId,
    type: "Query",
    field: "getTaskList",
    dataSource: dataSourceName,
    requestTemplate: `{
      "version": "2017-02-28",
      "operation": "Scan",
      "tableName": "${tableName}"
    }`,
    responseTemplate: "$util.toJson($ctx.result.items)",
  });

  // getTask クエリのリゾルバ
  new AppsyncResolver(scope, "getTaskResolver", {
    apiId: apiId,
    type: "Query",
    field: "getTask",
    dataSource: dataSourceName,
    requestTemplate: `{
      "version": "2017-02-28",
      "operation": "GetItem",
      "key": {
        "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
      },
      "tableName": "${tableName}"
    }`,
    responseTemplate: "$util.toJson($ctx.result)",
  });
}
