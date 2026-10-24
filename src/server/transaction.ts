import { db } from "@/server/db";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Either the pooled client or an open transaction. Services only ever pass one
 * of these through to a repository — they never call a method on it, which is
 * what keeps SQL out of the service layer.
 */
export type DbClient = typeof db | Transaction;

/** The client to use when an operation does not take part in a transaction. */
export const dbClient: DbClient = db;

/**
 * Declares a unit of work. The service decides what belongs in one; the
 * repositories inside receive the transaction and know nothing about scope.
 */
export function withTransaction<T>(
  work: (tx: DbClient) => Promise<T>,
): Promise<T> {
  return db.transaction((tx) => work(tx));
}
