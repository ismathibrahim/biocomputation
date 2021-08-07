import { Rule } from "./Rule";
import { dataSet } from "./index";
import { calculateFitness } from "./Algorithm";

export class Individual {
  ruleSet: Rule[];
  fitness: number;

  constructor(ruleSet: Rule[]) {
    this.ruleSet = ruleSet;
    this.fitness = 0;
  }

  getRule(index: number): Rule {
    return this.ruleSet[index];
  }

  saveRule(index: number, rule: Rule) {
    this.ruleSet[index] = rule;
  }

  getFitness(): number {
    if (this.fitness == 0) {
      this.fitness = calculateFitness(dataSet, this);
    }
    return this.fitness;
  }
}
