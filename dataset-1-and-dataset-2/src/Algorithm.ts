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
 * @param dataSet Dataset to test against
 * @param ruleSet Rule set in individual
 * @returns
 */
export const calculateFitness = (
  dataSet: Rule[],
  ruleSet: Individual
): number => {
  let fitness = 0;
  for (let i = 0; i < RULE_SET_SIZE; i++) {
    for (let j = 0; j < RULE_SET_SIZE; j++) {
      if (dataSet[j].conditionString === ruleSet.ruleSet[j].conditionString) {
        if (dataSet[i].output === ruleSet.ruleSet[i].output) {
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
      const mutant = generateRule(CONDITION_LENGTH);
      individual.ruleSet[i] = mutant;
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
    condition[i] = Math.round(Math.random());
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
    const newRule = generateRule(conditionLength);
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
