import { AssetType, TerraformAsset } from "cdktf";
import { Construct } from "constructs";
import { buildSync } from "esbuild";
import * as path from "path";
import { LambdaFunction } from "../../.gen/providers/aws/lambda-function";
import { LambdaFunctionUrl } from "../../.gen/providers/aws/lambda-function-url";
import { createIamRole } from "./iam";

export interface NodejsFunctionProps {
  handler: string;
  functionName: string;
  path: string;
  graphqlUrl: string;
}

const bundleLambdaFunction = (workingDirectory: string): string => {
  buildSync({
    entryPoints: [path.join(workingDirectory, "src/index.ts")],
    platform: "node",
    target: "node16",
    bundle: true,
    format: "cjs",
    sourcemap: "external",
    outdir: path.join(workingDirectory, "dist"),
    absWorkingDir: workingDirectory,
  });

  return path.join(workingDirectory, "dist");
};

export class NodejsFunction extends Construct {
  public readonly lambdaFunction: LambdaFunction;
  public readonly lambdaFunctionUrl: LambdaFunctionUrl;

  constructor(scope: Construct, name: string, props: NodejsFunctionProps) {
    super(scope, name);

    // バンドルプロセスの実行
    const distPath = bundleLambdaFunction(path.resolve(props.path));

    // Terraform Asset の作成
    const lambdaAsset = new TerraformAsset(this, "LambdaFunctionAsset", {
      path: distPath,
      type: AssetType.ARCHIVE,
    });

    // IAM ロールの作成
    const lambdaRole = createIamRole(
      scope,
      `${name}Role`,
    );

    this.lambdaFunction = new LambdaFunction(scope, `${name}Lambda`, {
      functionName: props.functionName,
      handler: props.handler,
      runtime: "nodejs18.x", // 20まだ
      role: lambdaRole.arn,
      filename: lambdaAsset.path,
      sourceCodeHash: lambdaAsset.assetHash,
      architectures: ["arm64"],
      environment: {
        variables: {
          APPSYNC_ENDPOINT: props.graphqlUrl
        }
      },
    });

    this.lambdaFunctionUrl = new LambdaFunctionUrl(scope, `${name}LambdaUrl`, {
      functionName: this.lambdaFunction.functionName,
      authorizationType: "NONE", // 認証なし
    });
  }
}
