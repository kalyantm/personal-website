declare module "fit-file-parser" {
  interface FitParserOptions {
    force?: boolean;
    speedUnit?: "m/s" | "km/h" | "mph";
    lengthUnit?: "m" | "km" | "mi";
    temperatureUnit?: "celsius" | "kelvin" | "fahrenheit";
    elapsedRecordField?: boolean;
    mode?: "cascade" | "list" | "both";
  }
  export default class FitParser {
    constructor(options?: FitParserOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(content: Buffer | ArrayBuffer, callback: (error: any, data: any) => void): void;
  }
}
