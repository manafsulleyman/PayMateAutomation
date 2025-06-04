import { Page } from "@playwright/test";
import { AppBaseUrl, ApiUrl } from "../support/evn";
import { loginData } from "../testData/loginData";
import { request as globalRequest, APIRequestContext } from "@playwright/test";
import { apitestData } from "../testData/apiTestdata";

const { apiurl } = ApiUrl;
const { username, password } = loginData;
const {url} = AppBaseUrl;

export async function login(page: Page, email: string, password: string) {
  await page.goto(url);
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

export async function apilogin(username: string, password: string): Promise<string> {
  const context = await globalRequest.newContext({ baseURL: apiurl });
  const response = await context.post("/auth/login", {
    data: { ...apitestData.user },
  });
  const responseBody = await response.json();
  return responseBody.token;
}

export async function createAuthorizedContext(token: string): Promise<APIRequestContext> {
  return await globalRequest.newContext({
    baseURL: apiurl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
