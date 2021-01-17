/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Page } from "puppeteer";
import { ChildProcess, exec } from "child_process";

export async function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export async function antdSelect(page: Page, fieldName: string, title: string) {
  const selects = await page.$x(
    `//*[@id='${fieldName}']//parent::*//parent::*//parent::*//parent::*//parent::div[@class='ant-form-item-control-input']`
  );
  if (selects.length === 0) {
    throw new Error(`Not found select with id ${fieldName}`);
  }
  await selects[0].click();
  const selector = `#${fieldName}_list +* .ant-select-item.ant-select-item-option[title="${title}"]`;
  await page.evaluate((s) => {
    document.querySelector(s).click();
  }, selector);
}

export async function antdInputDate(
  page: Page,
  fieldName: string,
  value: string
) {
  const selector = `#${fieldName}`;

  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value);

  await page.evaluate(
    (s, v) => {
      document.querySelector(s).value = v;
    },
    selector,
    value
  );
}

export async function antdInputTime(
  page: Page,
  fieldName: string,
  value: string
) {
  const selector = `#${fieldName}`;
  await page.click(selector, { clickCount: 3 });
  await sleep(50);
  await page.type(selector, value);
  await sleep(100);
  await page.evaluate(
    (s, v) => {
      document.querySelector(s).value = v;
    },
    selector,
    value
  );
  await sleep(100);
  await page.click(`.ant-picker-ok button`);
}

export async function getElementText(page: Page, selector: string) {
  const element = await page.$(selector);
  const text = await page.evaluate((e) => e.textContent, element);
  return text;
}
export async function isElementVisible(page: Page, selector: string) {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Not found element with selector ${selector}`);
  }
  return element.isIntersectingViewport();
}

export interface IFlaskTestProcess {
  close: () => Promise<void>;
}

export async function runFlaskProccess({
  env,
}: {
  env: NodeJS.ProcessEnv;
}): Promise<IFlaskTestProcess> {
  const command = `bin/python3 -m flask run`;

  let isClosed = false;
  const childProccess = await new Promise<ChildProcess>((resolve, reject) => {
    const proc = exec(
      command,
      {
        cwd: `${__dirname}`,
        env: {
          ...env,
          FLASK_ENV: "development",
          LC_ALL: "C.UTF-8",
          LANG: "C.UTF-8",
        },
      },
      (err, stdout, stderr) => {
        if (isClosed) {
          return;
        }
        if (err) {
          reject(err);
        } else {
          reject(
            new Error(`Unexpected close, stdout: ${stdout}, stderr: ${stderr}`)
          );
        }
      }
    );
    const onError = (err: Error) => reject(err);
    const onData = (chunk: string) => {
      process.stdout.write(chunk);
      if (chunk.indexOf(`* Debug mode: on`) > -1) {
        proc.stdout?.off(`error`, onError);
        proc.stdout?.off(`data`, onData);
        resolve(proc);
      }
    };
    proc.stdout?.on(`data`, onData);
    proc.stdout?.once(`error`, onError);
  });
  await sleep(500);

  childProccess.stdout?.on(`data`, (chunk: string) => {
    process.stdout.write(chunk);
  });
  childProccess.stderr?.on(`data`, (chunk: string) => {
    process.stderr.write(chunk);
  });
  return {
    close: async () => {
      isClosed = true;
      childProccess.kill("SIGTERM");
      await sleep(500);
    },
  };
}
