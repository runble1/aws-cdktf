import { Construct } from "constructs";
import { IamRole } from "../../.gen/providers/aws/iam-role";
import { IamRolePolicy } from "../../.gen/providers/aws/iam-role-policy";

export function createAppsyncIamRole(
  scope: Construct,
  roleName: string,
  appsyncServicePrincipal: string,
) {
  const role = new IamRole(scope, `${roleName}`, {
    name: roleName,
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Action: "sts:AssumeRole",
        Principal: {
          Service: appsyncServicePrincipal,
        },
        Effect: "Allow",
        Sid: "",
      }],
    }),
  });

  new IamRolePolicy(scope, `${roleName}Policy`, {
    role: role.name,
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "*",
      }],
    }),
  });

  return role;
}
