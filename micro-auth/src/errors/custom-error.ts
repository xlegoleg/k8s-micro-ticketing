export interface ICustomErrorFormat {
  message: string;
  field?: string;
}

export abstract class CustomError extends Error {
  public abstract readonly STATUS_CODE: number;
  
  public abstract readonly DEFAULT_MESSAGE?: string;

  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public abstract serializeErrors(): ICustomErrorFormat[];
}