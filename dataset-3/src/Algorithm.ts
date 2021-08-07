import { Individual } from "./Individual";
import {
  CONDITION_LENGTH,
  RULE_SET_SIZE,
  CROSSOVER_RATE,
  TOURNAMENT_SIZE,
  MUTATION_RATE,
} from "./index";
import { Population } from "./Population";
import { Rule } from "./Rule";

/**
 * Calculate fitness of an individual
 * @param dataSet Set of rules to test against
 * @param ruleSet Set of rules in population
 * @returns
 */
export const calculateFitness = (
  dataSet: Rule[],
  ruleSet: Individual
): number => {
  let fitness = 0;
  let conditionMatch = false;
  for (let testRule of dataSet) {
    for (let rule of ruleSet.ruleSet) {
      for (let k = 0; k < rule.condition.length; k++) {
        if (
          (testRule.condition[k] >= 0.5 && rule.condition[k] >= 0.5) ||
          (testRule.condition[k] <= 0.5 && rule.condition[k] <= 0.5) ||
          testRule.condition[k] == rule.condition[k]
        ) {
          conditionMatch = true;
        } else {
          conditionMatch = false;
          break;
        }
      }

      if (conditionMatch == true) {
        if (testRule.output == rule.output) {
          fitness++;
        }
        break;
      }
    }
  }
  return fitness;
};

/**
 * Performs mutation on an individual
 * @param individual individual to mutate
 * @param mutationRate mutation rate
 * @returns mutated individual
 */
export const mutate = (
  individual: Individual,
  mutationRate: number
): Individual => {
  for (let i = 0; i < individual.ruleSet.length; i++) {
    if (Math.random() <= mutationRate) {
      //Mutate random gene -- Possibly a solution to mutation, but double check with Larry and whoever.
      const mutant = generateRule(CONDITION_LENGTH);
      individual.saveRule(i, mutant);
    }
  }
  return individual;
};

/**
 * Tournament selection
 * @param pop parent population
 * @param tournamentSize tournament size
 * @returns
 */
export const tournamentSelection = (
  pop: Population,
  tournamentSize: number
): Individual => {
  const tournament = new Population(new Array<Individual>());
  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * pop.size());
    tournament.saveRuleSet(i, pop.getRuleSet(randomIndex));
  }

  return tournament.getFittest();
};

/**
 * Single point crossover
 * @param parent1 parent ruleset 1
 * @param parent2 parent ruleset 2
 * @returns two offsprings
 */
const singlePointCrossover = (
  parent1: Individual,
  parent2: Individual
): Individual[] => {
  if (Math.random() <= CROSSOVER_RATE) {
    const crossoverPoint = Math.ceil(Math.random() * parent1.ruleSet.length);
    const offspring1Rules = parent1.ruleSet
      .slice(0, crossoverPoint)
      .concat(parent2.ruleSet.slice(crossoverPoint));
    const offspring2Rules = parent2.ruleSet
      .slice(0, crossoverPoint)
      .concat(parent1.ruleSet.slice(crossoverPoint));

    const offspring1 = new Individual(offspring1Rules);
    const offspring2 = new Individual(offspring2Rules);

    return [offspring1, offspring2];
  }

  return [parent1, parent2];
};

/**
 * Uniform crossover
 * @param parent1 parent ruleset 1
 * @param parent2 parent ruleset 2
 * @returns two offsprings
 */
const uniformCrossover = (
  parent1: Individual,
  parent2: Individual
): Individual[] => {
  const offspring1 = new Individual(new Array<Rule>());
  const offspring2 = new Individual(new Array<Rule>());
  for (let i = 0; i < parent1.ruleSet.length; i++) {
    if (Math.random() <= CROSSOVER_RATE) {
      offspring2.saveRule(i, parent1.getRule(i));
      offspring1.saveRule(i, parent2.getRule(i));
    } else {
      offspring1.saveRule(i, parent1.getRule(i));
      offspring2.saveRule(i, parent2.getRule(i));
    }
  }
  return [offspring1, offspring2];
};

/**
 * Evolves a population using genetic operators
 * @param pop population
 * @returns evolved population
 */
export const evolvePopulation = (pop: Population): Population => {
  const newPopulation = new Population(new Array<Individual>());

  //Crossover
  for (let i = 0; i < pop.size(); i++) {
    const parent1 = tournamentSelection(pop, TOURNAMENT_SIZE);
    const parent2 = tournamentSelection(pop, TOURNAMENT_SIZE);

    const [offspring1, offspring2] = uniformCrossover(parent1, parent2);
    newPopulation.saveRuleSet(i, offspring1);
    newPopulation.saveRuleSet(i + 1, offspring2);
  }

  //Mutation
  for (let i = 0; i < newPopulation.size(); i++) {
    newPopulation.population[i] = mutate(
      newPopulation.getRuleSet(i),
      MUTATION_RATE
    );
  }

  return newPopulation;
};

/**
 * Generates a new rule with random variables
 * @param conditionLength number of conditions in rule
 * @returns new rule
 */
export const generateRule = (conditionLength: number): Rule => {
  let condition: number[] = new Array<number>(conditionLength);
  let output: number;

  for (let i = 0; i < conditionLength; i++) {
    condition[i] = Number(Math.random().toFixed(6));
  }
  output = Math.round(Math.random());

  return new Rule(condition, output);
};

/**
 * Generates a new individual with random rules
 * @param ruleSetSize number of rules
 * @param conditionLength number of variables in condition
 * @returns new individual
 */
export const generateIndividual = (
  ruleSetSize: number,
  conditionLength: number
): Individual => {
  const newRuleSet = new Array<Rule>();

  for (let i = 0; i < ruleSetSize; i++) {
    const newRule = generateRule(ruleSetSize);
    newRuleSet.push(newRule);
  }

  return new Individual(newRuleSet);
};

/**
 * Generates a new population with individuals containing random rules
 * @param populationSize population size
 * @param ruleSetSize number of rules
 * @param conditionLength number of variables in condition
 * @returns new population
 */
export const generatePopulation = (
  populationSize: number,
  ruleSetSize: number,
  conditionLength: number
): Population => {
  const population = new Array<Individual>();

  for (let i = 0; i < populationSize; i++) {
    const newIndividual = generateIndividual(ruleSetSize, conditionLength);
    population.push(newIndividual);
  }

  return new Population(population);
};
