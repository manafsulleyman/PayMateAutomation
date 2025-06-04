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

const {
  insufficientBalanceError,
  expiredCardError,
  walletSuccessMessage,
} = recipientInfo;

test.describe("Fund wallet API Tests", () => {
  test.beforeEach(async ({ page }) => {
    authenticationToken = await apilogin(
      apitestData.user.username,
      apitestData.user.password
    );
    context = await createAuthorizedContext(authenticationToken);
  });

  test("Should successfully fund wallet with amount and card info", async () => {
    const response = await context.post("/wallet/fund", {
      data: {
        cardnumber: apitestData.card.number,
        expiry: apitestData.card.expiry,
        amount: apitestData.card.amountToFund,
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(walletSuccessMessage);
  });

  test("Insufficient card balanace: Should not be able to fund with card with insufficient balance", async () => {
    const response = await context.post("/wallet/fund", {
      data: {
        cardnumber: apitestData.card.lowbalancecardnumber,
        expiry: apitestData.card.expiry,
        amount: apitestData.card.amountToFund,
      },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(insufficientBalanceError);
  });

  test("Expired card: Should not be able to fund wallet with expired card", async () => {
    const response = await context.post("/wallet/fund", {
      data: {
        cardnumber: apitestData.card.expiredcard,
        expiry: apitestData.card.expiry,
        amount: apitestData.card.amountToFund,
      },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe(expiredCardError);
  });
});
