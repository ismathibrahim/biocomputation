import { calculateFitness } from "./Algorithm";
import { Individual } from "./Individual";
import { dataSet } from "./index";

interface PopulationFitness {
  best: number;
  average: number;
  worst: number;
}

export class Population {
  constructor(public population: Individual[]) {}

  getRuleSet(index: number): Individual {
    return this.population[index];
  }

  saveRuleSet(index: number, ruleSet: Individual) {
    this.population[index] = ruleSet;
  }

  getFittest(): Individual {
    let fittest = this.population[0];
    for (let i = 0; i < this.population.length; i++) {
      if (fittest.getFitness() <= this.getRuleSet(i).getFitness()) {
        fittest = this.getRuleSet(i);
      }
    }
    return fittest;
  }

  calculateFitness(): PopulationFitness {
    let best = 0;
    let average = 0;
    let worst = calculateFitness(dataSet, this.population[0]);
    let totalFitness = 0;

    for (let individual of this.population) {
      const currentFitness = calculateFitness(dataSet, individual);
      if (best < currentFitness) {
        best = currentFitness;
      }
      if (worst > currentFitness) {
        worst = currentFitness;
      }

      totalFitness += currentFitness;
    }

    average = Number((totalFitness / this.population.length).toFixed(2));
    return { best, average, worst };
  }

  size(): number {
    return this.population.length;
  }
}
