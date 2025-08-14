import fs from 'fs/promises';
import path from 'path';
import puppeteer, { PDFOptions } from 'puppeteer';

const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', right: '12mm', bottom: '15mm', left: '12mm' },
};

export interface HtmlToPdfOptions extends PDFOptions {
  filePath?: string;     // optional: save to disk
  returnBuffer?: boolean; // default true
}

/**
 * Generate a PDF from an HTML string.
 * Returns a Buffer (by default) and optionally writes a file if filePath is given.
 */
export async function htmlToPdf(html: string, opts: HtmlToPdfOptions = {}) {
  const returnBuffer = opts.returnBuffer !== false;

  // Helpful when running in Docker or some Linux hosts
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ ...DEFAULT_PDF_OPTIONS, ...opts });

    if (opts.filePath) {
      const dir = path.dirname(opts.filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(opts.filePath, pdfBuffer);
    }

    return returnBuffer ? pdfBuffer : undefined;
  } finally {
    await browser.close();
  }
}

/**
 * Generate a PDF from a URL.
 */
export async function urlToPdf(url: string, opts: HtmlToPdfOptions = {}) {
  const returnBuffer = opts.returnBuffer !== false;

  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ ...DEFAULT_PDF_OPTIONS, ...opts });

    if (opts.filePath) {
      const dir = path.dirname(opts.filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(opts.filePath, pdfBuffer);
    }

    return returnBuffer ? pdfBuffer : undefined;
  } finally {
    await browser.close();
  }
}
