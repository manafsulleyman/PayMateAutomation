import { test, expect } from "@playwright/test";
import { loginData } from "../../../testData/loginData";
import { login } from "../../../support/util";

const { username, password } = loginData;

test.describe("View transaction history", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, username, password);
    await page.getByRole("link", { name: "Send Money" }).click();
    await page.getByRole("link", { name: "View History" }).click();
  });

  test("✅ View transaction history : Should view list of transation history", async ({
    page,
  }) => {
    const transactionList = page.getByTestId("transaction_list");
    await expect(transactionList).toBeVisible();
  });

  test("✅ Should display transaction details when clicked", async ({
    page,
  }) => {
    await page.locator(".transaction-item").first().click();
    await expect(page.getByTestId("amount_field")).toBeVisible();
    await expect(page.getByTestId("type_field")).toBeVisible();
    await expect(page.getByTestId("date_field")).toBeVisible();
  });
});
