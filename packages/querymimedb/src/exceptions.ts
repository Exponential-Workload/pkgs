export class QueryException extends Error {
  constructor(
    public message: string,
    public code?: string,
  ) {
    super(message);
  }
}
export class NotFoundException extends QueryException {}
export class NoLibMagicException extends QueryException {}
export class NoMagicDbException extends QueryException {}
export class NoTypeException extends QueryException {}
