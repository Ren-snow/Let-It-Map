/**
 * Domain errors. Services throw these; the adapter layer is the only place
 * that knows how to turn them into HTTP status codes or UI state.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** The thing being acted on does not exist. */
export class NotFoundError extends DomainError {}

/** The thing exists but this user may not touch it. */
export class ForbiddenError extends DomainError {}
