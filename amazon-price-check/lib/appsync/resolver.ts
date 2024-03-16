import { Construct } from "constructs";
import { AppsyncResolver } from "../../.gen/providers/aws/appsync-resolver";

export interface AppSyncResolverProps {
  apiId: string;
  productDataSourceName: string;
  historyDataSourceName: string;
}

export class createAppsyncResolver extends Construct {
  constructor(scope: Construct, id: string, props: AppSyncResolverProps) {
    super(scope, id);

    // getProductResolver
    new AppsyncResolver(scope, "getProductResolver", {
      apiId: props.apiId,
      type: "Query",
      field: "getProduct",
      dataSource: props.productDataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "productId": $util.dynamodb.toDynamoDBJson($ctx.args.productId)
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result)`,
    });

    // getHistoryResolver
    new AppsyncResolver(scope, "getHistoryResolver", {
      apiId: props.apiId,
      type: "Query",
      field: "getHistory",
      dataSource: props.historyDataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "Query",
        "query": {
          "expression": "productId = :productId and checkTimestamp between :from and :to",
          "expressionValues": {
            ":productId": $util.dynamodb.toDynamoDBJson($ctx.args.productId),
            ":from": $util.dynamodb.toDynamoDBJson($ctx.args.from),
            ":to": $util.dynamodb.toDynamoDBJson($ctx.args.to)
          }
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result.items)`,
    });

    // putProductResolver
    new AppsyncResolver(scope, "putProductResolver", {
      apiId: props.apiId,
      type: "Mutation",
      field: "putProduct",
      dataSource: props.productDataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "productId": { "S": "$ctx.args.productId" }
        },
        "attributeValues": {
          "title": { "S": "$ctx.args.Title" },
          "url": { "S": "$ctx.args.URL" },
          "category": { "S": "$ctx.args.Category" },
          "lowPrice": { "N": "$ctx.args.LowPrice" }
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result)`,
    });

    // putHistoryResolver
    new AppsyncResolver(scope, "putHistoryResolver", {
      apiId: props.apiId,
      type: "Mutation",
      field: "putHistory",
      dataSource: props.historyDataSourceName,
      requestTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "productId": { "S": "$ctx.args.productId" },
          "checkTimestamp": { "S": "$ctx.args.checkTimestamp" }
        },
        "attributeValues": {
          "price": { "N": "$ctx.args.price" }
        }
      }`,
      responseTemplate: `$util.toJson($ctx.result)`,
    });
  }
}

