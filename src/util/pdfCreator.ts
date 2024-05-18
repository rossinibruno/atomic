import { Injectable } from '@nestjs/common';
import { html } from '@prairielearn/html';
import { renderEjs } from '@prairielearn/html-ejs';
import puppeteer from 'puppeteer';

const renderHtml = (params) =>
  html`${renderEjs(__filename, "<%- include('./templates/contract'); %>", {
    ...params,
  })}`.toString();

@Injectable()
export class PdfCreator {
  async create(params, filename) {
    const html = renderHtml(params);

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(html);

    const test = await page.pdf({
      path: `./pdf/${filename}.pdf`,
      format: 'A4',
    });

    await browser.close();
  }
}
