import { Construct } from "constructs";
import { IamRole } from "../../.gen/providers/aws/iam-role";
import { IamRolePolicyAttachment } from "../../.gen/providers/aws/iam-role-policy-attachment";

export function createIamRole(
  scope: Construct,
  roleName: string,
) {
  const role = new IamRole(scope, `${roleName}`, {
    name: roleName,
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      }],
    }),
  });

  // AWSLambdaBasicExecutionRole ポリシーのアタッチメント
  new IamRolePolicyAttachment(scope, "LambdaBasicExecutionRoleAttachment", {
    role: role.name,
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  });

  return role;
}
