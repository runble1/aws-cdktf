import { Construct } from "constructs";
import { AppsyncResolver } from "../../.gen/providers/aws/appsync-resolver";

export interface AppSyncResolverProps {
  apiId: string;
  dataSourceName: string;
}

export class createAppsyncResolver extends Construct {
  constructor(scope: Construct, id: string, props: AppSyncResolverProps) {
    super(scope, id);

    new AppsyncResolver(scope, "getProductPriceResolver", {
      apiId: props.apiId,
      type: "Query",
      field: "getProductPrice",
      dataSource: props.dataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "ProductID": $util.dynamodb.toDynamoDBJson($ctx.args.ProductID),
          "CheckDate": $util.dynamodb.toDynamoDBJson($ctx.args.CheckDate)
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result)`,
    });

    new AppsyncResolver(scope, "putProductPriceResolver", {
      apiId: props.apiId,
      type: "Mutation",
      field: "putProductPrice",
      dataSource: props.dataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "ProductID": { "S": "$ctx.args.ProductID" },
          "CheckDate": { "S": "$ctx.args.CheckDate" }
        },
        "attributeValues": {
          "Price": { "N": "$ctx.args.Price" },
          "PreviousPrice": { "N": "$ctx.args.PreviousPrice" },
          "PriceChange": { "N": "$ctx.args.PriceChange" },
          "Title": { "S": "$ctx.args.Title" },
          "URL": { "S": "$ctx.args.URL" }
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result)`,
    });
  }
}
