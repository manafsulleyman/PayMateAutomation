import {
    test,
    expect,
    request as globalRequest,
    APIRequestContext,
  } from "@playwright/test";
  import { apitestData } from "../../testData/apiTestdata";
  import { apilogin, createAuthorizedContext } from "../../support/util";
  
  let authenticationToken: string;
  let context: APIRequestContext;

test.describe("View Transactions API Tests", () => {
    test.beforeEach(async ({ page }) => {
        authenticationToken = await apilogin(
          apitestData.user.username,
          apitestData.user.password
        );
        context = await createAuthorizedContext(authenticationToken);
      });

  test("Retrieves transaction history", async () =>{
    const response = await context.get("/wallet/transactions");
    expect(response.status()).toBe(200);
  });
});
