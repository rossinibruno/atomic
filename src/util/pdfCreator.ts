import { Injectable } from '@nestjs/common';
import { html } from '@prairielearn/html';
import { renderEjs } from '@prairielearn/html-ejs';
import puppeteer from 'puppeteer';

const renderHtml = (params, type) =>
  html`${renderEjs(
    __filename,
    `<%- include('./templates/${String(type).toLowerCase()}'); %>`,
    {
      ...params,
    },
  )}`.toString();

@Injectable()
export class PdfCreator {
  async create(params, filename, type) {
    try {
      const html = renderHtml(params, type);

      const browser = await puppeteer.launch();

      const page = await browser.newPage();

      await page.setContent(html);

      const test = await page.pdf({
        path: `./pdf/${type}-${filename}.pdf`,
        format: 'A4',
      });

      await browser.close();
    } catch (error) {
      console.log;
    }
  }
}
