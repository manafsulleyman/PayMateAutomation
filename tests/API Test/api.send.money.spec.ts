import {
  test,
  expect,
  request as globalRequest,
  APIRequestContext,
} from "@playwright/test";
import { apitestData } from "../../testData/apiTestdata";
import { apilogin, createAuthorizedContext } from "../../support/util";
import { recipientInfo } from "../../testData/recipientInfo";

let authenticationToken: string;
let context: APIRequestContext;

const { insufficientBalanceError, successMessage, minimalTransferAmount } =
  recipientInfo;

test.describe("Send Money API Tests", () => {
  test.beforeEach(async ({ page }) => {
    authenticationToken = await apilogin(
      apitestData.user.username,
      apitestData.user.password
    );
    context = await createAuthorizedContext(authenticationToken);
  });

  test("Should be able to send money to another user", async () => {
    const response = await context.post("/wallet/send", {
      data: {
        recipientname: apitestData.recipient.name,
        amount: apitestData.recipient.amountToSend,
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(successMessage);
  });

  test(" Minimal Account Balance Limitation : Should not be able to send full wallet balance", async () => {
    // Assumption is that there is a minimum account balance of GHC 300 and wallet balance is GHC 400

    const response = await context.post("/wallet/send", {
      data: {
        recipientname: apitestData.recipient.name,
        amount: recipientInfo.minimalTransferAmount,
      },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(insufficientBalanceError);
  });
});
