import { expect } from "@playwright/test";
import { DeviceAction } from "tests/models/DeviceAction";
import { Drawer } from "tests/models/Drawer";
import { Modal } from "tests/models/Modal";
import test from "../../fixtures/common";
import { DiscoverPage } from "../../models/DiscoverPage";
import { Layout } from "../../models/Layout";
import * as server from "../../utils/serve-dummy-app";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

// NOTE: You must build the dummy live app before running this test:
// pnpm --filter='dummy-live-app' i && pnpm --filter='dummy-live-app' build

test.use({ userdata: "1AccountBTC1AccountETH" });

let continueTest = false;

test.beforeAll(async ({ request }) => {
  // Check that dummy app in tests/utils/dummy-app-build has been started successfully
  try {
    const port = await server.start();
    const response = await request.get(`http://localhost:${port}`);
    if (response.ok()) {
      continueTest = true;
      console.info(`========> Dummy test app successfully running on port ${port}! <=========`);
      process.env.MOCK_REMOTE_LIVE_MANIFEST = JSON.stringify(server.manifest(port));
    } else {
      throw new Error("Ping response != 200, got: " + response.status);
    }
  } catch (error) {
    console.warn(`========> Dummy test app not running! <=========`);
    console.error(error);
  }
});

test.afterAll(() => {
  server.stop();
  console.info(`========> Dummy test app stopped <=========`);
  delete process.env.MOCK_REMOTE_LIVE_MANIFEST;
});

// Due to flakiness on different OS's and CI, we won't run the screenshots where unncessary for testing
test.skip("Discover", async ({ page }) => {
  // Don't run test if server is not running
  if (!continueTest) return;

  const discoverPage = new DiscoverPage(page);
  const drawer = new Drawer(page);
  const modal = new Modal(page);
  const layout = new Layout(page);
  const deviceAction = new DeviceAction(page);

  await test.step("Navigate to catalog", async () => {
    await layout.goToDiscover();
    await expect.soft(page).toHaveScreenshot("catalog.png");
  });

  await test.step("Open Test App", async () => {
    await discoverPage.openTestApp();
    await expect.soft(drawer.content).toContainText("External Application");
  });

  await test.step("Accept Live App Disclaimer", async () => {
    await drawer.continue();
    await drawer.waitForDrawerToDisappear(); // macos runner was having screenshot issues here because the drawer wasn't disappearing fast enough
    await layout.waitForLoadingSpinnerToHaveDisappeared();
    await expect.soft(page).toHaveScreenshot("live-disclaimer-accepted.png");
  });

  // To test that the navigation buttons in webPlatformPlayer topBar have no effect
  // TODO: make this simpler by checking the buttons are disabled/not clickable
  await test.step("Cannot navigate with no previous actions", async () => {
    await expect(await discoverPage.getBackButtonStatus()).toBe("not-allowed");
    await expect(await discoverPage.getForwardButtonStatus()).toBe("not-allowed");
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe(
      "Ledger Live Dummy Test App",
    );
  });

  // To test that the back navigation button in webPlatformPlayer topBar is working
  await test.step("Navigate backward in live app", async () => {
    await discoverPage.navigateToAboutLink();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe("About Page");
    await expect(await discoverPage.getBackButtonStatus()).toBe("allowed");

    await discoverPage.goBack();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe(
      "Ledger Live Dummy Test App",
    );
    await expect(await discoverPage.getForwardButtonStatus()).toBe("allowed");
  });

  // To test that the forward navigation button in webPlatformPlayer topBar is working
  await test.step("Navigate forward in live app", async () => {
    await discoverPage.goForward();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe("About Page");
  });

  // To test that both navigation buttons in webPlatformPlayer topBar are enabled
  await test.step("Navigate in live app to middle of history", async () => {
    await discoverPage.navigateToDashboardLink();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe("Dashboard Page");

    await discoverPage.goBack();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe("About Page");

    await discoverPage.goBack();
    await expect(await discoverPage.getWebviewHeadingElementByText()).toBe(
      "Ledger Live Dummy Test App",
    );
  });

  await test.step("List all accounts", async () => {
    await discoverPage.getAccountsList();
    await expect.soft(page).toHaveScreenshot("live-app-list-all-accounts.png");
  });

  await test.step("Request Account drawer - open", async () => {
    await discoverPage.requestAccount();
    await expect.soft(page).toHaveScreenshot("live-app-request-account-drawer.png");
  });

  await test.step("Request Account - select asset", async () => {
    await discoverPage.selectAsset();
    await expect.soft(page).toHaveScreenshot("live-app-request-account-select-account.png");
  });

  await test.step("Request Account - select BTC", async () => {
    await discoverPage.selectAccount();
    await expect.soft(page).toHaveScreenshot("live-app-request-account-output.png");
  });

  await test.step("List currencies", async () => {
    await discoverPage.listCurrencies();
    await expect.soft(page).toHaveScreenshot("live-app-list-currencies.png");
  });

  await test.step("Verify Address - modal", async () => {
    await discoverPage.verifyAddress();
    await deviceAction.openApp();
    await expect.soft(page).toHaveScreenshot("live-app-verify-address.png");
  });

  await test.step("Verify Address - address output", async () => {
    await modal.waitForModalToDisappear();
    await expect.soft(page).toHaveScreenshot("live-app-verify-address-output.png");
  });

  await test.step("Sign Transaction - info modal", async () => {
    await discoverPage.signTransaction();
    await expect.soft(page).toHaveScreenshot("live-app-sign-transaction-info.png", {
      timeout: 20000,
    });
  });

  await test.step("Sign Transaction - confirmation modal", async () => {
    await discoverPage.continueToSignTransaction();
    await layout.waitForLoadingSpinnerToHaveDisappeared();
    await discoverPage.waitForConfirmationScreenToBeDisplayed();
    await expect.soft(page).toHaveScreenshot("live-app-sign-transaction-confirm.png");
  });

  await test.step("Sign Transaction - signature output", async () => {
    await modal.waitForModalToDisappear();
    await expect.soft(page).toHaveScreenshot("live-app-sign-transaction-output.png");
  });
});
