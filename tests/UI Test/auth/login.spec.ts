import { test, expect } from "@playwright/test";
import { AppBaseUrl } from "../../../support/evn";
import { loginData } from "../../../testData/loginData";

const {
  username,
  password,
  wrongPassword,
  wrongUsername,
  requiredValidation,
  invalidLoginValidation,
} = loginData;

test.describe("login functionality test", () => {
  test.beforeEach(async ({ page }) => await page.goto(AppBaseUrl.url));

  test("✅ Successful login: Should successfully login with valid credentials", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("❌ Empty Fields: Should show validation errors when fields are empty", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(requiredValidation).first()).toBeVisible();
    await expect(page.getByText(requiredValidation).nth(1)).toBeVisible();
  });
  test("❌ Unsuccessful login: Should Fail Login attempt with wrong username and password", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(wrongUsername);
    await page.getByPlaceholder("Password").fill(wrongPassword);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(invalidLoginValidation)).toBeVisible();
  });

  test("❌ Unsuccessful login: Should Fail Login attempt with incorrect password", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill(wrongPassword);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(invalidLoginValidation)).toBeVisible();
  });

  test("❌ Unsuccessful login: Should Fail Login attempt with wrong username", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(wrongUsername);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(invalidLoginValidation)).toBeVisible();
  });

  test("❌ Unsuccessful login: Should show validation errors when password field is empty", async ({
    page,
  }) => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(requiredValidation)).toBeVisible();
  });

  test("❌ Unsuccessful login: Should show validation errors when username field is empty", async ({
    page,
  }) => {
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(requiredValidation).first()).toBeVisible();
  });
});
