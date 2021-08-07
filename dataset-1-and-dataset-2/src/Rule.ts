export class Rule {
  constructor(private _condition: number[], private _output: number) {}

  public get condition(): number[] {
    return this._condition;
  }

  public set condition(condition: number[]) {
    this._condition = condition;
  }

  public get conditionString(): string {
    return this._condition.join("");
  }

  public get output(): number {
    return this._output;
  }

  public set output(output: number) {
    this._output = output;
  }
}
