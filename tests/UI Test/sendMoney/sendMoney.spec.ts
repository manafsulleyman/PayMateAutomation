import { test, expect } from "@playwright/test";
import { loginData } from "../../../testData/loginData";
import { login } from "../../../support/util";
import { recipientInfo } from "../../../testData/recipientInfo";

const { username, password, requiredValidation } = loginData;

const {
  recipientUsername,
  transferAmount,
  minimalTransferAmount,
  insufficientBalanceError,
  successMessage,
  maximumTransactionLimitError,
  maximumTransferAmount,
} = recipientInfo;

test.describe("send money test", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, username, password);
    await page.getByRole("link", { name: "Send Money" }).click();
  });

  test("✅ Successful Send Money : Should successfully send money to another user", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(recipientUsername);
    await page.getByTestId("amount_field").fill(transferAmount);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(successMessage)).toBeVisible();
  });

  test("❌ Minimal Account Balance Limitation : Should not be able to send full wallet balance", async ({
    // Assumption is that there is a minimum account balance of GHC 300 and wallet balance is GHC 300
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(recipientUsername);
    await page.getByTestId("amount_field").fill(minimalTransferAmount);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(insufficientBalanceError)).toBeVisible();
  });

  test("❌ Maximum Ammout limitation : Should not be able to transfer amount more than the maximum account transaction limit", async ({
    // Assumption is that there is a maximum transaction limit of GHC 10000
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(recipientUsername);
    await page.getByTestId("amount_field").fill(maximumTransferAmount);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(maximumTransactionLimitError)).toBeVisible();
  });

  test("❌ Username Empty Fields Validation: Should show validation errors when username field is empty", async ({
    page,
  }) => {
    await page.getByTestId("amount_field").fill(transferAmount);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(requiredValidation)).toBeVisible();
  });

  test("❌ Amount Empty Fields Validation: Should show validation errors when amount field is empty", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(recipientUsername);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(requiredValidation)).toBeVisible();
  });
});
