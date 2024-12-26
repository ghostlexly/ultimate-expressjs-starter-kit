import { Browser, BrowserContext, chromium, devices } from "playwright";

class PdfService {
  private browser: Browser;
  private context: BrowserContext;

  /**
   * Get the browser instance
   * If the browser is not initialized, it will create a new one
   */
  getBrowser = async () => {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true, // If true, hide the browser, if false, show the browser
      });
    }

    return this.browser;
  };

  /**
   * Get the context instance
   * If the context is not initialized, it will create a new one.
   * If the browser is not initialized yet, it will create a new one too.
   * You can use the context to create pages.
   */
  getContext = async () => {
    if (!this.context) {
      const browser = await this.getBrowser();
      this.context = await browser.newContext({
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1920,
          height: 1080,
        },
      });
    }

    return this.context;
  };

  /**
   * Generate a PDF from an HTML string
   * @param html - The HTML string to generate a PDF from
   */
  htmlToPdf = async ({ html }: { html: string }) => {
    // Launch browser
    const context = await this.getContext();
    const page = await context.newPage();

    // Uncomment to see the console logs from the page
    // context.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    // Set content and wait for loading
    await page.setContent(html, { waitUntil: "load" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      printBackground: true,
    });

    // Close page
    await page.close();

    return pdfBuffer;
  };
}

export const pdfService = new PdfService();
