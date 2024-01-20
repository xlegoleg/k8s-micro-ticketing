import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  public readonly STATUS_CODE = 500

  public readonly DEFAULT_MESSAGE = 'Error connecting to database';

  public get reason() {
    return this.thrownReason ?? this.DEFAULT_MESSAGE;
  }

  public constructor(private thrownReason?: string) {
    super('Error connecting to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.reason }];
  }
}