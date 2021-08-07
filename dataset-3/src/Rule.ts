export class Rule {
  constructor(private _condition: number[], private _output: number) {}

  public get condition(): number[] {
    return this._condition;
  }

  public get output(): number {
    return this._output;
  }
}
