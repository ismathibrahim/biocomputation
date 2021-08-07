import { evolvePopulation, generatePopulation } from "./Algorithm";
import { collectData, writeDataToFile } from "./util";

export const DATA_SET = "./src/data/data3.txt";

//Genetic algorithm parameters
const MAX_GENERATIONS = 100;
export const POPULATION_SIZE = 10;
export const CROSSOVER_RATE = 0.3;
export const MUTATION_RATE = 0.01;
export const TOURNAMENT_SIZE = 10;

//Dataset specific parameters
export const RULE_SET_SIZE = 1000;
export const CONDITION_LENGTH = 6;

console.log("Reading data...");
const dataSet = collectData(DATA_SET); // Read dataset

// Split the dataset
const midPoint = Math.ceil(dataSet.length / 2);
export const trainData = dataSet.slice(0, midPoint);
export const testData = dataSet.slice(midPoint);

console.log("Generating initial population...");

// Generate initial population
let pop = generatePopulation(POPULATION_SIZE, RULE_SET_SIZE, CONDITION_LENGTH);

let generation = 0;
const log = new Array();

// Run the genetic algorithm for specified number of generations
while (generation < MAX_GENERATIONS) {
  generation++;

  //Evaluate fitness of current population
  const populationFitness = pop.calculateFitness();
  log.push(populationFitness);
  console.log(
    `Generation ${generation} Fittest: ${populationFitness.best}, Average: ${populationFitness.average}, Worst: ${populationFitness.worst}`
  );

  // Evolve current population
  pop = evolvePopulation(pop);
}
writeDataToFile("./src/log/data3.json", log);
