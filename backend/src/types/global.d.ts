/// <reference types="@cloudflare/workers-types" />

declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown>(): Promise<T[]>;
  }

  interface D1Result<T = unknown> {
    success: boolean;
    meta: {
      duration: number;
      rows_read: number;
      rows_written: number;
      last_row_id: number;
      changed_db: boolean;
      changes: number;
    };
    results?: T[];
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }

  // TextEncoder and crypto are available in Cloudflare Workers runtime
  const TextEncoder: {
    new (): TextEncoder;
    prototype: TextEncoder;
  };

  const crypto: Crypto;
}

export {};

