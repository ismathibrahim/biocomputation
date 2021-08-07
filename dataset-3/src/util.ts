import fs from "fs";

import { CONDITION_LENGTH } from "./index";
import { PopulationFitness } from "./Population";
import { Rule } from "./Rule";

/**
 * Loads dataset into program from file
 * @param filepath file path for dataset file
 * @returns a set of rules
 */
export const collectData = (filepath: string): Rule[] => {
  const dataSet = new Array<Rule>();
  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  const lines = data.split(/\r?\n/);

  lines.forEach((line: string) => {
    const charArray = line.split(" ");

    const rule: number[] = charArray.map((char) => Number(char));
    const condition: number[] = rule.slice(0, CONDITION_LENGTH);
    const output: number = rule[CONDITION_LENGTH];

    const newRule = new Rule(condition, output);
    dataSet.push(newRule);
  });

  return dataSet;
};

/**
 * Writes log data into file
 * @param filepath path of file to write into
 * @param data array of rules
 */
export const writeDataToFile = (filepath: string, data: any) => {
  let dataString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, dataString);
  console.log("Data written to file");
};
