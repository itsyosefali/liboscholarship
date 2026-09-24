import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("both languages pass automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  for (const language of ["ar", "en"]) {
    if (language === "en")
      await page.getByRole("button", { name: "Switch to English" }).click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("Arabic is the default; language, metadata, and preference update together", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1")).toContainText("مستقبلك الدراسي");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("h1")).toContainText("Your next chapter");
  await expect(page).toHaveTitle("LIBO SCHOLARSHIP | Your future starts here");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Explore university admissions/,
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(errors).toEqual([]);
});

test("form rejects empty or whitespace names, and preserves entries when translating", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "متابعة على واتساب" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("   ");
  await page.locator("#service").selectOption("english");
  await page.getByRole("button", { name: "متابعة على واتساب" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.locator("#name").fill("سارة علي");
  await page.locator("#destination").fill("London");
  await page.locator("#message").fill("أريد تعلم اللغة");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("#name")).toHaveValue("سارة علي");
  await expect(page.locator("#service")).toHaveValue("english");
  await expect(page.locator("#destination")).toHaveValue("London");
  await expect(page.locator("#message")).toHaveValue("أريد تعلم اللغة");
});

test("WhatsApp handoff encodes the selected language and exposes a fallback link", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.evaluate(() => {
    window.open = () => null;
  });
  await page.locator("#name").fill("سارة & علي");
  await page.locator("#service").selectOption("chinese");
  await page.locator("#destination").fill("الصين");
  await page.locator("#message").fill("اللغة الصينية؟\nبرنامج جديد");
  await page.getByRole("button", { name: "متابعة على واتساب" }).click();
  const fallback = page.locator(".form-status a");
  const arabicUrl = new URL((await fallback.getAttribute("href"))!);
  expect(arabicUrl.origin + arabicUrl.pathname).toBe(
    "https://wa.me/218921100078",
  );
  expect(arabicUrl.searchParams.get("text")).toContain("الاسم: سارة & علي");
  expect(arabicUrl.searchParams.get("text")).toContain("الخدمة: تعلم الصينية");
  expect(arabicUrl.searchParams.get("text")).toContain(
    "الرسالة: اللغة الصينية؟\nبرنامج جديد",
  );
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  const englishUrl = new URL((await fallback.getAttribute("href"))!);
  expect(englishUrl.searchParams.get("text")).toContain(
    "Service: Learn Chinese",
  );
  expect(englishUrl.searchParams.get("text")).toContain(
    "Preferred destination: الصين",
  );
  await expect(page.getByRole("status")).toContainText("Press send there");
});

test("service and destination cards prefill the enquiry; FAQs and contact links work", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".service-card").nth(3).click();
  await expect(page.locator("#service")).toHaveValue("scholarships");
  await page.locator(".destination-card").first().click();
  await expect(page.locator("#service")).toHaveValue("admissions");
  await expect(page.locator("#destination")).toHaveValue("الصين");
  const question = page.locator(".faq-list details").first();
  await question.locator("summary").click();
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toBeVisible();
  await question.locator("summary").click();
  await expect(question).not.toHaveAttribute("open", "");
  await expect(page.locator(".map-link")).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/n8Queaqtx2A81udA6?g_st=ac",
  );
  await expect(
    page.locator('.contact-details a[href^="tel:"]'),
  ).toHaveAttribute("href", "tel:+218921100078");
  await expect(page.locator(".email-value")).toHaveAttribute(
    "href",
    "mailto:liboscholarship@gmail.com",
  );
});

test("both languages render without horizontal overflow or missing images", async ({
  page,
}) => {
  await page.goto("/");
  for (const language of ["ar", "en"]) {
    if (language === "en")
      await page.getByRole("button", { name: "Switch to English" }).click();
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
      await Promise.all(
        Array.from(document.images).map((image) => image.decode()),
      );
      await document.fonts.ready;
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    for (const id of ["services", "destinations", "about", "faq", "contact"])
      await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("mobile navigation supports selection and Escape", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Mobile menu is shown at mobile widths.",
  );
  await page.goto("/");
  const menu = page.locator(".menu-button");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.locator('.navigation a[href="#services"]').click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#services$/);
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});
