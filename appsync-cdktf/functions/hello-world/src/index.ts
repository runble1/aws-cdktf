export const handler = async (event: any, context: any): Promise<any> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, World!" }),
  };
};
