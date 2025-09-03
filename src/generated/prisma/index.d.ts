
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model PriceHistory
 * 
 */
export type PriceHistory = $Result.DefaultSelection<Prisma.$PriceHistoryPayload>
/**
 * Model AnalysisRequest
 * 
 */
export type AnalysisRequest = $Result.DefaultSelection<Prisma.$AnalysisRequestPayload>
/**
 * Model AnalysisResult
 * 
 */
export type AnalysisResult = $Result.DefaultSelection<Prisma.$AnalysisResultPayload>
/**
 * Model Keyword
 * 
 */
export type Keyword = $Result.DefaultSelection<Prisma.$KeywordPayload>
/**
 * Model SearchHistory
 * 
 */
export type SearchHistory = $Result.DefaultSelection<Prisma.$SearchHistoryPayload>
/**
 * Model WatchList
 * 
 */
export type WatchList = $Result.DefaultSelection<Prisma.$WatchListPayload>
/**
 * Model SystemConfig
 * 
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priceHistory`: Exposes CRUD operations for the **PriceHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriceHistories
    * const priceHistories = await prisma.priceHistory.findMany()
    * ```
    */
  get priceHistory(): Prisma.PriceHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysisRequest`: Exposes CRUD operations for the **AnalysisRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisRequests
    * const analysisRequests = await prisma.analysisRequest.findMany()
    * ```
    */
  get analysisRequest(): Prisma.AnalysisRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysisResult`: Exposes CRUD operations for the **AnalysisResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisResults
    * const analysisResults = await prisma.analysisResult.findMany()
    * ```
    */
  get analysisResult(): Prisma.AnalysisResultDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.keyword`: Exposes CRUD operations for the **Keyword** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Keywords
    * const keywords = await prisma.keyword.findMany()
    * ```
    */
  get keyword(): Prisma.KeywordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.searchHistory`: Exposes CRUD operations for the **SearchHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SearchHistories
    * const searchHistories = await prisma.searchHistory.findMany()
    * ```
    */
  get searchHistory(): Prisma.SearchHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.watchList`: Exposes CRUD operations for the **WatchList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WatchLists
    * const watchLists = await prisma.watchList.findMany()
    * ```
    */
  get watchList(): Prisma.WatchListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemConfigs
    * const systemConfigs = await prisma.systemConfig.findMany()
    * ```
    */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserProfile: 'UserProfile',
    UserSession: 'UserSession',
    Category: 'Category',
    Product: 'Product',
    PriceHistory: 'PriceHistory',
    AnalysisRequest: 'AnalysisRequest',
    AnalysisResult: 'AnalysisResult',
    Keyword: 'Keyword',
    SearchHistory: 'SearchHistory',
    WatchList: 'WatchList',
    SystemConfig: 'SystemConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userProfile" | "userSession" | "category" | "product" | "priceHistory" | "analysisRequest" | "analysisResult" | "keyword" | "searchHistory" | "watchList" | "systemConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      PriceHistory: {
        payload: Prisma.$PriceHistoryPayload<ExtArgs>
        fields: Prisma.PriceHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriceHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriceHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          findFirst: {
            args: Prisma.PriceHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriceHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          findMany: {
            args: Prisma.PriceHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          create: {
            args: Prisma.PriceHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          createMany: {
            args: Prisma.PriceHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriceHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          delete: {
            args: Prisma.PriceHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          update: {
            args: Prisma.PriceHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PriceHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriceHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriceHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PriceHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          aggregate: {
            args: Prisma.PriceHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriceHistory>
          }
          groupBy: {
            args: Prisma.PriceHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriceHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriceHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PriceHistoryCountAggregateOutputType> | number
          }
        }
      }
      AnalysisRequest: {
        payload: Prisma.$AnalysisRequestPayload<ExtArgs>
        fields: Prisma.AnalysisRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          findFirst: {
            args: Prisma.AnalysisRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          findMany: {
            args: Prisma.AnalysisRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>[]
          }
          create: {
            args: Prisma.AnalysisRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          createMany: {
            args: Prisma.AnalysisRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>[]
          }
          delete: {
            args: Prisma.AnalysisRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          update: {
            args: Prisma.AnalysisRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisRequestPayload>
          }
          aggregate: {
            args: Prisma.AnalysisRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisRequest>
          }
          groupBy: {
            args: Prisma.AnalysisRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisRequestCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisRequestCountAggregateOutputType> | number
          }
        }
      }
      AnalysisResult: {
        payload: Prisma.$AnalysisResultPayload<ExtArgs>
        fields: Prisma.AnalysisResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          findFirst: {
            args: Prisma.AnalysisResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          findMany: {
            args: Prisma.AnalysisResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          create: {
            args: Prisma.AnalysisResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          createMany: {
            args: Prisma.AnalysisResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          delete: {
            args: Prisma.AnalysisResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          update: {
            args: Prisma.AnalysisResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          aggregate: {
            args: Prisma.AnalysisResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisResult>
          }
          groupBy: {
            args: Prisma.AnalysisResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisResultCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisResultCountAggregateOutputType> | number
          }
        }
      }
      Keyword: {
        payload: Prisma.$KeywordPayload<ExtArgs>
        fields: Prisma.KeywordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KeywordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KeywordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          findFirst: {
            args: Prisma.KeywordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KeywordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          findMany: {
            args: Prisma.KeywordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>[]
          }
          create: {
            args: Prisma.KeywordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          createMany: {
            args: Prisma.KeywordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KeywordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>[]
          }
          delete: {
            args: Prisma.KeywordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          update: {
            args: Prisma.KeywordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          deleteMany: {
            args: Prisma.KeywordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KeywordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KeywordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>[]
          }
          upsert: {
            args: Prisma.KeywordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordPayload>
          }
          aggregate: {
            args: Prisma.KeywordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKeyword>
          }
          groupBy: {
            args: Prisma.KeywordGroupByArgs<ExtArgs>
            result: $Utils.Optional<KeywordGroupByOutputType>[]
          }
          count: {
            args: Prisma.KeywordCountArgs<ExtArgs>
            result: $Utils.Optional<KeywordCountAggregateOutputType> | number
          }
        }
      }
      SearchHistory: {
        payload: Prisma.$SearchHistoryPayload<ExtArgs>
        fields: Prisma.SearchHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SearchHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SearchHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          findFirst: {
            args: Prisma.SearchHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SearchHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          findMany: {
            args: Prisma.SearchHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>[]
          }
          create: {
            args: Prisma.SearchHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          createMany: {
            args: Prisma.SearchHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SearchHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>[]
          }
          delete: {
            args: Prisma.SearchHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          update: {
            args: Prisma.SearchHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          deleteMany: {
            args: Prisma.SearchHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SearchHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SearchHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>[]
          }
          upsert: {
            args: Prisma.SearchHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchHistoryPayload>
          }
          aggregate: {
            args: Prisma.SearchHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSearchHistory>
          }
          groupBy: {
            args: Prisma.SearchHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SearchHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SearchHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<SearchHistoryCountAggregateOutputType> | number
          }
        }
      }
      WatchList: {
        payload: Prisma.$WatchListPayload<ExtArgs>
        fields: Prisma.WatchListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WatchListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WatchListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          findFirst: {
            args: Prisma.WatchListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WatchListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          findMany: {
            args: Prisma.WatchListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>[]
          }
          create: {
            args: Prisma.WatchListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          createMany: {
            args: Prisma.WatchListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WatchListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>[]
          }
          delete: {
            args: Prisma.WatchListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          update: {
            args: Prisma.WatchListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          deleteMany: {
            args: Prisma.WatchListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WatchListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WatchListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>[]
          }
          upsert: {
            args: Prisma.WatchListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchListPayload>
          }
          aggregate: {
            args: Prisma.WatchListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWatchList>
          }
          groupBy: {
            args: Prisma.WatchListGroupByArgs<ExtArgs>
            result: $Utils.Optional<WatchListGroupByOutputType>[]
          }
          count: {
            args: Prisma.WatchListCountArgs<ExtArgs>
            result: $Utils.Optional<WatchListCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userProfile?: UserProfileOmit
    userSession?: UserSessionOmit
    category?: CategoryOmit
    product?: ProductOmit
    priceHistory?: PriceHistoryOmit
    analysisRequest?: AnalysisRequestOmit
    analysisResult?: AnalysisResultOmit
    keyword?: KeywordOmit
    searchHistory?: SearchHistoryOmit
    watchList?: WatchListOmit
    systemConfig?: SystemConfigOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    searchHistory: number
    analysisRequests: number
    watchList: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    searchHistory?: boolean | UserCountOutputTypeCountSearchHistoryArgs
    analysisRequests?: boolean | UserCountOutputTypeCountAnalysisRequestsArgs
    watchList?: boolean | UserCountOutputTypeCountWatchListArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSearchHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SearchHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnalysisRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWatchListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchListWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    children: number
    products: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | CategoryCountOutputTypeCountChildrenArgs
    products?: boolean | CategoryCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    analysisResults: number
    analysisRequests: number
    watchList: number
    priceHistory: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisResults?: boolean | ProductCountOutputTypeCountAnalysisResultsArgs
    analysisRequests?: boolean | ProductCountOutputTypeCountAnalysisRequestsArgs
    watchList?: boolean | ProductCountOutputTypeCountWatchListArgs
    priceHistory?: boolean | ProductCountOutputTypeCountPriceHistoryArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountAnalysisResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisResultWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountAnalysisRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisRequestWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountWatchListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchListWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPriceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceHistoryWhereInput
  }


  /**
   * Count Type AnalysisResultCountOutputType
   */

  export type AnalysisResultCountOutputType = {
    keywordEntries: number
  }

  export type AnalysisResultCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    keywordEntries?: boolean | AnalysisResultCountOutputTypeCountKeywordEntriesArgs
  }

  // Custom InputTypes
  /**
   * AnalysisResultCountOutputType without action
   */
  export type AnalysisResultCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResultCountOutputType
     */
    select?: AnalysisResultCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnalysisResultCountOutputType without action
   */
  export type AnalysisResultCountOutputTypeCountKeywordEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeywordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    isActive: boolean | null
    emailVerified: boolean | null
    lastLoginAt: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    isActive: boolean | null
    emailVerified: boolean | null
    lastLoginAt: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    isActive: number
    emailVerified: number
    lastLoginAt: number
    failedLoginAttempts: number
    lockedUntil: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserSumAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    emailVerified?: true
    lastLoginAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    emailVerified?: true
    lastLoginAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    emailVerified?: true
    lastLoginAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    role: string
    isActive: boolean
    emailVerified: boolean
    lastLoginAt: Date | null
    failedLoginAttempts: number
    lockedUntil: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | User$profileArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    searchHistory?: boolean | User$searchHistoryArgs<ExtArgs>
    analysisRequests?: boolean | User$analysisRequestsArgs<ExtArgs>
    watchList?: boolean | User$watchListArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "isActive" | "emailVerified" | "lastLoginAt" | "failedLoginAttempts" | "lockedUntil" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | User$profileArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    searchHistory?: boolean | User$searchHistoryArgs<ExtArgs>
    analysisRequests?: boolean | User$analysisRequestsArgs<ExtArgs>
    watchList?: boolean | User$watchListArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs> | null
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
      searchHistory: Prisma.$SearchHistoryPayload<ExtArgs>[]
      analysisRequests: Prisma.$AnalysisRequestPayload<ExtArgs>[]
      watchList: Prisma.$WatchListPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      role: string
      isActive: boolean
      emailVerified: boolean
      lastLoginAt: Date | null
      failedLoginAttempts: number
      lockedUntil: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends User$profileArgs<ExtArgs> = {}>(args?: Subset<T, User$profileArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    searchHistory<T extends User$searchHistoryArgs<ExtArgs> = {}>(args?: Subset<T, User$searchHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analysisRequests<T extends User$analysisRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$analysisRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    watchList<T extends User$watchListArgs<ExtArgs> = {}>(args?: Subset<T, User$watchListArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly lockedUntil: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.profile
   */
  export type User$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User.searchHistory
   */
  export type User$searchHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    where?: SearchHistoryWhereInput
    orderBy?: SearchHistoryOrderByWithRelationInput | SearchHistoryOrderByWithRelationInput[]
    cursor?: SearchHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SearchHistoryScalarFieldEnum | SearchHistoryScalarFieldEnum[]
  }

  /**
   * User.analysisRequests
   */
  export type User$analysisRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    where?: AnalysisRequestWhereInput
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    cursor?: AnalysisRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisRequestScalarFieldEnum | AnalysisRequestScalarFieldEnum[]
  }

  /**
   * User.watchList
   */
  export type User$watchListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    where?: WatchListWhereInput
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    cursor?: WatchListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WatchListScalarFieldEnum | WatchListScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatarUrl: string | null
    timezone: string | null
    language: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatarUrl: string | null
    timezone: string | null
    language: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    userId: number
    firstName: number
    lastName: number
    phone: number
    avatarUrl: number
    timezone: number
    language: number
    notificationPreferences: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileMinAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatarUrl?: true
    timezone?: true
    language?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatarUrl?: true
    timezone?: true
    language?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatarUrl?: true
    timezone?: true
    language?: true
    notificationPreferences?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    userId: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatarUrl: string | null
    timezone: string
    language: string
    notificationPreferences: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatarUrl?: boolean
    timezone?: boolean
    language?: boolean
    notificationPreferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatarUrl?: boolean
    timezone?: boolean
    language?: boolean
    notificationPreferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatarUrl?: boolean
    timezone?: boolean
    language?: boolean
    notificationPreferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatarUrl?: boolean
    timezone?: boolean
    language?: boolean
    notificationPreferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "firstName" | "lastName" | "phone" | "avatarUrl" | "timezone" | "language" | "notificationPreferences" | "createdAt" | "updatedAt", ExtArgs["result"]["userProfile"]>
  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      firstName: string | null
      lastName: string | null
      phone: string | null
      avatarUrl: string | null
      timezone: string
      language: string
      notificationPreferences: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles and returns the data updated in the database.
     * @param {UserProfileUpdateManyAndReturnArgs} args - Arguments to update many UserProfiles.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProfile model
   */
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly userId: FieldRef<"UserProfile", 'String'>
    readonly firstName: FieldRef<"UserProfile", 'String'>
    readonly lastName: FieldRef<"UserProfile", 'String'>
    readonly phone: FieldRef<"UserProfile", 'String'>
    readonly avatarUrl: FieldRef<"UserProfile", 'String'>
    readonly timezone: FieldRef<"UserProfile", 'String'>
    readonly language: FieldRef<"UserProfile", 'String'>
    readonly notificationPreferences: FieldRef<"UserProfile", 'Json'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile updateManyAndReturn
   */
  export type UserProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    ipAddress: string | null
    userAgent: string | null
    expiresAt: Date | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    ipAddress: string | null
    userAgent: string | null
    expiresAt: Date | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    refreshTokenHash: number
    deviceInfo: number
    ipAddress: number
    userAgent: number
    expiresAt: number
    createdAt: number
    lastUsedAt: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    ipAddress?: true
    userAgent?: true
    expiresAt?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    ipAddress?: true
    userAgent?: true
    expiresAt?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    deviceInfo?: true
    ipAddress?: true
    userAgent?: true
    expiresAt?: true
    createdAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    refreshTokenHash: string
    deviceInfo: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    expiresAt: Date
    createdAt: Date
    lastUsedAt: Date
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }

  export type UserSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshTokenHash" | "deviceInfo" | "ipAddress" | "userAgent" | "expiresAt" | "createdAt" | "lastUsedAt", ExtArgs["result"]["userSession"]>
  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshTokenHash: string
      deviceInfo: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      expiresAt: Date
      createdAt: Date
      lastUsedAt: Date
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions and returns the data updated in the database.
     * @param {UserSessionUpdateManyAndReturnArgs} args - Arguments to update many UserSessions.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly refreshTokenHash: FieldRef<"UserSession", 'String'>
    readonly deviceInfo: FieldRef<"UserSession", 'Json'>
    readonly ipAddress: FieldRef<"UserSession", 'String'>
    readonly userAgent: FieldRef<"UserSession", 'String'>
    readonly expiresAt: FieldRef<"UserSession", 'DateTime'>
    readonly createdAt: FieldRef<"UserSession", 'DateTime'>
    readonly lastUsedAt: FieldRef<"UserSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
  }

  /**
   * UserSession updateManyAndReturn
   */
  export type UserSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to delete.
     */
    limit?: number
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    level: number | null
  }

  export type CategorySumAggregateOutputType = {
    level: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    parentId: string | null
    path: string | null
    level: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    parentId: string | null
    path: string | null
    level: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    parentId: number
    path: number
    level: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    level?: true
  }

  export type CategorySumAggregateInputType = {
    level?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    parentId?: true
    path?: true
    level?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    parentId?: true
    path?: true
    level?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    parentId?: true
    path?: true
    level?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    name: string
    parentId: string | null
    path: string
    level: number
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    parentId?: boolean
    path?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Category$parentArgs<ExtArgs>
    children?: boolean | Category$childrenArgs<ExtArgs>
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    parentId?: boolean
    path?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Category$parentArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    parentId?: boolean
    path?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Category$parentArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    parentId?: boolean
    path?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "parentId" | "path" | "level" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Category$parentArgs<ExtArgs>
    children?: boolean | Category$childrenArgs<ExtArgs>
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Category$parentArgs<ExtArgs>
  }
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Category$parentArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      parent: Prisma.$CategoryPayload<ExtArgs> | null
      children: Prisma.$CategoryPayload<ExtArgs>[]
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      parentId: string | null
      path: string
      level: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Category$parentArgs<ExtArgs> = {}>(args?: Subset<T, Category$parentArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Category$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Category$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    products<T extends Category$productsArgs<ExtArgs> = {}>(args?: Subset<T, Category$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly parentId: FieldRef<"Category", 'String'>
    readonly path: FieldRef<"Category", 'String'>
    readonly level: FieldRef<"Category", 'Int'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.parent
   */
  export type Category$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Category.children
   */
  export type Category$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category.products
   */
  export type Category$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    currentPrice: Decimal | null
    averageRating: number | null
    totalReviews: number | null
  }

  export type ProductSumAggregateOutputType = {
    currentPrice: Decimal | null
    averageRating: number | null
    totalReviews: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    categoryId: string | null
    currentPrice: Decimal | null
    averageRating: number | null
    totalReviews: number | null
    imageUrl: string | null
    isActive: boolean | null
    lastCrawledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    categoryId: string | null
    currentPrice: Decimal | null
    averageRating: number | null
    totalReviews: number | null
    imageUrl: string | null
    isActive: boolean | null
    lastCrawledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    url: number
    categoryId: number
    currentPrice: number
    averageRating: number
    totalReviews: number
    imageUrl: number
    isActive: number
    lastCrawledAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    currentPrice?: true
    averageRating?: true
    totalReviews?: true
  }

  export type ProductSumAggregateInputType = {
    currentPrice?: true
    averageRating?: true
    totalReviews?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    categoryId?: true
    currentPrice?: true
    averageRating?: true
    totalReviews?: true
    imageUrl?: true
    isActive?: true
    lastCrawledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    categoryId?: true
    currentPrice?: true
    averageRating?: true
    totalReviews?: true
    imageUrl?: true
    isActive?: true
    lastCrawledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    categoryId?: true
    currentPrice?: true
    averageRating?: true
    totalReviews?: true
    imageUrl?: true
    isActive?: true
    lastCrawledAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    name: string
    url: string
    categoryId: string | null
    currentPrice: Decimal | null
    averageRating: number | null
    totalReviews: number
    imageUrl: string | null
    isActive: boolean
    lastCrawledAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    categoryId?: boolean
    currentPrice?: boolean
    averageRating?: boolean
    totalReviews?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastCrawledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | Product$categoryArgs<ExtArgs>
    analysisResults?: boolean | Product$analysisResultsArgs<ExtArgs>
    analysisRequests?: boolean | Product$analysisRequestsArgs<ExtArgs>
    watchList?: boolean | Product$watchListArgs<ExtArgs>
    priceHistory?: boolean | Product$priceHistoryArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    categoryId?: boolean
    currentPrice?: boolean
    averageRating?: boolean
    totalReviews?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastCrawledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | Product$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    categoryId?: boolean
    currentPrice?: boolean
    averageRating?: boolean
    totalReviews?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastCrawledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | Product$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    categoryId?: boolean
    currentPrice?: boolean
    averageRating?: boolean
    totalReviews?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastCrawledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url" | "categoryId" | "currentPrice" | "averageRating" | "totalReviews" | "imageUrl" | "isActive" | "lastCrawledAt" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Product$categoryArgs<ExtArgs>
    analysisResults?: boolean | Product$analysisResultsArgs<ExtArgs>
    analysisRequests?: boolean | Product$analysisRequestsArgs<ExtArgs>
    watchList?: boolean | Product$watchListArgs<ExtArgs>
    priceHistory?: boolean | Product$priceHistoryArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Product$categoryArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Product$categoryArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs> | null
      analysisResults: Prisma.$AnalysisResultPayload<ExtArgs>[]
      analysisRequests: Prisma.$AnalysisRequestPayload<ExtArgs>[]
      watchList: Prisma.$WatchListPayload<ExtArgs>[]
      priceHistory: Prisma.$PriceHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      url: string
      categoryId: string | null
      currentPrice: Prisma.Decimal | null
      averageRating: number | null
      totalReviews: number
      imageUrl: string | null
      isActive: boolean
      lastCrawledAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends Product$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Product$categoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    analysisResults<T extends Product$analysisResultsArgs<ExtArgs> = {}>(args?: Subset<T, Product$analysisResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analysisRequests<T extends Product$analysisRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Product$analysisRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    watchList<T extends Product$watchListArgs<ExtArgs> = {}>(args?: Subset<T, Product$watchListArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    priceHistory<T extends Product$priceHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Product$priceHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly url: FieldRef<"Product", 'String'>
    readonly categoryId: FieldRef<"Product", 'String'>
    readonly currentPrice: FieldRef<"Product", 'Decimal'>
    readonly averageRating: FieldRef<"Product", 'Float'>
    readonly totalReviews: FieldRef<"Product", 'Int'>
    readonly imageUrl: FieldRef<"Product", 'String'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly lastCrawledAt: FieldRef<"Product", 'DateTime'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.category
   */
  export type Product$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Product.analysisResults
   */
  export type Product$analysisResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    where?: AnalysisResultWhereInput
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    cursor?: AnalysisResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * Product.analysisRequests
   */
  export type Product$analysisRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    where?: AnalysisRequestWhereInput
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    cursor?: AnalysisRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisRequestScalarFieldEnum | AnalysisRequestScalarFieldEnum[]
  }

  /**
   * Product.watchList
   */
  export type Product$watchListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    where?: WatchListWhereInput
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    cursor?: WatchListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WatchListScalarFieldEnum | WatchListScalarFieldEnum[]
  }

  /**
   * Product.priceHistory
   */
  export type Product$priceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    where?: PriceHistoryWhereInput
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    cursor?: PriceHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model PriceHistory
   */

  export type AggregatePriceHistory = {
    _count: PriceHistoryCountAggregateOutputType | null
    _avg: PriceHistoryAvgAggregateOutputType | null
    _sum: PriceHistorySumAggregateOutputType | null
    _min: PriceHistoryMinAggregateOutputType | null
    _max: PriceHistoryMaxAggregateOutputType | null
  }

  export type PriceHistoryAvgAggregateOutputType = {
    price: Decimal | null
  }

  export type PriceHistorySumAggregateOutputType = {
    price: Decimal | null
  }

  export type PriceHistoryMinAggregateOutputType = {
    id: string | null
    productId: string | null
    price: Decimal | null
    createdAt: Date | null
  }

  export type PriceHistoryMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    price: Decimal | null
    createdAt: Date | null
  }

  export type PriceHistoryCountAggregateOutputType = {
    id: number
    productId: number
    price: number
    createdAt: number
    _all: number
  }


  export type PriceHistoryAvgAggregateInputType = {
    price?: true
  }

  export type PriceHistorySumAggregateInputType = {
    price?: true
  }

  export type PriceHistoryMinAggregateInputType = {
    id?: true
    productId?: true
    price?: true
    createdAt?: true
  }

  export type PriceHistoryMaxAggregateInputType = {
    id?: true
    productId?: true
    price?: true
    createdAt?: true
  }

  export type PriceHistoryCountAggregateInputType = {
    id?: true
    productId?: true
    price?: true
    createdAt?: true
    _all?: true
  }

  export type PriceHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceHistory to aggregate.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriceHistories
    **/
    _count?: true | PriceHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriceHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriceHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriceHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriceHistoryMaxAggregateInputType
  }

  export type GetPriceHistoryAggregateType<T extends PriceHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePriceHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriceHistory[P]>
      : GetScalarType<T[P], AggregatePriceHistory[P]>
  }




  export type PriceHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceHistoryWhereInput
    orderBy?: PriceHistoryOrderByWithAggregationInput | PriceHistoryOrderByWithAggregationInput[]
    by: PriceHistoryScalarFieldEnum[] | PriceHistoryScalarFieldEnum
    having?: PriceHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriceHistoryCountAggregateInputType | true
    _avg?: PriceHistoryAvgAggregateInputType
    _sum?: PriceHistorySumAggregateInputType
    _min?: PriceHistoryMinAggregateInputType
    _max?: PriceHistoryMaxAggregateInputType
  }

  export type PriceHistoryGroupByOutputType = {
    id: string
    productId: string
    price: Decimal
    createdAt: Date
    _count: PriceHistoryCountAggregateOutputType | null
    _avg: PriceHistoryAvgAggregateOutputType | null
    _sum: PriceHistorySumAggregateOutputType | null
    _min: PriceHistoryMinAggregateOutputType | null
    _max: PriceHistoryMaxAggregateOutputType | null
  }

  type GetPriceHistoryGroupByPayload<T extends PriceHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriceHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriceHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriceHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PriceHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PriceHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    price?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    price?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    price?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectScalar = {
    id?: boolean
    productId?: boolean
    price?: boolean
    createdAt?: boolean
  }

  export type PriceHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "price" | "createdAt", ExtArgs["result"]["priceHistory"]>
  export type PriceHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type PriceHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type PriceHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $PriceHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriceHistory"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      price: Prisma.Decimal
      createdAt: Date
    }, ExtArgs["result"]["priceHistory"]>
    composites: {}
  }

  type PriceHistoryGetPayload<S extends boolean | null | undefined | PriceHistoryDefaultArgs> = $Result.GetResult<Prisma.$PriceHistoryPayload, S>

  type PriceHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriceHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriceHistoryCountAggregateInputType | true
    }

  export interface PriceHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriceHistory'], meta: { name: 'PriceHistory' } }
    /**
     * Find zero or one PriceHistory that matches the filter.
     * @param {PriceHistoryFindUniqueArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriceHistoryFindUniqueArgs>(args: SelectSubset<T, PriceHistoryFindUniqueArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriceHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriceHistoryFindUniqueOrThrowArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriceHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PriceHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindFirstArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriceHistoryFindFirstArgs>(args?: SelectSubset<T, PriceHistoryFindFirstArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindFirstOrThrowArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriceHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PriceHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriceHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriceHistories
     * const priceHistories = await prisma.priceHistory.findMany()
     * 
     * // Get first 10 PriceHistories
     * const priceHistories = await prisma.priceHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriceHistoryFindManyArgs>(args?: SelectSubset<T, PriceHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriceHistory.
     * @param {PriceHistoryCreateArgs} args - Arguments to create a PriceHistory.
     * @example
     * // Create one PriceHistory
     * const PriceHistory = await prisma.priceHistory.create({
     *   data: {
     *     // ... data to create a PriceHistory
     *   }
     * })
     * 
     */
    create<T extends PriceHistoryCreateArgs>(args: SelectSubset<T, PriceHistoryCreateArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriceHistories.
     * @param {PriceHistoryCreateManyArgs} args - Arguments to create many PriceHistories.
     * @example
     * // Create many PriceHistories
     * const priceHistory = await prisma.priceHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriceHistoryCreateManyArgs>(args?: SelectSubset<T, PriceHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriceHistories and returns the data saved in the database.
     * @param {PriceHistoryCreateManyAndReturnArgs} args - Arguments to create many PriceHistories.
     * @example
     * // Create many PriceHistories
     * const priceHistory = await prisma.priceHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriceHistories and only return the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriceHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PriceHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriceHistory.
     * @param {PriceHistoryDeleteArgs} args - Arguments to delete one PriceHistory.
     * @example
     * // Delete one PriceHistory
     * const PriceHistory = await prisma.priceHistory.delete({
     *   where: {
     *     // ... filter to delete one PriceHistory
     *   }
     * })
     * 
     */
    delete<T extends PriceHistoryDeleteArgs>(args: SelectSubset<T, PriceHistoryDeleteArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriceHistory.
     * @param {PriceHistoryUpdateArgs} args - Arguments to update one PriceHistory.
     * @example
     * // Update one PriceHistory
     * const priceHistory = await prisma.priceHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriceHistoryUpdateArgs>(args: SelectSubset<T, PriceHistoryUpdateArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriceHistories.
     * @param {PriceHistoryDeleteManyArgs} args - Arguments to filter PriceHistories to delete.
     * @example
     * // Delete a few PriceHistories
     * const { count } = await prisma.priceHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriceHistoryDeleteManyArgs>(args?: SelectSubset<T, PriceHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriceHistories
     * const priceHistory = await prisma.priceHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriceHistoryUpdateManyArgs>(args: SelectSubset<T, PriceHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceHistories and returns the data updated in the database.
     * @param {PriceHistoryUpdateManyAndReturnArgs} args - Arguments to update many PriceHistories.
     * @example
     * // Update many PriceHistories
     * const priceHistory = await prisma.priceHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriceHistories and only return the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PriceHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PriceHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriceHistory.
     * @param {PriceHistoryUpsertArgs} args - Arguments to update or create a PriceHistory.
     * @example
     * // Update or create a PriceHistory
     * const priceHistory = await prisma.priceHistory.upsert({
     *   create: {
     *     // ... data to create a PriceHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriceHistory we want to update
     *   }
     * })
     */
    upsert<T extends PriceHistoryUpsertArgs>(args: SelectSubset<T, PriceHistoryUpsertArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryCountArgs} args - Arguments to filter PriceHistories to count.
     * @example
     * // Count the number of PriceHistories
     * const count = await prisma.priceHistory.count({
     *   where: {
     *     // ... the filter for the PriceHistories we want to count
     *   }
     * })
    **/
    count<T extends PriceHistoryCountArgs>(
      args?: Subset<T, PriceHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriceHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PriceHistoryAggregateArgs>(args: Subset<T, PriceHistoryAggregateArgs>): Prisma.PrismaPromise<GetPriceHistoryAggregateType<T>>

    /**
     * Group by PriceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PriceHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriceHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PriceHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PriceHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriceHistory model
   */
  readonly fields: PriceHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriceHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriceHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PriceHistory model
   */
  interface PriceHistoryFieldRefs {
    readonly id: FieldRef<"PriceHistory", 'String'>
    readonly productId: FieldRef<"PriceHistory", 'String'>
    readonly price: FieldRef<"PriceHistory", 'Decimal'>
    readonly createdAt: FieldRef<"PriceHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PriceHistory findUnique
   */
  export type PriceHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory findUniqueOrThrow
   */
  export type PriceHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory findFirst
   */
  export type PriceHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceHistories.
     */
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory findFirstOrThrow
   */
  export type PriceHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceHistories.
     */
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory findMany
   */
  export type PriceHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistories to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory create
   */
  export type PriceHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PriceHistory.
     */
    data: XOR<PriceHistoryCreateInput, PriceHistoryUncheckedCreateInput>
  }

  /**
   * PriceHistory createMany
   */
  export type PriceHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriceHistories.
     */
    data: PriceHistoryCreateManyInput | PriceHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriceHistory createManyAndReturn
   */
  export type PriceHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PriceHistories.
     */
    data: PriceHistoryCreateManyInput | PriceHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceHistory update
   */
  export type PriceHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PriceHistory.
     */
    data: XOR<PriceHistoryUpdateInput, PriceHistoryUncheckedUpdateInput>
    /**
     * Choose, which PriceHistory to update.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory updateMany
   */
  export type PriceHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriceHistories.
     */
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PriceHistories to update
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to update.
     */
    limit?: number
  }

  /**
   * PriceHistory updateManyAndReturn
   */
  export type PriceHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PriceHistories.
     */
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PriceHistories to update
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceHistory upsert
   */
  export type PriceHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PriceHistory to update in case it exists.
     */
    where: PriceHistoryWhereUniqueInput
    /**
     * In case the PriceHistory found by the `where` argument doesn't exist, create a new PriceHistory with this data.
     */
    create: XOR<PriceHistoryCreateInput, PriceHistoryUncheckedCreateInput>
    /**
     * In case the PriceHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriceHistoryUpdateInput, PriceHistoryUncheckedUpdateInput>
  }

  /**
   * PriceHistory delete
   */
  export type PriceHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter which PriceHistory to delete.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory deleteMany
   */
  export type PriceHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceHistories to delete
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to delete.
     */
    limit?: number
  }

  /**
   * PriceHistory without action
   */
  export type PriceHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisRequest
   */

  export type AggregateAnalysisRequest = {
    _count: AnalysisRequestCountAggregateOutputType | null
    _avg: AnalysisRequestAvgAggregateOutputType | null
    _sum: AnalysisRequestSumAggregateOutputType | null
    _min: AnalysisRequestMinAggregateOutputType | null
    _max: AnalysisRequestMaxAggregateOutputType | null
  }

  export type AnalysisRequestAvgAggregateOutputType = {
    progress: number | null
    priority: number | null
  }

  export type AnalysisRequestSumAggregateOutputType = {
    progress: number | null
    priority: number | null
  }

  export type AnalysisRequestMinAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    taskId: string | null
    status: string | null
    progress: number | null
    requestType: string | null
    priority: number | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type AnalysisRequestMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    taskId: string | null
    status: string | null
    progress: number | null
    requestType: string | null
    priority: number | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type AnalysisRequestCountAggregateOutputType = {
    id: number
    userId: number
    productId: number
    taskId: number
    status: number
    progress: number
    requestType: number
    priority: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type AnalysisRequestAvgAggregateInputType = {
    progress?: true
    priority?: true
  }

  export type AnalysisRequestSumAggregateInputType = {
    progress?: true
    priority?: true
  }

  export type AnalysisRequestMinAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    taskId?: true
    status?: true
    progress?: true
    requestType?: true
    priority?: true
    createdAt?: true
    completedAt?: true
  }

  export type AnalysisRequestMaxAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    taskId?: true
    status?: true
    progress?: true
    requestType?: true
    priority?: true
    createdAt?: true
    completedAt?: true
  }

  export type AnalysisRequestCountAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    taskId?: true
    status?: true
    progress?: true
    requestType?: true
    priority?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type AnalysisRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisRequest to aggregate.
     */
    where?: AnalysisRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisRequests to fetch.
     */
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisRequests
    **/
    _count?: true | AnalysisRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisRequestMaxAggregateInputType
  }

  export type GetAnalysisRequestAggregateType<T extends AnalysisRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisRequest[P]>
      : GetScalarType<T[P], AggregateAnalysisRequest[P]>
  }




  export type AnalysisRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisRequestWhereInput
    orderBy?: AnalysisRequestOrderByWithAggregationInput | AnalysisRequestOrderByWithAggregationInput[]
    by: AnalysisRequestScalarFieldEnum[] | AnalysisRequestScalarFieldEnum
    having?: AnalysisRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisRequestCountAggregateInputType | true
    _avg?: AnalysisRequestAvgAggregateInputType
    _sum?: AnalysisRequestSumAggregateInputType
    _min?: AnalysisRequestMinAggregateInputType
    _max?: AnalysisRequestMaxAggregateInputType
  }

  export type AnalysisRequestGroupByOutputType = {
    id: string
    userId: string | null
    productId: string
    taskId: string
    status: string
    progress: number
    requestType: string
    priority: number
    createdAt: Date
    completedAt: Date | null
    _count: AnalysisRequestCountAggregateOutputType | null
    _avg: AnalysisRequestAvgAggregateOutputType | null
    _sum: AnalysisRequestSumAggregateOutputType | null
    _min: AnalysisRequestMinAggregateOutputType | null
    _max: AnalysisRequestMaxAggregateOutputType | null
  }

  type GetAnalysisRequestGroupByPayload<T extends AnalysisRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisRequestGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisRequestGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    progress?: boolean
    requestType?: boolean
    priority?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisRequest"]>

  export type AnalysisRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    progress?: boolean
    requestType?: boolean
    priority?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisRequest"]>

  export type AnalysisRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    progress?: boolean
    requestType?: boolean
    priority?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisRequest"]>

  export type AnalysisRequestSelectScalar = {
    id?: boolean
    userId?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    progress?: boolean
    requestType?: boolean
    priority?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type AnalysisRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "productId" | "taskId" | "status" | "progress" | "requestType" | "priority" | "createdAt" | "completedAt", ExtArgs["result"]["analysisRequest"]>
  export type AnalysisRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type AnalysisRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type AnalysisRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AnalysisRequest$userArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $AnalysisRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisRequest"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      productId: string
      taskId: string
      status: string
      progress: number
      requestType: string
      priority: number
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["analysisRequest"]>
    composites: {}
  }

  type AnalysisRequestGetPayload<S extends boolean | null | undefined | AnalysisRequestDefaultArgs> = $Result.GetResult<Prisma.$AnalysisRequestPayload, S>

  type AnalysisRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisRequestCountAggregateInputType | true
    }

  export interface AnalysisRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisRequest'], meta: { name: 'AnalysisRequest' } }
    /**
     * Find zero or one AnalysisRequest that matches the filter.
     * @param {AnalysisRequestFindUniqueArgs} args - Arguments to find a AnalysisRequest
     * @example
     * // Get one AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisRequestFindUniqueArgs>(args: SelectSubset<T, AnalysisRequestFindUniqueArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisRequestFindUniqueOrThrowArgs} args - Arguments to find a AnalysisRequest
     * @example
     * // Get one AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestFindFirstArgs} args - Arguments to find a AnalysisRequest
     * @example
     * // Get one AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisRequestFindFirstArgs>(args?: SelectSubset<T, AnalysisRequestFindFirstArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestFindFirstOrThrowArgs} args - Arguments to find a AnalysisRequest
     * @example
     * // Get one AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisRequests
     * const analysisRequests = await prisma.analysisRequest.findMany()
     * 
     * // Get first 10 AnalysisRequests
     * const analysisRequests = await prisma.analysisRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisRequestWithIdOnly = await prisma.analysisRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisRequestFindManyArgs>(args?: SelectSubset<T, AnalysisRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisRequest.
     * @param {AnalysisRequestCreateArgs} args - Arguments to create a AnalysisRequest.
     * @example
     * // Create one AnalysisRequest
     * const AnalysisRequest = await prisma.analysisRequest.create({
     *   data: {
     *     // ... data to create a AnalysisRequest
     *   }
     * })
     * 
     */
    create<T extends AnalysisRequestCreateArgs>(args: SelectSubset<T, AnalysisRequestCreateArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisRequests.
     * @param {AnalysisRequestCreateManyArgs} args - Arguments to create many AnalysisRequests.
     * @example
     * // Create many AnalysisRequests
     * const analysisRequest = await prisma.analysisRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisRequestCreateManyArgs>(args?: SelectSubset<T, AnalysisRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisRequests and returns the data saved in the database.
     * @param {AnalysisRequestCreateManyAndReturnArgs} args - Arguments to create many AnalysisRequests.
     * @example
     * // Create many AnalysisRequests
     * const analysisRequest = await prisma.analysisRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisRequests and only return the `id`
     * const analysisRequestWithIdOnly = await prisma.analysisRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisRequest.
     * @param {AnalysisRequestDeleteArgs} args - Arguments to delete one AnalysisRequest.
     * @example
     * // Delete one AnalysisRequest
     * const AnalysisRequest = await prisma.analysisRequest.delete({
     *   where: {
     *     // ... filter to delete one AnalysisRequest
     *   }
     * })
     * 
     */
    delete<T extends AnalysisRequestDeleteArgs>(args: SelectSubset<T, AnalysisRequestDeleteArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisRequest.
     * @param {AnalysisRequestUpdateArgs} args - Arguments to update one AnalysisRequest.
     * @example
     * // Update one AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisRequestUpdateArgs>(args: SelectSubset<T, AnalysisRequestUpdateArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisRequests.
     * @param {AnalysisRequestDeleteManyArgs} args - Arguments to filter AnalysisRequests to delete.
     * @example
     * // Delete a few AnalysisRequests
     * const { count } = await prisma.analysisRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisRequestDeleteManyArgs>(args?: SelectSubset<T, AnalysisRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisRequests
     * const analysisRequest = await prisma.analysisRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisRequestUpdateManyArgs>(args: SelectSubset<T, AnalysisRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisRequests and returns the data updated in the database.
     * @param {AnalysisRequestUpdateManyAndReturnArgs} args - Arguments to update many AnalysisRequests.
     * @example
     * // Update many AnalysisRequests
     * const analysisRequest = await prisma.analysisRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisRequests and only return the `id`
     * const analysisRequestWithIdOnly = await prisma.analysisRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisRequest.
     * @param {AnalysisRequestUpsertArgs} args - Arguments to update or create a AnalysisRequest.
     * @example
     * // Update or create a AnalysisRequest
     * const analysisRequest = await prisma.analysisRequest.upsert({
     *   create: {
     *     // ... data to create a AnalysisRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisRequest we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisRequestUpsertArgs>(args: SelectSubset<T, AnalysisRequestUpsertArgs<ExtArgs>>): Prisma__AnalysisRequestClient<$Result.GetResult<Prisma.$AnalysisRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestCountArgs} args - Arguments to filter AnalysisRequests to count.
     * @example
     * // Count the number of AnalysisRequests
     * const count = await prisma.analysisRequest.count({
     *   where: {
     *     // ... the filter for the AnalysisRequests we want to count
     *   }
     * })
    **/
    count<T extends AnalysisRequestCountArgs>(
      args?: Subset<T, AnalysisRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisRequestAggregateArgs>(args: Subset<T, AnalysisRequestAggregateArgs>): Prisma.PrismaPromise<GetAnalysisRequestAggregateType<T>>

    /**
     * Group by AnalysisRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisRequestGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisRequest model
   */
  readonly fields: AnalysisRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AnalysisRequest$userArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisRequest$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisRequest model
   */
  interface AnalysisRequestFieldRefs {
    readonly id: FieldRef<"AnalysisRequest", 'String'>
    readonly userId: FieldRef<"AnalysisRequest", 'String'>
    readonly productId: FieldRef<"AnalysisRequest", 'String'>
    readonly taskId: FieldRef<"AnalysisRequest", 'String'>
    readonly status: FieldRef<"AnalysisRequest", 'String'>
    readonly progress: FieldRef<"AnalysisRequest", 'Int'>
    readonly requestType: FieldRef<"AnalysisRequest", 'String'>
    readonly priority: FieldRef<"AnalysisRequest", 'Int'>
    readonly createdAt: FieldRef<"AnalysisRequest", 'DateTime'>
    readonly completedAt: FieldRef<"AnalysisRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisRequest findUnique
   */
  export type AnalysisRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisRequest to fetch.
     */
    where: AnalysisRequestWhereUniqueInput
  }

  /**
   * AnalysisRequest findUniqueOrThrow
   */
  export type AnalysisRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisRequest to fetch.
     */
    where: AnalysisRequestWhereUniqueInput
  }

  /**
   * AnalysisRequest findFirst
   */
  export type AnalysisRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisRequest to fetch.
     */
    where?: AnalysisRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisRequests to fetch.
     */
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisRequests.
     */
    cursor?: AnalysisRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisRequests.
     */
    distinct?: AnalysisRequestScalarFieldEnum | AnalysisRequestScalarFieldEnum[]
  }

  /**
   * AnalysisRequest findFirstOrThrow
   */
  export type AnalysisRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisRequest to fetch.
     */
    where?: AnalysisRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisRequests to fetch.
     */
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisRequests.
     */
    cursor?: AnalysisRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisRequests.
     */
    distinct?: AnalysisRequestScalarFieldEnum | AnalysisRequestScalarFieldEnum[]
  }

  /**
   * AnalysisRequest findMany
   */
  export type AnalysisRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisRequests to fetch.
     */
    where?: AnalysisRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisRequests to fetch.
     */
    orderBy?: AnalysisRequestOrderByWithRelationInput | AnalysisRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisRequests.
     */
    cursor?: AnalysisRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisRequests.
     */
    skip?: number
    distinct?: AnalysisRequestScalarFieldEnum | AnalysisRequestScalarFieldEnum[]
  }

  /**
   * AnalysisRequest create
   */
  export type AnalysisRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisRequest.
     */
    data: XOR<AnalysisRequestCreateInput, AnalysisRequestUncheckedCreateInput>
  }

  /**
   * AnalysisRequest createMany
   */
  export type AnalysisRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisRequests.
     */
    data: AnalysisRequestCreateManyInput | AnalysisRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisRequest createManyAndReturn
   */
  export type AnalysisRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisRequests.
     */
    data: AnalysisRequestCreateManyInput | AnalysisRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisRequest update
   */
  export type AnalysisRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisRequest.
     */
    data: XOR<AnalysisRequestUpdateInput, AnalysisRequestUncheckedUpdateInput>
    /**
     * Choose, which AnalysisRequest to update.
     */
    where: AnalysisRequestWhereUniqueInput
  }

  /**
   * AnalysisRequest updateMany
   */
  export type AnalysisRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisRequests.
     */
    data: XOR<AnalysisRequestUpdateManyMutationInput, AnalysisRequestUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisRequests to update
     */
    where?: AnalysisRequestWhereInput
    /**
     * Limit how many AnalysisRequests to update.
     */
    limit?: number
  }

  /**
   * AnalysisRequest updateManyAndReturn
   */
  export type AnalysisRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisRequests.
     */
    data: XOR<AnalysisRequestUpdateManyMutationInput, AnalysisRequestUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisRequests to update
     */
    where?: AnalysisRequestWhereInput
    /**
     * Limit how many AnalysisRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisRequest upsert
   */
  export type AnalysisRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisRequest to update in case it exists.
     */
    where: AnalysisRequestWhereUniqueInput
    /**
     * In case the AnalysisRequest found by the `where` argument doesn't exist, create a new AnalysisRequest with this data.
     */
    create: XOR<AnalysisRequestCreateInput, AnalysisRequestUncheckedCreateInput>
    /**
     * In case the AnalysisRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisRequestUpdateInput, AnalysisRequestUncheckedUpdateInput>
  }

  /**
   * AnalysisRequest delete
   */
  export type AnalysisRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
    /**
     * Filter which AnalysisRequest to delete.
     */
    where: AnalysisRequestWhereUniqueInput
  }

  /**
   * AnalysisRequest deleteMany
   */
  export type AnalysisRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisRequests to delete
     */
    where?: AnalysisRequestWhereInput
    /**
     * Limit how many AnalysisRequests to delete.
     */
    limit?: number
  }

  /**
   * AnalysisRequest.user
   */
  export type AnalysisRequest$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AnalysisRequest without action
   */
  export type AnalysisRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisRequest
     */
    select?: AnalysisRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisRequest
     */
    omit?: AnalysisRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisRequestInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisResult
   */

  export type AggregateAnalysisResult = {
    _count: AnalysisResultCountAggregateOutputType | null
    _avg: AnalysisResultAvgAggregateOutputType | null
    _sum: AnalysisResultSumAggregateOutputType | null
    _min: AnalysisResultMinAggregateOutputType | null
    _max: AnalysisResultMaxAggregateOutputType | null
  }

  export type AnalysisResultAvgAggregateOutputType = {
    sentimentPositive: number | null
    sentimentNegative: number | null
    sentimentNeutral: number | null
    totalReviews: number | null
    averageRating: number | null
    processingTime: number | null
  }

  export type AnalysisResultSumAggregateOutputType = {
    sentimentPositive: number | null
    sentimentNegative: number | null
    sentimentNeutral: number | null
    totalReviews: number | null
    averageRating: number | null
    processingTime: number | null
  }

  export type AnalysisResultMinAggregateOutputType = {
    id: string | null
    productId: string | null
    taskId: string | null
    status: string | null
    sentimentPositive: number | null
    sentimentNegative: number | null
    sentimentNeutral: number | null
    summary: string | null
    totalReviews: number | null
    averageRating: number | null
    errorMessage: string | null
    processingTime: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalysisResultMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    taskId: string | null
    status: string | null
    sentimentPositive: number | null
    sentimentNegative: number | null
    sentimentNeutral: number | null
    summary: string | null
    totalReviews: number | null
    averageRating: number | null
    errorMessage: string | null
    processingTime: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalysisResultCountAggregateOutputType = {
    id: number
    productId: number
    taskId: number
    status: number
    sentimentPositive: number
    sentimentNegative: number
    sentimentNeutral: number
    summary: number
    keywords: number
    totalReviews: number
    averageRating: number
    ratingDistribution: number
    errorMessage: number
    processingTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnalysisResultAvgAggregateInputType = {
    sentimentPositive?: true
    sentimentNegative?: true
    sentimentNeutral?: true
    totalReviews?: true
    averageRating?: true
    processingTime?: true
  }

  export type AnalysisResultSumAggregateInputType = {
    sentimentPositive?: true
    sentimentNegative?: true
    sentimentNeutral?: true
    totalReviews?: true
    averageRating?: true
    processingTime?: true
  }

  export type AnalysisResultMinAggregateInputType = {
    id?: true
    productId?: true
    taskId?: true
    status?: true
    sentimentPositive?: true
    sentimentNegative?: true
    sentimentNeutral?: true
    summary?: true
    totalReviews?: true
    averageRating?: true
    errorMessage?: true
    processingTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalysisResultMaxAggregateInputType = {
    id?: true
    productId?: true
    taskId?: true
    status?: true
    sentimentPositive?: true
    sentimentNegative?: true
    sentimentNeutral?: true
    summary?: true
    totalReviews?: true
    averageRating?: true
    errorMessage?: true
    processingTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalysisResultCountAggregateInputType = {
    id?: true
    productId?: true
    taskId?: true
    status?: true
    sentimentPositive?: true
    sentimentNegative?: true
    sentimentNeutral?: true
    summary?: true
    keywords?: true
    totalReviews?: true
    averageRating?: true
    ratingDistribution?: true
    errorMessage?: true
    processingTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnalysisResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisResult to aggregate.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisResults
    **/
    _count?: true | AnalysisResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisResultMaxAggregateInputType
  }

  export type GetAnalysisResultAggregateType<T extends AnalysisResultAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisResult[P]>
      : GetScalarType<T[P], AggregateAnalysisResult[P]>
  }




  export type AnalysisResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisResultWhereInput
    orderBy?: AnalysisResultOrderByWithAggregationInput | AnalysisResultOrderByWithAggregationInput[]
    by: AnalysisResultScalarFieldEnum[] | AnalysisResultScalarFieldEnum
    having?: AnalysisResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisResultCountAggregateInputType | true
    _avg?: AnalysisResultAvgAggregateInputType
    _sum?: AnalysisResultSumAggregateInputType
    _min?: AnalysisResultMinAggregateInputType
    _max?: AnalysisResultMaxAggregateInputType
  }

  export type AnalysisResultGroupByOutputType = {
    id: string
    productId: string
    taskId: string
    status: string
    sentimentPositive: number | null
    sentimentNegative: number | null
    sentimentNeutral: number | null
    summary: string | null
    keywords: JsonValue | null
    totalReviews: number
    averageRating: number | null
    ratingDistribution: JsonValue | null
    errorMessage: string | null
    processingTime: number | null
    createdAt: Date
    updatedAt: Date
    _count: AnalysisResultCountAggregateOutputType | null
    _avg: AnalysisResultAvgAggregateOutputType | null
    _sum: AnalysisResultSumAggregateOutputType | null
    _min: AnalysisResultMinAggregateOutputType | null
    _max: AnalysisResultMaxAggregateOutputType | null
  }

  type GetAnalysisResultGroupByPayload<T extends AnalysisResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisResultGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisResultGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    sentimentPositive?: boolean
    sentimentNegative?: boolean
    sentimentNeutral?: boolean
    summary?: boolean
    keywords?: boolean
    totalReviews?: boolean
    averageRating?: boolean
    ratingDistribution?: boolean
    errorMessage?: boolean
    processingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    keywordEntries?: boolean | AnalysisResult$keywordEntriesArgs<ExtArgs>
    _count?: boolean | AnalysisResultCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    sentimentPositive?: boolean
    sentimentNegative?: boolean
    sentimentNeutral?: boolean
    summary?: boolean
    keywords?: boolean
    totalReviews?: boolean
    averageRating?: boolean
    ratingDistribution?: boolean
    errorMessage?: boolean
    processingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    sentimentPositive?: boolean
    sentimentNegative?: boolean
    sentimentNeutral?: boolean
    summary?: boolean
    keywords?: boolean
    totalReviews?: boolean
    averageRating?: boolean
    ratingDistribution?: boolean
    errorMessage?: boolean
    processingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectScalar = {
    id?: boolean
    productId?: boolean
    taskId?: boolean
    status?: boolean
    sentimentPositive?: boolean
    sentimentNegative?: boolean
    sentimentNeutral?: boolean
    summary?: boolean
    keywords?: boolean
    totalReviews?: boolean
    averageRating?: boolean
    ratingDistribution?: boolean
    errorMessage?: boolean
    processingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnalysisResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "taskId" | "status" | "sentimentPositive" | "sentimentNegative" | "sentimentNeutral" | "summary" | "keywords" | "totalReviews" | "averageRating" | "ratingDistribution" | "errorMessage" | "processingTime" | "createdAt" | "updatedAt", ExtArgs["result"]["analysisResult"]>
  export type AnalysisResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    keywordEntries?: boolean | AnalysisResult$keywordEntriesArgs<ExtArgs>
    _count?: boolean | AnalysisResultCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnalysisResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type AnalysisResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $AnalysisResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisResult"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      keywordEntries: Prisma.$KeywordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      taskId: string
      status: string
      sentimentPositive: number | null
      sentimentNegative: number | null
      sentimentNeutral: number | null
      summary: string | null
      keywords: Prisma.JsonValue | null
      totalReviews: number
      averageRating: number | null
      ratingDistribution: Prisma.JsonValue | null
      errorMessage: string | null
      processingTime: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["analysisResult"]>
    composites: {}
  }

  type AnalysisResultGetPayload<S extends boolean | null | undefined | AnalysisResultDefaultArgs> = $Result.GetResult<Prisma.$AnalysisResultPayload, S>

  type AnalysisResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisResultCountAggregateInputType | true
    }

  export interface AnalysisResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisResult'], meta: { name: 'AnalysisResult' } }
    /**
     * Find zero or one AnalysisResult that matches the filter.
     * @param {AnalysisResultFindUniqueArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisResultFindUniqueArgs>(args: SelectSubset<T, AnalysisResultFindUniqueArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisResultFindUniqueOrThrowArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisResultFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindFirstArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisResultFindFirstArgs>(args?: SelectSubset<T, AnalysisResultFindFirstArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindFirstOrThrowArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisResultFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisResults
     * const analysisResults = await prisma.analysisResult.findMany()
     * 
     * // Get first 10 AnalysisResults
     * const analysisResults = await prisma.analysisResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisResultFindManyArgs>(args?: SelectSubset<T, AnalysisResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisResult.
     * @param {AnalysisResultCreateArgs} args - Arguments to create a AnalysisResult.
     * @example
     * // Create one AnalysisResult
     * const AnalysisResult = await prisma.analysisResult.create({
     *   data: {
     *     // ... data to create a AnalysisResult
     *   }
     * })
     * 
     */
    create<T extends AnalysisResultCreateArgs>(args: SelectSubset<T, AnalysisResultCreateArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisResults.
     * @param {AnalysisResultCreateManyArgs} args - Arguments to create many AnalysisResults.
     * @example
     * // Create many AnalysisResults
     * const analysisResult = await prisma.analysisResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisResultCreateManyArgs>(args?: SelectSubset<T, AnalysisResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisResults and returns the data saved in the database.
     * @param {AnalysisResultCreateManyAndReturnArgs} args - Arguments to create many AnalysisResults.
     * @example
     * // Create many AnalysisResults
     * const analysisResult = await prisma.analysisResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisResults and only return the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisResultCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisResult.
     * @param {AnalysisResultDeleteArgs} args - Arguments to delete one AnalysisResult.
     * @example
     * // Delete one AnalysisResult
     * const AnalysisResult = await prisma.analysisResult.delete({
     *   where: {
     *     // ... filter to delete one AnalysisResult
     *   }
     * })
     * 
     */
    delete<T extends AnalysisResultDeleteArgs>(args: SelectSubset<T, AnalysisResultDeleteArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisResult.
     * @param {AnalysisResultUpdateArgs} args - Arguments to update one AnalysisResult.
     * @example
     * // Update one AnalysisResult
     * const analysisResult = await prisma.analysisResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisResultUpdateArgs>(args: SelectSubset<T, AnalysisResultUpdateArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisResults.
     * @param {AnalysisResultDeleteManyArgs} args - Arguments to filter AnalysisResults to delete.
     * @example
     * // Delete a few AnalysisResults
     * const { count } = await prisma.analysisResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisResultDeleteManyArgs>(args?: SelectSubset<T, AnalysisResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisResults
     * const analysisResult = await prisma.analysisResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisResultUpdateManyArgs>(args: SelectSubset<T, AnalysisResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisResults and returns the data updated in the database.
     * @param {AnalysisResultUpdateManyAndReturnArgs} args - Arguments to update many AnalysisResults.
     * @example
     * // Update many AnalysisResults
     * const analysisResult = await prisma.analysisResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisResults and only return the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisResultUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisResult.
     * @param {AnalysisResultUpsertArgs} args - Arguments to update or create a AnalysisResult.
     * @example
     * // Update or create a AnalysisResult
     * const analysisResult = await prisma.analysisResult.upsert({
     *   create: {
     *     // ... data to create a AnalysisResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisResult we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisResultUpsertArgs>(args: SelectSubset<T, AnalysisResultUpsertArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultCountArgs} args - Arguments to filter AnalysisResults to count.
     * @example
     * // Count the number of AnalysisResults
     * const count = await prisma.analysisResult.count({
     *   where: {
     *     // ... the filter for the AnalysisResults we want to count
     *   }
     * })
    **/
    count<T extends AnalysisResultCountArgs>(
      args?: Subset<T, AnalysisResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisResultAggregateArgs>(args: Subset<T, AnalysisResultAggregateArgs>): Prisma.PrismaPromise<GetAnalysisResultAggregateType<T>>

    /**
     * Group by AnalysisResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisResultGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisResult model
   */
  readonly fields: AnalysisResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    keywordEntries<T extends AnalysisResult$keywordEntriesArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisResult$keywordEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisResult model
   */
  interface AnalysisResultFieldRefs {
    readonly id: FieldRef<"AnalysisResult", 'String'>
    readonly productId: FieldRef<"AnalysisResult", 'String'>
    readonly taskId: FieldRef<"AnalysisResult", 'String'>
    readonly status: FieldRef<"AnalysisResult", 'String'>
    readonly sentimentPositive: FieldRef<"AnalysisResult", 'Float'>
    readonly sentimentNegative: FieldRef<"AnalysisResult", 'Float'>
    readonly sentimentNeutral: FieldRef<"AnalysisResult", 'Float'>
    readonly summary: FieldRef<"AnalysisResult", 'String'>
    readonly keywords: FieldRef<"AnalysisResult", 'Json'>
    readonly totalReviews: FieldRef<"AnalysisResult", 'Int'>
    readonly averageRating: FieldRef<"AnalysisResult", 'Float'>
    readonly ratingDistribution: FieldRef<"AnalysisResult", 'Json'>
    readonly errorMessage: FieldRef<"AnalysisResult", 'String'>
    readonly processingTime: FieldRef<"AnalysisResult", 'Int'>
    readonly createdAt: FieldRef<"AnalysisResult", 'DateTime'>
    readonly updatedAt: FieldRef<"AnalysisResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisResult findUnique
   */
  export type AnalysisResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult findUniqueOrThrow
   */
  export type AnalysisResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult findFirst
   */
  export type AnalysisResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisResults.
     */
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult findFirstOrThrow
   */
  export type AnalysisResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisResults.
     */
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult findMany
   */
  export type AnalysisResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResults to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult create
   */
  export type AnalysisResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisResult.
     */
    data: XOR<AnalysisResultCreateInput, AnalysisResultUncheckedCreateInput>
  }

  /**
   * AnalysisResult createMany
   */
  export type AnalysisResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisResults.
     */
    data: AnalysisResultCreateManyInput | AnalysisResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisResult createManyAndReturn
   */
  export type AnalysisResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisResults.
     */
    data: AnalysisResultCreateManyInput | AnalysisResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisResult update
   */
  export type AnalysisResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisResult.
     */
    data: XOR<AnalysisResultUpdateInput, AnalysisResultUncheckedUpdateInput>
    /**
     * Choose, which AnalysisResult to update.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult updateMany
   */
  export type AnalysisResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisResults.
     */
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisResults to update
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to update.
     */
    limit?: number
  }

  /**
   * AnalysisResult updateManyAndReturn
   */
  export type AnalysisResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisResults.
     */
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisResults to update
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisResult upsert
   */
  export type AnalysisResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisResult to update in case it exists.
     */
    where: AnalysisResultWhereUniqueInput
    /**
     * In case the AnalysisResult found by the `where` argument doesn't exist, create a new AnalysisResult with this data.
     */
    create: XOR<AnalysisResultCreateInput, AnalysisResultUncheckedCreateInput>
    /**
     * In case the AnalysisResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisResultUpdateInput, AnalysisResultUncheckedUpdateInput>
  }

  /**
   * AnalysisResult delete
   */
  export type AnalysisResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter which AnalysisResult to delete.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult deleteMany
   */
  export type AnalysisResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisResults to delete
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to delete.
     */
    limit?: number
  }

  /**
   * AnalysisResult.keywordEntries
   */
  export type AnalysisResult$keywordEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    where?: KeywordWhereInput
    orderBy?: KeywordOrderByWithRelationInput | KeywordOrderByWithRelationInput[]
    cursor?: KeywordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KeywordScalarFieldEnum | KeywordScalarFieldEnum[]
  }

  /**
   * AnalysisResult without action
   */
  export type AnalysisResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
  }


  /**
   * Model Keyword
   */

  export type AggregateKeyword = {
    _count: KeywordCountAggregateOutputType | null
    _avg: KeywordAvgAggregateOutputType | null
    _sum: KeywordSumAggregateOutputType | null
    _min: KeywordMinAggregateOutputType | null
    _max: KeywordMaxAggregateOutputType | null
  }

  export type KeywordAvgAggregateOutputType = {
    frequency: number | null
    confidence: number | null
  }

  export type KeywordSumAggregateOutputType = {
    frequency: number | null
    confidence: number | null
  }

  export type KeywordMinAggregateOutputType = {
    id: string | null
    analysisResultId: string | null
    keyword: string | null
    sentiment: string | null
    frequency: number | null
    confidence: number | null
    createdAt: Date | null
  }

  export type KeywordMaxAggregateOutputType = {
    id: string | null
    analysisResultId: string | null
    keyword: string | null
    sentiment: string | null
    frequency: number | null
    confidence: number | null
    createdAt: Date | null
  }

  export type KeywordCountAggregateOutputType = {
    id: number
    analysisResultId: number
    keyword: number
    sentiment: number
    frequency: number
    confidence: number
    createdAt: number
    _all: number
  }


  export type KeywordAvgAggregateInputType = {
    frequency?: true
    confidence?: true
  }

  export type KeywordSumAggregateInputType = {
    frequency?: true
    confidence?: true
  }

  export type KeywordMinAggregateInputType = {
    id?: true
    analysisResultId?: true
    keyword?: true
    sentiment?: true
    frequency?: true
    confidence?: true
    createdAt?: true
  }

  export type KeywordMaxAggregateInputType = {
    id?: true
    analysisResultId?: true
    keyword?: true
    sentiment?: true
    frequency?: true
    confidence?: true
    createdAt?: true
  }

  export type KeywordCountAggregateInputType = {
    id?: true
    analysisResultId?: true
    keyword?: true
    sentiment?: true
    frequency?: true
    confidence?: true
    createdAt?: true
    _all?: true
  }

  export type KeywordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Keyword to aggregate.
     */
    where?: KeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Keywords to fetch.
     */
    orderBy?: KeywordOrderByWithRelationInput | KeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Keywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Keywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Keywords
    **/
    _count?: true | KeywordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KeywordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KeywordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KeywordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KeywordMaxAggregateInputType
  }

  export type GetKeywordAggregateType<T extends KeywordAggregateArgs> = {
        [P in keyof T & keyof AggregateKeyword]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKeyword[P]>
      : GetScalarType<T[P], AggregateKeyword[P]>
  }




  export type KeywordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeywordWhereInput
    orderBy?: KeywordOrderByWithAggregationInput | KeywordOrderByWithAggregationInput[]
    by: KeywordScalarFieldEnum[] | KeywordScalarFieldEnum
    having?: KeywordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KeywordCountAggregateInputType | true
    _avg?: KeywordAvgAggregateInputType
    _sum?: KeywordSumAggregateInputType
    _min?: KeywordMinAggregateInputType
    _max?: KeywordMaxAggregateInputType
  }

  export type KeywordGroupByOutputType = {
    id: string
    analysisResultId: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt: Date
    _count: KeywordCountAggregateOutputType | null
    _avg: KeywordAvgAggregateOutputType | null
    _sum: KeywordSumAggregateOutputType | null
    _min: KeywordMinAggregateOutputType | null
    _max: KeywordMaxAggregateOutputType | null
  }

  type GetKeywordGroupByPayload<T extends KeywordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KeywordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KeywordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KeywordGroupByOutputType[P]>
            : GetScalarType<T[P], KeywordGroupByOutputType[P]>
        }
      >
    >


  export type KeywordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisResultId?: boolean
    keyword?: boolean
    sentiment?: boolean
    frequency?: boolean
    confidence?: boolean
    createdAt?: boolean
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyword"]>

  export type KeywordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisResultId?: boolean
    keyword?: boolean
    sentiment?: boolean
    frequency?: boolean
    confidence?: boolean
    createdAt?: boolean
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyword"]>

  export type KeywordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisResultId?: boolean
    keyword?: boolean
    sentiment?: boolean
    frequency?: boolean
    confidence?: boolean
    createdAt?: boolean
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyword"]>

  export type KeywordSelectScalar = {
    id?: boolean
    analysisResultId?: boolean
    keyword?: boolean
    sentiment?: boolean
    frequency?: boolean
    confidence?: boolean
    createdAt?: boolean
  }

  export type KeywordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "analysisResultId" | "keyword" | "sentiment" | "frequency" | "confidence" | "createdAt", ExtArgs["result"]["keyword"]>
  export type KeywordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }
  export type KeywordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }
  export type KeywordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisResult?: boolean | AnalysisResultDefaultArgs<ExtArgs>
  }

  export type $KeywordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Keyword"
    objects: {
      analysisResult: Prisma.$AnalysisResultPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      analysisResultId: string
      keyword: string
      sentiment: string
      frequency: number
      confidence: number
      createdAt: Date
    }, ExtArgs["result"]["keyword"]>
    composites: {}
  }

  type KeywordGetPayload<S extends boolean | null | undefined | KeywordDefaultArgs> = $Result.GetResult<Prisma.$KeywordPayload, S>

  type KeywordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KeywordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KeywordCountAggregateInputType | true
    }

  export interface KeywordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Keyword'], meta: { name: 'Keyword' } }
    /**
     * Find zero or one Keyword that matches the filter.
     * @param {KeywordFindUniqueArgs} args - Arguments to find a Keyword
     * @example
     * // Get one Keyword
     * const keyword = await prisma.keyword.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KeywordFindUniqueArgs>(args: SelectSubset<T, KeywordFindUniqueArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Keyword that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KeywordFindUniqueOrThrowArgs} args - Arguments to find a Keyword
     * @example
     * // Get one Keyword
     * const keyword = await prisma.keyword.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KeywordFindUniqueOrThrowArgs>(args: SelectSubset<T, KeywordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Keyword that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordFindFirstArgs} args - Arguments to find a Keyword
     * @example
     * // Get one Keyword
     * const keyword = await prisma.keyword.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KeywordFindFirstArgs>(args?: SelectSubset<T, KeywordFindFirstArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Keyword that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordFindFirstOrThrowArgs} args - Arguments to find a Keyword
     * @example
     * // Get one Keyword
     * const keyword = await prisma.keyword.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KeywordFindFirstOrThrowArgs>(args?: SelectSubset<T, KeywordFindFirstOrThrowArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Keywords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Keywords
     * const keywords = await prisma.keyword.findMany()
     * 
     * // Get first 10 Keywords
     * const keywords = await prisma.keyword.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const keywordWithIdOnly = await prisma.keyword.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KeywordFindManyArgs>(args?: SelectSubset<T, KeywordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Keyword.
     * @param {KeywordCreateArgs} args - Arguments to create a Keyword.
     * @example
     * // Create one Keyword
     * const Keyword = await prisma.keyword.create({
     *   data: {
     *     // ... data to create a Keyword
     *   }
     * })
     * 
     */
    create<T extends KeywordCreateArgs>(args: SelectSubset<T, KeywordCreateArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Keywords.
     * @param {KeywordCreateManyArgs} args - Arguments to create many Keywords.
     * @example
     * // Create many Keywords
     * const keyword = await prisma.keyword.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KeywordCreateManyArgs>(args?: SelectSubset<T, KeywordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Keywords and returns the data saved in the database.
     * @param {KeywordCreateManyAndReturnArgs} args - Arguments to create many Keywords.
     * @example
     * // Create many Keywords
     * const keyword = await prisma.keyword.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Keywords and only return the `id`
     * const keywordWithIdOnly = await prisma.keyword.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KeywordCreateManyAndReturnArgs>(args?: SelectSubset<T, KeywordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Keyword.
     * @param {KeywordDeleteArgs} args - Arguments to delete one Keyword.
     * @example
     * // Delete one Keyword
     * const Keyword = await prisma.keyword.delete({
     *   where: {
     *     // ... filter to delete one Keyword
     *   }
     * })
     * 
     */
    delete<T extends KeywordDeleteArgs>(args: SelectSubset<T, KeywordDeleteArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Keyword.
     * @param {KeywordUpdateArgs} args - Arguments to update one Keyword.
     * @example
     * // Update one Keyword
     * const keyword = await prisma.keyword.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KeywordUpdateArgs>(args: SelectSubset<T, KeywordUpdateArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Keywords.
     * @param {KeywordDeleteManyArgs} args - Arguments to filter Keywords to delete.
     * @example
     * // Delete a few Keywords
     * const { count } = await prisma.keyword.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KeywordDeleteManyArgs>(args?: SelectSubset<T, KeywordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Keywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Keywords
     * const keyword = await prisma.keyword.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KeywordUpdateManyArgs>(args: SelectSubset<T, KeywordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Keywords and returns the data updated in the database.
     * @param {KeywordUpdateManyAndReturnArgs} args - Arguments to update many Keywords.
     * @example
     * // Update many Keywords
     * const keyword = await prisma.keyword.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Keywords and only return the `id`
     * const keywordWithIdOnly = await prisma.keyword.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KeywordUpdateManyAndReturnArgs>(args: SelectSubset<T, KeywordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Keyword.
     * @param {KeywordUpsertArgs} args - Arguments to update or create a Keyword.
     * @example
     * // Update or create a Keyword
     * const keyword = await prisma.keyword.upsert({
     *   create: {
     *     // ... data to create a Keyword
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Keyword we want to update
     *   }
     * })
     */
    upsert<T extends KeywordUpsertArgs>(args: SelectSubset<T, KeywordUpsertArgs<ExtArgs>>): Prisma__KeywordClient<$Result.GetResult<Prisma.$KeywordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Keywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordCountArgs} args - Arguments to filter Keywords to count.
     * @example
     * // Count the number of Keywords
     * const count = await prisma.keyword.count({
     *   where: {
     *     // ... the filter for the Keywords we want to count
     *   }
     * })
    **/
    count<T extends KeywordCountArgs>(
      args?: Subset<T, KeywordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KeywordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Keyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KeywordAggregateArgs>(args: Subset<T, KeywordAggregateArgs>): Prisma.PrismaPromise<GetKeywordAggregateType<T>>

    /**
     * Group by Keyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KeywordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KeywordGroupByArgs['orderBy'] }
        : { orderBy?: KeywordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KeywordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKeywordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Keyword model
   */
  readonly fields: KeywordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Keyword.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KeywordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    analysisResult<T extends AnalysisResultDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisResultDefaultArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Keyword model
   */
  interface KeywordFieldRefs {
    readonly id: FieldRef<"Keyword", 'String'>
    readonly analysisResultId: FieldRef<"Keyword", 'String'>
    readonly keyword: FieldRef<"Keyword", 'String'>
    readonly sentiment: FieldRef<"Keyword", 'String'>
    readonly frequency: FieldRef<"Keyword", 'Int'>
    readonly confidence: FieldRef<"Keyword", 'Float'>
    readonly createdAt: FieldRef<"Keyword", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Keyword findUnique
   */
  export type KeywordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter, which Keyword to fetch.
     */
    where: KeywordWhereUniqueInput
  }

  /**
   * Keyword findUniqueOrThrow
   */
  export type KeywordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter, which Keyword to fetch.
     */
    where: KeywordWhereUniqueInput
  }

  /**
   * Keyword findFirst
   */
  export type KeywordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter, which Keyword to fetch.
     */
    where?: KeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Keywords to fetch.
     */
    orderBy?: KeywordOrderByWithRelationInput | KeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Keywords.
     */
    cursor?: KeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Keywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Keywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Keywords.
     */
    distinct?: KeywordScalarFieldEnum | KeywordScalarFieldEnum[]
  }

  /**
   * Keyword findFirstOrThrow
   */
  export type KeywordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter, which Keyword to fetch.
     */
    where?: KeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Keywords to fetch.
     */
    orderBy?: KeywordOrderByWithRelationInput | KeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Keywords.
     */
    cursor?: KeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Keywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Keywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Keywords.
     */
    distinct?: KeywordScalarFieldEnum | KeywordScalarFieldEnum[]
  }

  /**
   * Keyword findMany
   */
  export type KeywordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter, which Keywords to fetch.
     */
    where?: KeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Keywords to fetch.
     */
    orderBy?: KeywordOrderByWithRelationInput | KeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Keywords.
     */
    cursor?: KeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Keywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Keywords.
     */
    skip?: number
    distinct?: KeywordScalarFieldEnum | KeywordScalarFieldEnum[]
  }

  /**
   * Keyword create
   */
  export type KeywordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * The data needed to create a Keyword.
     */
    data: XOR<KeywordCreateInput, KeywordUncheckedCreateInput>
  }

  /**
   * Keyword createMany
   */
  export type KeywordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Keywords.
     */
    data: KeywordCreateManyInput | KeywordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Keyword createManyAndReturn
   */
  export type KeywordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * The data used to create many Keywords.
     */
    data: KeywordCreateManyInput | KeywordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Keyword update
   */
  export type KeywordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * The data needed to update a Keyword.
     */
    data: XOR<KeywordUpdateInput, KeywordUncheckedUpdateInput>
    /**
     * Choose, which Keyword to update.
     */
    where: KeywordWhereUniqueInput
  }

  /**
   * Keyword updateMany
   */
  export type KeywordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Keywords.
     */
    data: XOR<KeywordUpdateManyMutationInput, KeywordUncheckedUpdateManyInput>
    /**
     * Filter which Keywords to update
     */
    where?: KeywordWhereInput
    /**
     * Limit how many Keywords to update.
     */
    limit?: number
  }

  /**
   * Keyword updateManyAndReturn
   */
  export type KeywordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * The data used to update Keywords.
     */
    data: XOR<KeywordUpdateManyMutationInput, KeywordUncheckedUpdateManyInput>
    /**
     * Filter which Keywords to update
     */
    where?: KeywordWhereInput
    /**
     * Limit how many Keywords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Keyword upsert
   */
  export type KeywordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * The filter to search for the Keyword to update in case it exists.
     */
    where: KeywordWhereUniqueInput
    /**
     * In case the Keyword found by the `where` argument doesn't exist, create a new Keyword with this data.
     */
    create: XOR<KeywordCreateInput, KeywordUncheckedCreateInput>
    /**
     * In case the Keyword was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KeywordUpdateInput, KeywordUncheckedUpdateInput>
  }

  /**
   * Keyword delete
   */
  export type KeywordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
    /**
     * Filter which Keyword to delete.
     */
    where: KeywordWhereUniqueInput
  }

  /**
   * Keyword deleteMany
   */
  export type KeywordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Keywords to delete
     */
    where?: KeywordWhereInput
    /**
     * Limit how many Keywords to delete.
     */
    limit?: number
  }

  /**
   * Keyword without action
   */
  export type KeywordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Keyword
     */
    select?: KeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Keyword
     */
    omit?: KeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeywordInclude<ExtArgs> | null
  }


  /**
   * Model SearchHistory
   */

  export type AggregateSearchHistory = {
    _count: SearchHistoryCountAggregateOutputType | null
    _avg: SearchHistoryAvgAggregateOutputType | null
    _sum: SearchHistorySumAggregateOutputType | null
    _min: SearchHistoryMinAggregateOutputType | null
    _max: SearchHistoryMaxAggregateOutputType | null
  }

  export type SearchHistoryAvgAggregateOutputType = {
    resultCount: number | null
  }

  export type SearchHistorySumAggregateOutputType = {
    resultCount: number | null
  }

  export type SearchHistoryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    resultCount: number | null
    createdAt: Date | null
  }

  export type SearchHistoryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    resultCount: number | null
    createdAt: Date | null
  }

  export type SearchHistoryCountAggregateOutputType = {
    id: number
    userId: number
    query: number
    resultCount: number
    createdAt: number
    _all: number
  }


  export type SearchHistoryAvgAggregateInputType = {
    resultCount?: true
  }

  export type SearchHistorySumAggregateInputType = {
    resultCount?: true
  }

  export type SearchHistoryMinAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    resultCount?: true
    createdAt?: true
  }

  export type SearchHistoryMaxAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    resultCount?: true
    createdAt?: true
  }

  export type SearchHistoryCountAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    resultCount?: true
    createdAt?: true
    _all?: true
  }

  export type SearchHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchHistory to aggregate.
     */
    where?: SearchHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchHistories to fetch.
     */
    orderBy?: SearchHistoryOrderByWithRelationInput | SearchHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SearchHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SearchHistories
    **/
    _count?: true | SearchHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SearchHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SearchHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SearchHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SearchHistoryMaxAggregateInputType
  }

  export type GetSearchHistoryAggregateType<T extends SearchHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateSearchHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSearchHistory[P]>
      : GetScalarType<T[P], AggregateSearchHistory[P]>
  }




  export type SearchHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SearchHistoryWhereInput
    orderBy?: SearchHistoryOrderByWithAggregationInput | SearchHistoryOrderByWithAggregationInput[]
    by: SearchHistoryScalarFieldEnum[] | SearchHistoryScalarFieldEnum
    having?: SearchHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SearchHistoryCountAggregateInputType | true
    _avg?: SearchHistoryAvgAggregateInputType
    _sum?: SearchHistorySumAggregateInputType
    _min?: SearchHistoryMinAggregateInputType
    _max?: SearchHistoryMaxAggregateInputType
  }

  export type SearchHistoryGroupByOutputType = {
    id: string
    userId: string
    query: string
    resultCount: number
    createdAt: Date
    _count: SearchHistoryCountAggregateOutputType | null
    _avg: SearchHistoryAvgAggregateOutputType | null
    _sum: SearchHistorySumAggregateOutputType | null
    _min: SearchHistoryMinAggregateOutputType | null
    _max: SearchHistoryMaxAggregateOutputType | null
  }

  type GetSearchHistoryGroupByPayload<T extends SearchHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SearchHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SearchHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SearchHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], SearchHistoryGroupByOutputType[P]>
        }
      >
    >


  export type SearchHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    resultCount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["searchHistory"]>

  export type SearchHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    resultCount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["searchHistory"]>

  export type SearchHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    resultCount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["searchHistory"]>

  export type SearchHistorySelectScalar = {
    id?: boolean
    userId?: boolean
    query?: boolean
    resultCount?: boolean
    createdAt?: boolean
  }

  export type SearchHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "query" | "resultCount" | "createdAt", ExtArgs["result"]["searchHistory"]>
  export type SearchHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SearchHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SearchHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SearchHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SearchHistory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      query: string
      resultCount: number
      createdAt: Date
    }, ExtArgs["result"]["searchHistory"]>
    composites: {}
  }

  type SearchHistoryGetPayload<S extends boolean | null | undefined | SearchHistoryDefaultArgs> = $Result.GetResult<Prisma.$SearchHistoryPayload, S>

  type SearchHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SearchHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SearchHistoryCountAggregateInputType | true
    }

  export interface SearchHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SearchHistory'], meta: { name: 'SearchHistory' } }
    /**
     * Find zero or one SearchHistory that matches the filter.
     * @param {SearchHistoryFindUniqueArgs} args - Arguments to find a SearchHistory
     * @example
     * // Get one SearchHistory
     * const searchHistory = await prisma.searchHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SearchHistoryFindUniqueArgs>(args: SelectSubset<T, SearchHistoryFindUniqueArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SearchHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SearchHistoryFindUniqueOrThrowArgs} args - Arguments to find a SearchHistory
     * @example
     * // Get one SearchHistory
     * const searchHistory = await prisma.searchHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SearchHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, SearchHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryFindFirstArgs} args - Arguments to find a SearchHistory
     * @example
     * // Get one SearchHistory
     * const searchHistory = await prisma.searchHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SearchHistoryFindFirstArgs>(args?: SelectSubset<T, SearchHistoryFindFirstArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryFindFirstOrThrowArgs} args - Arguments to find a SearchHistory
     * @example
     * // Get one SearchHistory
     * const searchHistory = await prisma.searchHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SearchHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, SearchHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SearchHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SearchHistories
     * const searchHistories = await prisma.searchHistory.findMany()
     * 
     * // Get first 10 SearchHistories
     * const searchHistories = await prisma.searchHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const searchHistoryWithIdOnly = await prisma.searchHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SearchHistoryFindManyArgs>(args?: SelectSubset<T, SearchHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SearchHistory.
     * @param {SearchHistoryCreateArgs} args - Arguments to create a SearchHistory.
     * @example
     * // Create one SearchHistory
     * const SearchHistory = await prisma.searchHistory.create({
     *   data: {
     *     // ... data to create a SearchHistory
     *   }
     * })
     * 
     */
    create<T extends SearchHistoryCreateArgs>(args: SelectSubset<T, SearchHistoryCreateArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SearchHistories.
     * @param {SearchHistoryCreateManyArgs} args - Arguments to create many SearchHistories.
     * @example
     * // Create many SearchHistories
     * const searchHistory = await prisma.searchHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SearchHistoryCreateManyArgs>(args?: SelectSubset<T, SearchHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SearchHistories and returns the data saved in the database.
     * @param {SearchHistoryCreateManyAndReturnArgs} args - Arguments to create many SearchHistories.
     * @example
     * // Create many SearchHistories
     * const searchHistory = await prisma.searchHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SearchHistories and only return the `id`
     * const searchHistoryWithIdOnly = await prisma.searchHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SearchHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, SearchHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SearchHistory.
     * @param {SearchHistoryDeleteArgs} args - Arguments to delete one SearchHistory.
     * @example
     * // Delete one SearchHistory
     * const SearchHistory = await prisma.searchHistory.delete({
     *   where: {
     *     // ... filter to delete one SearchHistory
     *   }
     * })
     * 
     */
    delete<T extends SearchHistoryDeleteArgs>(args: SelectSubset<T, SearchHistoryDeleteArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SearchHistory.
     * @param {SearchHistoryUpdateArgs} args - Arguments to update one SearchHistory.
     * @example
     * // Update one SearchHistory
     * const searchHistory = await prisma.searchHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SearchHistoryUpdateArgs>(args: SelectSubset<T, SearchHistoryUpdateArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SearchHistories.
     * @param {SearchHistoryDeleteManyArgs} args - Arguments to filter SearchHistories to delete.
     * @example
     * // Delete a few SearchHistories
     * const { count } = await prisma.searchHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SearchHistoryDeleteManyArgs>(args?: SelectSubset<T, SearchHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SearchHistories
     * const searchHistory = await prisma.searchHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SearchHistoryUpdateManyArgs>(args: SelectSubset<T, SearchHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchHistories and returns the data updated in the database.
     * @param {SearchHistoryUpdateManyAndReturnArgs} args - Arguments to update many SearchHistories.
     * @example
     * // Update many SearchHistories
     * const searchHistory = await prisma.searchHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SearchHistories and only return the `id`
     * const searchHistoryWithIdOnly = await prisma.searchHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SearchHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, SearchHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SearchHistory.
     * @param {SearchHistoryUpsertArgs} args - Arguments to update or create a SearchHistory.
     * @example
     * // Update or create a SearchHistory
     * const searchHistory = await prisma.searchHistory.upsert({
     *   create: {
     *     // ... data to create a SearchHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SearchHistory we want to update
     *   }
     * })
     */
    upsert<T extends SearchHistoryUpsertArgs>(args: SelectSubset<T, SearchHistoryUpsertArgs<ExtArgs>>): Prisma__SearchHistoryClient<$Result.GetResult<Prisma.$SearchHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SearchHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryCountArgs} args - Arguments to filter SearchHistories to count.
     * @example
     * // Count the number of SearchHistories
     * const count = await prisma.searchHistory.count({
     *   where: {
     *     // ... the filter for the SearchHistories we want to count
     *   }
     * })
    **/
    count<T extends SearchHistoryCountArgs>(
      args?: Subset<T, SearchHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SearchHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SearchHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SearchHistoryAggregateArgs>(args: Subset<T, SearchHistoryAggregateArgs>): Prisma.PrismaPromise<GetSearchHistoryAggregateType<T>>

    /**
     * Group by SearchHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SearchHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SearchHistoryGroupByArgs['orderBy'] }
        : { orderBy?: SearchHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SearchHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSearchHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SearchHistory model
   */
  readonly fields: SearchHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SearchHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SearchHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SearchHistory model
   */
  interface SearchHistoryFieldRefs {
    readonly id: FieldRef<"SearchHistory", 'String'>
    readonly userId: FieldRef<"SearchHistory", 'String'>
    readonly query: FieldRef<"SearchHistory", 'String'>
    readonly resultCount: FieldRef<"SearchHistory", 'Int'>
    readonly createdAt: FieldRef<"SearchHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SearchHistory findUnique
   */
  export type SearchHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter, which SearchHistory to fetch.
     */
    where: SearchHistoryWhereUniqueInput
  }

  /**
   * SearchHistory findUniqueOrThrow
   */
  export type SearchHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter, which SearchHistory to fetch.
     */
    where: SearchHistoryWhereUniqueInput
  }

  /**
   * SearchHistory findFirst
   */
  export type SearchHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter, which SearchHistory to fetch.
     */
    where?: SearchHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchHistories to fetch.
     */
    orderBy?: SearchHistoryOrderByWithRelationInput | SearchHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchHistories.
     */
    cursor?: SearchHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchHistories.
     */
    distinct?: SearchHistoryScalarFieldEnum | SearchHistoryScalarFieldEnum[]
  }

  /**
   * SearchHistory findFirstOrThrow
   */
  export type SearchHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter, which SearchHistory to fetch.
     */
    where?: SearchHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchHistories to fetch.
     */
    orderBy?: SearchHistoryOrderByWithRelationInput | SearchHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchHistories.
     */
    cursor?: SearchHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchHistories.
     */
    distinct?: SearchHistoryScalarFieldEnum | SearchHistoryScalarFieldEnum[]
  }

  /**
   * SearchHistory findMany
   */
  export type SearchHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter, which SearchHistories to fetch.
     */
    where?: SearchHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchHistories to fetch.
     */
    orderBy?: SearchHistoryOrderByWithRelationInput | SearchHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SearchHistories.
     */
    cursor?: SearchHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchHistories.
     */
    skip?: number
    distinct?: SearchHistoryScalarFieldEnum | SearchHistoryScalarFieldEnum[]
  }

  /**
   * SearchHistory create
   */
  export type SearchHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a SearchHistory.
     */
    data: XOR<SearchHistoryCreateInput, SearchHistoryUncheckedCreateInput>
  }

  /**
   * SearchHistory createMany
   */
  export type SearchHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SearchHistories.
     */
    data: SearchHistoryCreateManyInput | SearchHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SearchHistory createManyAndReturn
   */
  export type SearchHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many SearchHistories.
     */
    data: SearchHistoryCreateManyInput | SearchHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SearchHistory update
   */
  export type SearchHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a SearchHistory.
     */
    data: XOR<SearchHistoryUpdateInput, SearchHistoryUncheckedUpdateInput>
    /**
     * Choose, which SearchHistory to update.
     */
    where: SearchHistoryWhereUniqueInput
  }

  /**
   * SearchHistory updateMany
   */
  export type SearchHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SearchHistories.
     */
    data: XOR<SearchHistoryUpdateManyMutationInput, SearchHistoryUncheckedUpdateManyInput>
    /**
     * Filter which SearchHistories to update
     */
    where?: SearchHistoryWhereInput
    /**
     * Limit how many SearchHistories to update.
     */
    limit?: number
  }

  /**
   * SearchHistory updateManyAndReturn
   */
  export type SearchHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * The data used to update SearchHistories.
     */
    data: XOR<SearchHistoryUpdateManyMutationInput, SearchHistoryUncheckedUpdateManyInput>
    /**
     * Filter which SearchHistories to update
     */
    where?: SearchHistoryWhereInput
    /**
     * Limit how many SearchHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SearchHistory upsert
   */
  export type SearchHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the SearchHistory to update in case it exists.
     */
    where: SearchHistoryWhereUniqueInput
    /**
     * In case the SearchHistory found by the `where` argument doesn't exist, create a new SearchHistory with this data.
     */
    create: XOR<SearchHistoryCreateInput, SearchHistoryUncheckedCreateInput>
    /**
     * In case the SearchHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SearchHistoryUpdateInput, SearchHistoryUncheckedUpdateInput>
  }

  /**
   * SearchHistory delete
   */
  export type SearchHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
    /**
     * Filter which SearchHistory to delete.
     */
    where: SearchHistoryWhereUniqueInput
  }

  /**
   * SearchHistory deleteMany
   */
  export type SearchHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchHistories to delete
     */
    where?: SearchHistoryWhereInput
    /**
     * Limit how many SearchHistories to delete.
     */
    limit?: number
  }

  /**
   * SearchHistory without action
   */
  export type SearchHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchHistory
     */
    select?: SearchHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchHistory
     */
    omit?: SearchHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchHistoryInclude<ExtArgs> | null
  }


  /**
   * Model WatchList
   */

  export type AggregateWatchList = {
    _count: WatchListCountAggregateOutputType | null
    _avg: WatchListAvgAggregateOutputType | null
    _sum: WatchListSumAggregateOutputType | null
    _min: WatchListMinAggregateOutputType | null
    _max: WatchListMaxAggregateOutputType | null
  }

  export type WatchListAvgAggregateOutputType = {
    targetPrice: Decimal | null
  }

  export type WatchListSumAggregateOutputType = {
    targetPrice: Decimal | null
  }

  export type WatchListMinAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    priceAlert: boolean | null
    targetPrice: Decimal | null
    lastNotifiedAt: Date | null
    analysisFrequency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatchListMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    priceAlert: boolean | null
    targetPrice: Decimal | null
    lastNotifiedAt: Date | null
    analysisFrequency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatchListCountAggregateOutputType = {
    id: number
    userId: number
    productId: number
    priceAlert: number
    targetPrice: number
    lastNotifiedAt: number
    analysisFrequency: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WatchListAvgAggregateInputType = {
    targetPrice?: true
  }

  export type WatchListSumAggregateInputType = {
    targetPrice?: true
  }

  export type WatchListMinAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    priceAlert?: true
    targetPrice?: true
    lastNotifiedAt?: true
    analysisFrequency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatchListMaxAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    priceAlert?: true
    targetPrice?: true
    lastNotifiedAt?: true
    analysisFrequency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatchListCountAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    priceAlert?: true
    targetPrice?: true
    lastNotifiedAt?: true
    analysisFrequency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WatchListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchList to aggregate.
     */
    where?: WatchListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchLists to fetch.
     */
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WatchListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WatchLists
    **/
    _count?: true | WatchListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WatchListAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WatchListSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WatchListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WatchListMaxAggregateInputType
  }

  export type GetWatchListAggregateType<T extends WatchListAggregateArgs> = {
        [P in keyof T & keyof AggregateWatchList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWatchList[P]>
      : GetScalarType<T[P], AggregateWatchList[P]>
  }




  export type WatchListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchListWhereInput
    orderBy?: WatchListOrderByWithAggregationInput | WatchListOrderByWithAggregationInput[]
    by: WatchListScalarFieldEnum[] | WatchListScalarFieldEnum
    having?: WatchListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WatchListCountAggregateInputType | true
    _avg?: WatchListAvgAggregateInputType
    _sum?: WatchListSumAggregateInputType
    _min?: WatchListMinAggregateInputType
    _max?: WatchListMaxAggregateInputType
  }

  export type WatchListGroupByOutputType = {
    id: string
    userId: string
    productId: string
    priceAlert: boolean
    targetPrice: Decimal | null
    lastNotifiedAt: Date | null
    analysisFrequency: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: WatchListCountAggregateOutputType | null
    _avg: WatchListAvgAggregateOutputType | null
    _sum: WatchListSumAggregateOutputType | null
    _min: WatchListMinAggregateOutputType | null
    _max: WatchListMaxAggregateOutputType | null
  }

  type GetWatchListGroupByPayload<T extends WatchListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WatchListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WatchListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WatchListGroupByOutputType[P]>
            : GetScalarType<T[P], WatchListGroupByOutputType[P]>
        }
      >
    >


  export type WatchListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    priceAlert?: boolean
    targetPrice?: boolean
    lastNotifiedAt?: boolean
    analysisFrequency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchList"]>

  export type WatchListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    priceAlert?: boolean
    targetPrice?: boolean
    lastNotifiedAt?: boolean
    analysisFrequency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchList"]>

  export type WatchListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    priceAlert?: boolean
    targetPrice?: boolean
    lastNotifiedAt?: boolean
    analysisFrequency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchList"]>

  export type WatchListSelectScalar = {
    id?: boolean
    userId?: boolean
    productId?: boolean
    priceAlert?: boolean
    targetPrice?: boolean
    lastNotifiedAt?: boolean
    analysisFrequency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WatchListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "productId" | "priceAlert" | "targetPrice" | "lastNotifiedAt" | "analysisFrequency" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["watchList"]>
  export type WatchListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type WatchListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type WatchListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $WatchListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WatchList"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      productId: string
      priceAlert: boolean
      targetPrice: Prisma.Decimal | null
      lastNotifiedAt: Date | null
      analysisFrequency: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["watchList"]>
    composites: {}
  }

  type WatchListGetPayload<S extends boolean | null | undefined | WatchListDefaultArgs> = $Result.GetResult<Prisma.$WatchListPayload, S>

  type WatchListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WatchListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WatchListCountAggregateInputType | true
    }

  export interface WatchListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WatchList'], meta: { name: 'WatchList' } }
    /**
     * Find zero or one WatchList that matches the filter.
     * @param {WatchListFindUniqueArgs} args - Arguments to find a WatchList
     * @example
     * // Get one WatchList
     * const watchList = await prisma.watchList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WatchListFindUniqueArgs>(args: SelectSubset<T, WatchListFindUniqueArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WatchList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WatchListFindUniqueOrThrowArgs} args - Arguments to find a WatchList
     * @example
     * // Get one WatchList
     * const watchList = await prisma.watchList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WatchListFindUniqueOrThrowArgs>(args: SelectSubset<T, WatchListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListFindFirstArgs} args - Arguments to find a WatchList
     * @example
     * // Get one WatchList
     * const watchList = await prisma.watchList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WatchListFindFirstArgs>(args?: SelectSubset<T, WatchListFindFirstArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListFindFirstOrThrowArgs} args - Arguments to find a WatchList
     * @example
     * // Get one WatchList
     * const watchList = await prisma.watchList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WatchListFindFirstOrThrowArgs>(args?: SelectSubset<T, WatchListFindFirstOrThrowArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WatchLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WatchLists
     * const watchLists = await prisma.watchList.findMany()
     * 
     * // Get first 10 WatchLists
     * const watchLists = await prisma.watchList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const watchListWithIdOnly = await prisma.watchList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WatchListFindManyArgs>(args?: SelectSubset<T, WatchListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WatchList.
     * @param {WatchListCreateArgs} args - Arguments to create a WatchList.
     * @example
     * // Create one WatchList
     * const WatchList = await prisma.watchList.create({
     *   data: {
     *     // ... data to create a WatchList
     *   }
     * })
     * 
     */
    create<T extends WatchListCreateArgs>(args: SelectSubset<T, WatchListCreateArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WatchLists.
     * @param {WatchListCreateManyArgs} args - Arguments to create many WatchLists.
     * @example
     * // Create many WatchLists
     * const watchList = await prisma.watchList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WatchListCreateManyArgs>(args?: SelectSubset<T, WatchListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WatchLists and returns the data saved in the database.
     * @param {WatchListCreateManyAndReturnArgs} args - Arguments to create many WatchLists.
     * @example
     * // Create many WatchLists
     * const watchList = await prisma.watchList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WatchLists and only return the `id`
     * const watchListWithIdOnly = await prisma.watchList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WatchListCreateManyAndReturnArgs>(args?: SelectSubset<T, WatchListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WatchList.
     * @param {WatchListDeleteArgs} args - Arguments to delete one WatchList.
     * @example
     * // Delete one WatchList
     * const WatchList = await prisma.watchList.delete({
     *   where: {
     *     // ... filter to delete one WatchList
     *   }
     * })
     * 
     */
    delete<T extends WatchListDeleteArgs>(args: SelectSubset<T, WatchListDeleteArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WatchList.
     * @param {WatchListUpdateArgs} args - Arguments to update one WatchList.
     * @example
     * // Update one WatchList
     * const watchList = await prisma.watchList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WatchListUpdateArgs>(args: SelectSubset<T, WatchListUpdateArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WatchLists.
     * @param {WatchListDeleteManyArgs} args - Arguments to filter WatchLists to delete.
     * @example
     * // Delete a few WatchLists
     * const { count } = await prisma.watchList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WatchListDeleteManyArgs>(args?: SelectSubset<T, WatchListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WatchLists
     * const watchList = await prisma.watchList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WatchListUpdateManyArgs>(args: SelectSubset<T, WatchListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchLists and returns the data updated in the database.
     * @param {WatchListUpdateManyAndReturnArgs} args - Arguments to update many WatchLists.
     * @example
     * // Update many WatchLists
     * const watchList = await prisma.watchList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WatchLists and only return the `id`
     * const watchListWithIdOnly = await prisma.watchList.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WatchListUpdateManyAndReturnArgs>(args: SelectSubset<T, WatchListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WatchList.
     * @param {WatchListUpsertArgs} args - Arguments to update or create a WatchList.
     * @example
     * // Update or create a WatchList
     * const watchList = await prisma.watchList.upsert({
     *   create: {
     *     // ... data to create a WatchList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WatchList we want to update
     *   }
     * })
     */
    upsert<T extends WatchListUpsertArgs>(args: SelectSubset<T, WatchListUpsertArgs<ExtArgs>>): Prisma__WatchListClient<$Result.GetResult<Prisma.$WatchListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WatchLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListCountArgs} args - Arguments to filter WatchLists to count.
     * @example
     * // Count the number of WatchLists
     * const count = await prisma.watchList.count({
     *   where: {
     *     // ... the filter for the WatchLists we want to count
     *   }
     * })
    **/
    count<T extends WatchListCountArgs>(
      args?: Subset<T, WatchListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WatchListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WatchList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WatchListAggregateArgs>(args: Subset<T, WatchListAggregateArgs>): Prisma.PrismaPromise<GetWatchListAggregateType<T>>

    /**
     * Group by WatchList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WatchListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WatchListGroupByArgs['orderBy'] }
        : { orderBy?: WatchListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WatchListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWatchListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WatchList model
   */
  readonly fields: WatchListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WatchList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WatchListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WatchList model
   */
  interface WatchListFieldRefs {
    readonly id: FieldRef<"WatchList", 'String'>
    readonly userId: FieldRef<"WatchList", 'String'>
    readonly productId: FieldRef<"WatchList", 'String'>
    readonly priceAlert: FieldRef<"WatchList", 'Boolean'>
    readonly targetPrice: FieldRef<"WatchList", 'Decimal'>
    readonly lastNotifiedAt: FieldRef<"WatchList", 'DateTime'>
    readonly analysisFrequency: FieldRef<"WatchList", 'String'>
    readonly isActive: FieldRef<"WatchList", 'Boolean'>
    readonly createdAt: FieldRef<"WatchList", 'DateTime'>
    readonly updatedAt: FieldRef<"WatchList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WatchList findUnique
   */
  export type WatchListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter, which WatchList to fetch.
     */
    where: WatchListWhereUniqueInput
  }

  /**
   * WatchList findUniqueOrThrow
   */
  export type WatchListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter, which WatchList to fetch.
     */
    where: WatchListWhereUniqueInput
  }

  /**
   * WatchList findFirst
   */
  export type WatchListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter, which WatchList to fetch.
     */
    where?: WatchListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchLists to fetch.
     */
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchLists.
     */
    cursor?: WatchListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchLists.
     */
    distinct?: WatchListScalarFieldEnum | WatchListScalarFieldEnum[]
  }

  /**
   * WatchList findFirstOrThrow
   */
  export type WatchListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter, which WatchList to fetch.
     */
    where?: WatchListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchLists to fetch.
     */
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchLists.
     */
    cursor?: WatchListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchLists.
     */
    distinct?: WatchListScalarFieldEnum | WatchListScalarFieldEnum[]
  }

  /**
   * WatchList findMany
   */
  export type WatchListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter, which WatchLists to fetch.
     */
    where?: WatchListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchLists to fetch.
     */
    orderBy?: WatchListOrderByWithRelationInput | WatchListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WatchLists.
     */
    cursor?: WatchListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchLists.
     */
    skip?: number
    distinct?: WatchListScalarFieldEnum | WatchListScalarFieldEnum[]
  }

  /**
   * WatchList create
   */
  export type WatchListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * The data needed to create a WatchList.
     */
    data: XOR<WatchListCreateInput, WatchListUncheckedCreateInput>
  }

  /**
   * WatchList createMany
   */
  export type WatchListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WatchLists.
     */
    data: WatchListCreateManyInput | WatchListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WatchList createManyAndReturn
   */
  export type WatchListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * The data used to create many WatchLists.
     */
    data: WatchListCreateManyInput | WatchListCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WatchList update
   */
  export type WatchListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * The data needed to update a WatchList.
     */
    data: XOR<WatchListUpdateInput, WatchListUncheckedUpdateInput>
    /**
     * Choose, which WatchList to update.
     */
    where: WatchListWhereUniqueInput
  }

  /**
   * WatchList updateMany
   */
  export type WatchListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WatchLists.
     */
    data: XOR<WatchListUpdateManyMutationInput, WatchListUncheckedUpdateManyInput>
    /**
     * Filter which WatchLists to update
     */
    where?: WatchListWhereInput
    /**
     * Limit how many WatchLists to update.
     */
    limit?: number
  }

  /**
   * WatchList updateManyAndReturn
   */
  export type WatchListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * The data used to update WatchLists.
     */
    data: XOR<WatchListUpdateManyMutationInput, WatchListUncheckedUpdateManyInput>
    /**
     * Filter which WatchLists to update
     */
    where?: WatchListWhereInput
    /**
     * Limit how many WatchLists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WatchList upsert
   */
  export type WatchListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * The filter to search for the WatchList to update in case it exists.
     */
    where: WatchListWhereUniqueInput
    /**
     * In case the WatchList found by the `where` argument doesn't exist, create a new WatchList with this data.
     */
    create: XOR<WatchListCreateInput, WatchListUncheckedCreateInput>
    /**
     * In case the WatchList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WatchListUpdateInput, WatchListUncheckedUpdateInput>
  }

  /**
   * WatchList delete
   */
  export type WatchListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
    /**
     * Filter which WatchList to delete.
     */
    where: WatchListWhereUniqueInput
  }

  /**
   * WatchList deleteMany
   */
  export type WatchListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchLists to delete
     */
    where?: WatchListWhereInput
    /**
     * Limit how many WatchLists to delete.
     */
    limit?: number
  }

  /**
   * WatchList without action
   */
  export type WatchListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchList
     */
    select?: WatchListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchList
     */
    omit?: WatchListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchListInclude<ExtArgs> | null
  }


  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigMinAggregateOutputType = {
    id: string | null
    key: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    id: string | null
    key: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    id: number
    key: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SystemConfigMinAggregateInputType = {
    id?: true
    key?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    id?: true
    key?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemConfigs
    **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }




  export type SystemConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    id: string
    key: string
    value: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
        }
      >
    >


  export type SystemConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SystemConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "createdAt" | "updatedAt", ExtArgs["result"]["systemConfig"]>

  export type $SystemConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["systemConfig"]>
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> = $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig'], meta: { name: 'SystemConfig' } }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     * 
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemConfigFindManyArgs>(args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     * 
     */
    create<T extends SystemConfigCreateArgs>(args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemConfigCreateManyArgs>(args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     * 
     */
    delete<T extends SystemConfigDeleteArgs>(args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemConfigUpdateArgs>(args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs and returns the data updated in the database.
     * @param {SystemConfigUpdateManyAndReturnArgs} args - Arguments to update many SystemConfigs.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
    **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemConfigAggregateArgs>(args: Subset<T, SystemConfigAggregateArgs>): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemConfig model
   */
  readonly fields: SystemConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemConfig model
   */
  interface SystemConfigFieldRefs {
    readonly id: FieldRef<"SystemConfig", 'String'>
    readonly key: FieldRef<"SystemConfig", 'String'>
    readonly value: FieldRef<"SystemConfig", 'Json'>
    readonly createdAt: FieldRef<"SystemConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"SystemConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig updateManyAndReturn
   */
  export type SystemConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to delete.
     */
    limit?: number
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    isActive: 'isActive',
    emailVerified: 'emailVerified',
    lastLoginAt: 'lastLoginAt',
    failedLoginAttempts: 'failedLoginAttempts',
    lockedUntil: 'lockedUntil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    avatarUrl: 'avatarUrl',
    timezone: 'timezone',
    language: 'language',
    notificationPreferences: 'notificationPreferences',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshTokenHash: 'refreshTokenHash',
    deviceInfo: 'deviceInfo',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    parentId: 'parentId',
    path: 'path',
    level: 'level',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url',
    categoryId: 'categoryId',
    currentPrice: 'currentPrice',
    averageRating: 'averageRating',
    totalReviews: 'totalReviews',
    imageUrl: 'imageUrl',
    isActive: 'isActive',
    lastCrawledAt: 'lastCrawledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const PriceHistoryScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    price: 'price',
    createdAt: 'createdAt'
  };

  export type PriceHistoryScalarFieldEnum = (typeof PriceHistoryScalarFieldEnum)[keyof typeof PriceHistoryScalarFieldEnum]


  export const AnalysisRequestScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    taskId: 'taskId',
    status: 'status',
    progress: 'progress',
    requestType: 'requestType',
    priority: 'priority',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type AnalysisRequestScalarFieldEnum = (typeof AnalysisRequestScalarFieldEnum)[keyof typeof AnalysisRequestScalarFieldEnum]


  export const AnalysisResultScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    taskId: 'taskId',
    status: 'status',
    sentimentPositive: 'sentimentPositive',
    sentimentNegative: 'sentimentNegative',
    sentimentNeutral: 'sentimentNeutral',
    summary: 'summary',
    keywords: 'keywords',
    totalReviews: 'totalReviews',
    averageRating: 'averageRating',
    ratingDistribution: 'ratingDistribution',
    errorMessage: 'errorMessage',
    processingTime: 'processingTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnalysisResultScalarFieldEnum = (typeof AnalysisResultScalarFieldEnum)[keyof typeof AnalysisResultScalarFieldEnum]


  export const KeywordScalarFieldEnum: {
    id: 'id',
    analysisResultId: 'analysisResultId',
    keyword: 'keyword',
    sentiment: 'sentiment',
    frequency: 'frequency',
    confidence: 'confidence',
    createdAt: 'createdAt'
  };

  export type KeywordScalarFieldEnum = (typeof KeywordScalarFieldEnum)[keyof typeof KeywordScalarFieldEnum]


  export const SearchHistoryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    query: 'query',
    resultCount: 'resultCount',
    createdAt: 'createdAt'
  };

  export type SearchHistoryScalarFieldEnum = (typeof SearchHistoryScalarFieldEnum)[keyof typeof SearchHistoryScalarFieldEnum]


  export const WatchListScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    priceAlert: 'priceAlert',
    targetPrice: 'targetPrice',
    lastNotifiedAt: 'lastNotifiedAt',
    analysisFrequency: 'analysisFrequency',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WatchListScalarFieldEnum = (typeof WatchListScalarFieldEnum)[keyof typeof WatchListScalarFieldEnum]


  export const SystemConfigScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SystemConfigScalarFieldEnum = (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    emailVerified?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    sessions?: UserSessionListRelationFilter
    searchHistory?: SearchHistoryListRelationFilter
    analysisRequests?: AnalysisRequestListRelationFilter
    watchList?: WatchListListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    emailVerified?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
    sessions?: UserSessionOrderByRelationAggregateInput
    searchHistory?: SearchHistoryOrderByRelationAggregateInput
    analysisRequests?: AnalysisRequestOrderByRelationAggregateInput
    watchList?: WatchListOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    emailVerified?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    sessions?: UserSessionListRelationFilter
    searchHistory?: SearchHistoryListRelationFilter
    analysisRequests?: AnalysisRequestListRelationFilter
    watchList?: WatchListListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    emailVerified?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    userId?: StringFilter<"UserProfile"> | string
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phone?: StringNullableFilter<"UserProfile"> | string | null
    avatarUrl?: StringNullableFilter<"UserProfile"> | string | null
    timezone?: StringFilter<"UserProfile"> | string
    language?: StringFilter<"UserProfile"> | string
    notificationPreferences?: JsonFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    timezone?: SortOrder
    language?: SortOrder
    notificationPreferences?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phone?: StringNullableFilter<"UserProfile"> | string | null
    avatarUrl?: StringNullableFilter<"UserProfile"> | string | null
    timezone?: StringFilter<"UserProfile"> | string
    language?: StringFilter<"UserProfile"> | string
    notificationPreferences?: JsonFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    timezone?: SortOrder
    language?: SortOrder
    notificationPreferences?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    userId?: StringWithAggregatesFilter<"UserProfile"> | string
    firstName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    phone?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    timezone?: StringWithAggregatesFilter<"UserProfile"> | string
    language?: StringWithAggregatesFilter<"UserProfile"> | string
    notificationPreferences?: JsonWithAggregatesFilter<"UserProfile">
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    refreshTokenHash?: StringFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    lastUsedAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: StringFilter<"UserSession"> | string
    refreshTokenHash?: StringFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    lastUsedAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSession"> | string
    userId?: StringWithAggregatesFilter<"UserSession"> | string
    refreshTokenHash?: StringWithAggregatesFilter<"UserSession"> | string
    deviceInfo?: JsonNullableWithAggregatesFilter<"UserSession">
    ipAddress?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    lastUsedAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    parentId?: StringNullableFilter<"Category"> | string | null
    path?: StringFilter<"Category"> | string
    level?: IntFilter<"Category"> | number
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    parent?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    children?: CategoryListRelationFilter
    products?: ProductListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    parentId?: SortOrderInput | SortOrder
    path?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parent?: CategoryOrderByWithRelationInput
    children?: CategoryOrderByRelationAggregateInput
    products?: ProductOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    parentId?: StringNullableFilter<"Category"> | string | null
    path?: StringFilter<"Category"> | string
    level?: IntFilter<"Category"> | number
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    parent?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    children?: CategoryListRelationFilter
    products?: ProductListRelationFilter
  }, "id">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    parentId?: SortOrderInput | SortOrder
    path?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    parentId?: StringNullableWithAggregatesFilter<"Category"> | string | null
    path?: StringWithAggregatesFilter<"Category"> | string
    level?: IntWithAggregatesFilter<"Category"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    url?: StringFilter<"Product"> | string
    categoryId?: StringNullableFilter<"Product"> | string | null
    currentPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    averageRating?: FloatNullableFilter<"Product"> | number | null
    totalReviews?: IntFilter<"Product"> | number
    imageUrl?: StringNullableFilter<"Product"> | string | null
    isActive?: BoolFilter<"Product"> | boolean
    lastCrawledAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    analysisResults?: AnalysisResultListRelationFilter
    analysisRequests?: AnalysisRequestListRelationFilter
    watchList?: WatchListListRelationFilter
    priceHistory?: PriceHistoryListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    currentPrice?: SortOrderInput | SortOrder
    averageRating?: SortOrderInput | SortOrder
    totalReviews?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastCrawledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    analysisResults?: AnalysisResultOrderByRelationAggregateInput
    analysisRequests?: AnalysisRequestOrderByRelationAggregateInput
    watchList?: WatchListOrderByRelationAggregateInput
    priceHistory?: PriceHistoryOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    categoryId?: StringNullableFilter<"Product"> | string | null
    currentPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    averageRating?: FloatNullableFilter<"Product"> | number | null
    totalReviews?: IntFilter<"Product"> | number
    imageUrl?: StringNullableFilter<"Product"> | string | null
    isActive?: BoolFilter<"Product"> | boolean
    lastCrawledAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    analysisResults?: AnalysisResultListRelationFilter
    analysisRequests?: AnalysisRequestListRelationFilter
    watchList?: WatchListListRelationFilter
    priceHistory?: PriceHistoryListRelationFilter
  }, "id" | "url">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    currentPrice?: SortOrderInput | SortOrder
    averageRating?: SortOrderInput | SortOrder
    totalReviews?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastCrawledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    url?: StringWithAggregatesFilter<"Product"> | string
    categoryId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    currentPrice?: DecimalNullableWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    averageRating?: FloatNullableWithAggregatesFilter<"Product"> | number | null
    totalReviews?: IntWithAggregatesFilter<"Product"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Product"> | string | null
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    lastCrawledAt?: DateTimeNullableWithAggregatesFilter<"Product"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type PriceHistoryWhereInput = {
    AND?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    OR?: PriceHistoryWhereInput[]
    NOT?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    id?: StringFilter<"PriceHistory"> | string
    productId?: StringFilter<"PriceHistory"> | string
    price?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"PriceHistory"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type PriceHistoryOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type PriceHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    OR?: PriceHistoryWhereInput[]
    NOT?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    productId?: StringFilter<"PriceHistory"> | string
    price?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"PriceHistory"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type PriceHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    _count?: PriceHistoryCountOrderByAggregateInput
    _avg?: PriceHistoryAvgOrderByAggregateInput
    _max?: PriceHistoryMaxOrderByAggregateInput
    _min?: PriceHistoryMinOrderByAggregateInput
    _sum?: PriceHistorySumOrderByAggregateInput
  }

  export type PriceHistoryScalarWhereWithAggregatesInput = {
    AND?: PriceHistoryScalarWhereWithAggregatesInput | PriceHistoryScalarWhereWithAggregatesInput[]
    OR?: PriceHistoryScalarWhereWithAggregatesInput[]
    NOT?: PriceHistoryScalarWhereWithAggregatesInput | PriceHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriceHistory"> | string
    productId?: StringWithAggregatesFilter<"PriceHistory"> | string
    price?: DecimalWithAggregatesFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"PriceHistory"> | Date | string
  }

  export type AnalysisRequestWhereInput = {
    AND?: AnalysisRequestWhereInput | AnalysisRequestWhereInput[]
    OR?: AnalysisRequestWhereInput[]
    NOT?: AnalysisRequestWhereInput | AnalysisRequestWhereInput[]
    id?: StringFilter<"AnalysisRequest"> | string
    userId?: StringNullableFilter<"AnalysisRequest"> | string | null
    productId?: StringFilter<"AnalysisRequest"> | string
    taskId?: StringFilter<"AnalysisRequest"> | string
    status?: StringFilter<"AnalysisRequest"> | string
    progress?: IntFilter<"AnalysisRequest"> | number
    requestType?: StringFilter<"AnalysisRequest"> | string
    priority?: IntFilter<"AnalysisRequest"> | number
    createdAt?: DateTimeFilter<"AnalysisRequest"> | Date | string
    completedAt?: DateTimeNullableFilter<"AnalysisRequest"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type AnalysisRequestOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    requestType?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type AnalysisRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    taskId?: string
    AND?: AnalysisRequestWhereInput | AnalysisRequestWhereInput[]
    OR?: AnalysisRequestWhereInput[]
    NOT?: AnalysisRequestWhereInput | AnalysisRequestWhereInput[]
    userId?: StringNullableFilter<"AnalysisRequest"> | string | null
    productId?: StringFilter<"AnalysisRequest"> | string
    status?: StringFilter<"AnalysisRequest"> | string
    progress?: IntFilter<"AnalysisRequest"> | number
    requestType?: StringFilter<"AnalysisRequest"> | string
    priority?: IntFilter<"AnalysisRequest"> | number
    createdAt?: DateTimeFilter<"AnalysisRequest"> | Date | string
    completedAt?: DateTimeNullableFilter<"AnalysisRequest"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id" | "taskId">

  export type AnalysisRequestOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    requestType?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: AnalysisRequestCountOrderByAggregateInput
    _avg?: AnalysisRequestAvgOrderByAggregateInput
    _max?: AnalysisRequestMaxOrderByAggregateInput
    _min?: AnalysisRequestMinOrderByAggregateInput
    _sum?: AnalysisRequestSumOrderByAggregateInput
  }

  export type AnalysisRequestScalarWhereWithAggregatesInput = {
    AND?: AnalysisRequestScalarWhereWithAggregatesInput | AnalysisRequestScalarWhereWithAggregatesInput[]
    OR?: AnalysisRequestScalarWhereWithAggregatesInput[]
    NOT?: AnalysisRequestScalarWhereWithAggregatesInput | AnalysisRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalysisRequest"> | string
    userId?: StringNullableWithAggregatesFilter<"AnalysisRequest"> | string | null
    productId?: StringWithAggregatesFilter<"AnalysisRequest"> | string
    taskId?: StringWithAggregatesFilter<"AnalysisRequest"> | string
    status?: StringWithAggregatesFilter<"AnalysisRequest"> | string
    progress?: IntWithAggregatesFilter<"AnalysisRequest"> | number
    requestType?: StringWithAggregatesFilter<"AnalysisRequest"> | string
    priority?: IntWithAggregatesFilter<"AnalysisRequest"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisRequest"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"AnalysisRequest"> | Date | string | null
  }

  export type AnalysisResultWhereInput = {
    AND?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    OR?: AnalysisResultWhereInput[]
    NOT?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    id?: StringFilter<"AnalysisResult"> | string
    productId?: StringFilter<"AnalysisResult"> | string
    taskId?: StringFilter<"AnalysisResult"> | string
    status?: StringFilter<"AnalysisResult"> | string
    sentimentPositive?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNegative?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNeutral?: FloatNullableFilter<"AnalysisResult"> | number | null
    summary?: StringNullableFilter<"AnalysisResult"> | string | null
    keywords?: JsonNullableFilter<"AnalysisResult">
    totalReviews?: IntFilter<"AnalysisResult"> | number
    averageRating?: FloatNullableFilter<"AnalysisResult"> | number | null
    ratingDistribution?: JsonNullableFilter<"AnalysisResult">
    errorMessage?: StringNullableFilter<"AnalysisResult"> | string | null
    processingTime?: IntNullableFilter<"AnalysisResult"> | number | null
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    updatedAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    keywordEntries?: KeywordListRelationFilter
  }

  export type AnalysisResultOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    sentimentPositive?: SortOrderInput | SortOrder
    sentimentNegative?: SortOrderInput | SortOrder
    sentimentNeutral?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    keywords?: SortOrderInput | SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrderInput | SortOrder
    ratingDistribution?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    processingTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    keywordEntries?: KeywordOrderByRelationAggregateInput
  }

  export type AnalysisResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    taskId?: string
    AND?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    OR?: AnalysisResultWhereInput[]
    NOT?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    productId?: StringFilter<"AnalysisResult"> | string
    status?: StringFilter<"AnalysisResult"> | string
    sentimentPositive?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNegative?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNeutral?: FloatNullableFilter<"AnalysisResult"> | number | null
    summary?: StringNullableFilter<"AnalysisResult"> | string | null
    keywords?: JsonNullableFilter<"AnalysisResult">
    totalReviews?: IntFilter<"AnalysisResult"> | number
    averageRating?: FloatNullableFilter<"AnalysisResult"> | number | null
    ratingDistribution?: JsonNullableFilter<"AnalysisResult">
    errorMessage?: StringNullableFilter<"AnalysisResult"> | string | null
    processingTime?: IntNullableFilter<"AnalysisResult"> | number | null
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    updatedAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    keywordEntries?: KeywordListRelationFilter
  }, "id" | "taskId">

  export type AnalysisResultOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    sentimentPositive?: SortOrderInput | SortOrder
    sentimentNegative?: SortOrderInput | SortOrder
    sentimentNeutral?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    keywords?: SortOrderInput | SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrderInput | SortOrder
    ratingDistribution?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    processingTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnalysisResultCountOrderByAggregateInput
    _avg?: AnalysisResultAvgOrderByAggregateInput
    _max?: AnalysisResultMaxOrderByAggregateInput
    _min?: AnalysisResultMinOrderByAggregateInput
    _sum?: AnalysisResultSumOrderByAggregateInput
  }

  export type AnalysisResultScalarWhereWithAggregatesInput = {
    AND?: AnalysisResultScalarWhereWithAggregatesInput | AnalysisResultScalarWhereWithAggregatesInput[]
    OR?: AnalysisResultScalarWhereWithAggregatesInput[]
    NOT?: AnalysisResultScalarWhereWithAggregatesInput | AnalysisResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalysisResult"> | string
    productId?: StringWithAggregatesFilter<"AnalysisResult"> | string
    taskId?: StringWithAggregatesFilter<"AnalysisResult"> | string
    status?: StringWithAggregatesFilter<"AnalysisResult"> | string
    sentimentPositive?: FloatNullableWithAggregatesFilter<"AnalysisResult"> | number | null
    sentimentNegative?: FloatNullableWithAggregatesFilter<"AnalysisResult"> | number | null
    sentimentNeutral?: FloatNullableWithAggregatesFilter<"AnalysisResult"> | number | null
    summary?: StringNullableWithAggregatesFilter<"AnalysisResult"> | string | null
    keywords?: JsonNullableWithAggregatesFilter<"AnalysisResult">
    totalReviews?: IntWithAggregatesFilter<"AnalysisResult"> | number
    averageRating?: FloatNullableWithAggregatesFilter<"AnalysisResult"> | number | null
    ratingDistribution?: JsonNullableWithAggregatesFilter<"AnalysisResult">
    errorMessage?: StringNullableWithAggregatesFilter<"AnalysisResult"> | string | null
    processingTime?: IntNullableWithAggregatesFilter<"AnalysisResult"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisResult"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AnalysisResult"> | Date | string
  }

  export type KeywordWhereInput = {
    AND?: KeywordWhereInput | KeywordWhereInput[]
    OR?: KeywordWhereInput[]
    NOT?: KeywordWhereInput | KeywordWhereInput[]
    id?: StringFilter<"Keyword"> | string
    analysisResultId?: StringFilter<"Keyword"> | string
    keyword?: StringFilter<"Keyword"> | string
    sentiment?: StringFilter<"Keyword"> | string
    frequency?: IntFilter<"Keyword"> | number
    confidence?: FloatFilter<"Keyword"> | number
    createdAt?: DateTimeFilter<"Keyword"> | Date | string
    analysisResult?: XOR<AnalysisResultScalarRelationFilter, AnalysisResultWhereInput>
  }

  export type KeywordOrderByWithRelationInput = {
    id?: SortOrder
    analysisResultId?: SortOrder
    keyword?: SortOrder
    sentiment?: SortOrder
    frequency?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    analysisResult?: AnalysisResultOrderByWithRelationInput
  }

  export type KeywordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KeywordWhereInput | KeywordWhereInput[]
    OR?: KeywordWhereInput[]
    NOT?: KeywordWhereInput | KeywordWhereInput[]
    analysisResultId?: StringFilter<"Keyword"> | string
    keyword?: StringFilter<"Keyword"> | string
    sentiment?: StringFilter<"Keyword"> | string
    frequency?: IntFilter<"Keyword"> | number
    confidence?: FloatFilter<"Keyword"> | number
    createdAt?: DateTimeFilter<"Keyword"> | Date | string
    analysisResult?: XOR<AnalysisResultScalarRelationFilter, AnalysisResultWhereInput>
  }, "id">

  export type KeywordOrderByWithAggregationInput = {
    id?: SortOrder
    analysisResultId?: SortOrder
    keyword?: SortOrder
    sentiment?: SortOrder
    frequency?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    _count?: KeywordCountOrderByAggregateInput
    _avg?: KeywordAvgOrderByAggregateInput
    _max?: KeywordMaxOrderByAggregateInput
    _min?: KeywordMinOrderByAggregateInput
    _sum?: KeywordSumOrderByAggregateInput
  }

  export type KeywordScalarWhereWithAggregatesInput = {
    AND?: KeywordScalarWhereWithAggregatesInput | KeywordScalarWhereWithAggregatesInput[]
    OR?: KeywordScalarWhereWithAggregatesInput[]
    NOT?: KeywordScalarWhereWithAggregatesInput | KeywordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Keyword"> | string
    analysisResultId?: StringWithAggregatesFilter<"Keyword"> | string
    keyword?: StringWithAggregatesFilter<"Keyword"> | string
    sentiment?: StringWithAggregatesFilter<"Keyword"> | string
    frequency?: IntWithAggregatesFilter<"Keyword"> | number
    confidence?: FloatWithAggregatesFilter<"Keyword"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Keyword"> | Date | string
  }

  export type SearchHistoryWhereInput = {
    AND?: SearchHistoryWhereInput | SearchHistoryWhereInput[]
    OR?: SearchHistoryWhereInput[]
    NOT?: SearchHistoryWhereInput | SearchHistoryWhereInput[]
    id?: StringFilter<"SearchHistory"> | string
    userId?: StringFilter<"SearchHistory"> | string
    query?: StringFilter<"SearchHistory"> | string
    resultCount?: IntFilter<"SearchHistory"> | number
    createdAt?: DateTimeFilter<"SearchHistory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SearchHistoryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    resultCount?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SearchHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SearchHistoryWhereInput | SearchHistoryWhereInput[]
    OR?: SearchHistoryWhereInput[]
    NOT?: SearchHistoryWhereInput | SearchHistoryWhereInput[]
    userId?: StringFilter<"SearchHistory"> | string
    query?: StringFilter<"SearchHistory"> | string
    resultCount?: IntFilter<"SearchHistory"> | number
    createdAt?: DateTimeFilter<"SearchHistory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SearchHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    resultCount?: SortOrder
    createdAt?: SortOrder
    _count?: SearchHistoryCountOrderByAggregateInput
    _avg?: SearchHistoryAvgOrderByAggregateInput
    _max?: SearchHistoryMaxOrderByAggregateInput
    _min?: SearchHistoryMinOrderByAggregateInput
    _sum?: SearchHistorySumOrderByAggregateInput
  }

  export type SearchHistoryScalarWhereWithAggregatesInput = {
    AND?: SearchHistoryScalarWhereWithAggregatesInput | SearchHistoryScalarWhereWithAggregatesInput[]
    OR?: SearchHistoryScalarWhereWithAggregatesInput[]
    NOT?: SearchHistoryScalarWhereWithAggregatesInput | SearchHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SearchHistory"> | string
    userId?: StringWithAggregatesFilter<"SearchHistory"> | string
    query?: StringWithAggregatesFilter<"SearchHistory"> | string
    resultCount?: IntWithAggregatesFilter<"SearchHistory"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SearchHistory"> | Date | string
  }

  export type WatchListWhereInput = {
    AND?: WatchListWhereInput | WatchListWhereInput[]
    OR?: WatchListWhereInput[]
    NOT?: WatchListWhereInput | WatchListWhereInput[]
    id?: StringFilter<"WatchList"> | string
    userId?: StringFilter<"WatchList"> | string
    productId?: StringFilter<"WatchList"> | string
    priceAlert?: BoolFilter<"WatchList"> | boolean
    targetPrice?: DecimalNullableFilter<"WatchList"> | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: DateTimeNullableFilter<"WatchList"> | Date | string | null
    analysisFrequency?: StringFilter<"WatchList"> | string
    isActive?: BoolFilter<"WatchList"> | boolean
    createdAt?: DateTimeFilter<"WatchList"> | Date | string
    updatedAt?: DateTimeFilter<"WatchList"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type WatchListOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    priceAlert?: SortOrder
    targetPrice?: SortOrderInput | SortOrder
    lastNotifiedAt?: SortOrderInput | SortOrder
    analysisFrequency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type WatchListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_productId?: WatchListUserIdProductIdCompoundUniqueInput
    AND?: WatchListWhereInput | WatchListWhereInput[]
    OR?: WatchListWhereInput[]
    NOT?: WatchListWhereInput | WatchListWhereInput[]
    userId?: StringFilter<"WatchList"> | string
    productId?: StringFilter<"WatchList"> | string
    priceAlert?: BoolFilter<"WatchList"> | boolean
    targetPrice?: DecimalNullableFilter<"WatchList"> | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: DateTimeNullableFilter<"WatchList"> | Date | string | null
    analysisFrequency?: StringFilter<"WatchList"> | string
    isActive?: BoolFilter<"WatchList"> | boolean
    createdAt?: DateTimeFilter<"WatchList"> | Date | string
    updatedAt?: DateTimeFilter<"WatchList"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id" | "userId_productId">

  export type WatchListOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    priceAlert?: SortOrder
    targetPrice?: SortOrderInput | SortOrder
    lastNotifiedAt?: SortOrderInput | SortOrder
    analysisFrequency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WatchListCountOrderByAggregateInput
    _avg?: WatchListAvgOrderByAggregateInput
    _max?: WatchListMaxOrderByAggregateInput
    _min?: WatchListMinOrderByAggregateInput
    _sum?: WatchListSumOrderByAggregateInput
  }

  export type WatchListScalarWhereWithAggregatesInput = {
    AND?: WatchListScalarWhereWithAggregatesInput | WatchListScalarWhereWithAggregatesInput[]
    OR?: WatchListScalarWhereWithAggregatesInput[]
    NOT?: WatchListScalarWhereWithAggregatesInput | WatchListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WatchList"> | string
    userId?: StringWithAggregatesFilter<"WatchList"> | string
    productId?: StringWithAggregatesFilter<"WatchList"> | string
    priceAlert?: BoolWithAggregatesFilter<"WatchList"> | boolean
    targetPrice?: DecimalNullableWithAggregatesFilter<"WatchList"> | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: DateTimeNullableWithAggregatesFilter<"WatchList"> | Date | string | null
    analysisFrequency?: StringWithAggregatesFilter<"WatchList"> | string
    isActive?: BoolWithAggregatesFilter<"WatchList"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"WatchList"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WatchList"> | Date | string
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    id?: StringFilter<"SystemConfig"> | string
    key?: StringFilter<"SystemConfig"> | string
    value?: JsonFilter<"SystemConfig">
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }

  export type SystemConfigOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    value?: JsonFilter<"SystemConfig">
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }, "id" | "key">

  export type SystemConfigOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemConfig"> | string
    key?: StringWithAggregatesFilter<"SystemConfig"> | string
    value?: JsonWithAggregatesFilter<"SystemConfig">
    createdAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutUserInput
    watchList?: WatchListCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryUncheckedCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutUserInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutUserNestedInput
    watchList?: WatchListUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUncheckedUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatarUrl?: string | null
    timezone?: string
    language?: string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    userId: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatarUrl?: string | null
    timezone?: string
    language?: string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateManyInput = {
    id?: string
    userId: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatarUrl?: string | null
    timezone?: string
    language?: string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateInput = {
    id?: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: CategoryCreateNestedOneWithoutChildrenInput
    children?: CategoryCreateNestedManyWithoutParentInput
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    name: string
    parentId?: string | null
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CategoryUpdateOneWithoutChildrenNestedInput
    children?: CategoryUpdateManyWithoutParentNestedInput
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    name: string
    parentId?: string | null
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutProductsInput
    analysisResults?: AnalysisResultCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutProductInput
    watchList?: WatchListCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultUncheckedCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutProductInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutProductsNestedInput
    analysisResults?: AnalysisResultUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutProductNestedInput
    watchList?: WatchListUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUncheckedUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryCreateInput = {
    id?: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutPriceHistoryInput
  }

  export type PriceHistoryUncheckedCreateInput = {
    id?: string
    productId: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type PriceHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutPriceHistoryNestedInput
  }

  export type PriceHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryCreateManyInput = {
    id?: string
    productId: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type PriceHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisRequestCreateInput = {
    id?: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
    user?: UserCreateNestedOneWithoutAnalysisRequestsInput
    product: ProductCreateNestedOneWithoutAnalysisRequestsInput
  }

  export type AnalysisRequestUncheckedCreateInput = {
    id?: string
    userId?: string | null
    productId: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type AnalysisRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutAnalysisRequestsNestedInput
    product?: ProductUpdateOneRequiredWithoutAnalysisRequestsNestedInput
  }

  export type AnalysisRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisRequestCreateManyInput = {
    id?: string
    userId?: string | null
    productId: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type AnalysisRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisResultCreateInput = {
    id?: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutAnalysisResultsInput
    keywordEntries?: KeywordCreateNestedManyWithoutAnalysisResultInput
  }

  export type AnalysisResultUncheckedCreateInput = {
    id?: string
    productId: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    keywordEntries?: KeywordUncheckedCreateNestedManyWithoutAnalysisResultInput
  }

  export type AnalysisResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutAnalysisResultsNestedInput
    keywordEntries?: KeywordUpdateManyWithoutAnalysisResultNestedInput
  }

  export type AnalysisResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keywordEntries?: KeywordUncheckedUpdateManyWithoutAnalysisResultNestedInput
  }

  export type AnalysisResultCreateManyInput = {
    id?: string
    productId: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalysisResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordCreateInput = {
    id?: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
    analysisResult: AnalysisResultCreateNestedOneWithoutKeywordEntriesInput
  }

  export type KeywordUncheckedCreateInput = {
    id?: string
    analysisResultId: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
  }

  export type KeywordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResult?: AnalysisResultUpdateOneRequiredWithoutKeywordEntriesNestedInput
  }

  export type KeywordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisResultId?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordCreateManyInput = {
    id?: string
    analysisResultId: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
  }

  export type KeywordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisResultId?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryCreateInput = {
    id?: string
    query: string
    resultCount?: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSearchHistoryInput
  }

  export type SearchHistoryUncheckedCreateInput = {
    id?: string
    userId: string
    query: string
    resultCount?: number
    createdAt?: Date | string
  }

  export type SearchHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSearchHistoryNestedInput
  }

  export type SearchHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryCreateManyInput = {
    id?: string
    userId: string
    query: string
    resultCount?: number
    createdAt?: Date | string
  }

  export type SearchHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchListCreateInput = {
    id?: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWatchListInput
    product: ProductCreateNestedOneWithoutWatchListInput
  }

  export type WatchListUncheckedCreateInput = {
    id?: string
    userId: string
    productId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatchListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWatchListNestedInput
    product?: ProductUpdateOneRequiredWithoutWatchListNestedInput
  }

  export type WatchListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchListCreateManyInput = {
    id?: string
    userId: string
    productId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatchListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateInput = {
    id?: string
    key: string
    value: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUncheckedCreateInput = {
    id?: string
    key: string
    value: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    id?: string
    key: string
    value: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserProfileNullableScalarRelationFilter = {
    is?: UserProfileWhereInput | null
    isNot?: UserProfileWhereInput | null
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type SearchHistoryListRelationFilter = {
    every?: SearchHistoryWhereInput
    some?: SearchHistoryWhereInput
    none?: SearchHistoryWhereInput
  }

  export type AnalysisRequestListRelationFilter = {
    every?: AnalysisRequestWhereInput
    some?: AnalysisRequestWhereInput
    none?: AnalysisRequestWhereInput
  }

  export type WatchListListRelationFilter = {
    every?: WatchListWhereInput
    some?: WatchListWhereInput
    none?: WatchListWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SearchHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalysisRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WatchListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    emailVerified?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    emailVerified?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    emailVerified?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatarUrl?: SortOrder
    timezone?: SortOrder
    language?: SortOrder
    notificationPreferences?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatarUrl?: SortOrder
    timezone?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatarUrl?: SortOrder
    timezone?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    deviceInfo?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parentId?: SortOrder
    path?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    level?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parentId?: SortOrder
    path?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parentId?: SortOrder
    path?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    level?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type AnalysisResultListRelationFilter = {
    every?: AnalysisResultWhereInput
    some?: AnalysisResultWhereInput
    none?: AnalysisResultWhereInput
  }

  export type PriceHistoryListRelationFilter = {
    every?: PriceHistoryWhereInput
    some?: PriceHistoryWhereInput
    none?: PriceHistoryWhereInput
  }

  export type AnalysisResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PriceHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    categoryId?: SortOrder
    currentPrice?: SortOrder
    averageRating?: SortOrder
    totalReviews?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastCrawledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    currentPrice?: SortOrder
    averageRating?: SortOrder
    totalReviews?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    categoryId?: SortOrder
    currentPrice?: SortOrder
    averageRating?: SortOrder
    totalReviews?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastCrawledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    categoryId?: SortOrder
    currentPrice?: SortOrder
    averageRating?: SortOrder
    totalReviews?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastCrawledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    currentPrice?: SortOrder
    averageRating?: SortOrder
    totalReviews?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type PriceHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceHistoryAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type PriceHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceHistorySumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AnalysisRequestCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    requestType?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AnalysisRequestAvgOrderByAggregateInput = {
    progress?: SortOrder
    priority?: SortOrder
  }

  export type AnalysisRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    requestType?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AnalysisRequestMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    requestType?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AnalysisRequestSumOrderByAggregateInput = {
    progress?: SortOrder
    priority?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type KeywordListRelationFilter = {
    every?: KeywordWhereInput
    some?: KeywordWhereInput
    none?: KeywordWhereInput
  }

  export type KeywordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalysisResultCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    sentimentPositive?: SortOrder
    sentimentNegative?: SortOrder
    sentimentNeutral?: SortOrder
    summary?: SortOrder
    keywords?: SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrder
    ratingDistribution?: SortOrder
    errorMessage?: SortOrder
    processingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalysisResultAvgOrderByAggregateInput = {
    sentimentPositive?: SortOrder
    sentimentNegative?: SortOrder
    sentimentNeutral?: SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrder
    processingTime?: SortOrder
  }

  export type AnalysisResultMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    sentimentPositive?: SortOrder
    sentimentNegative?: SortOrder
    sentimentNeutral?: SortOrder
    summary?: SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrder
    errorMessage?: SortOrder
    processingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalysisResultMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    taskId?: SortOrder
    status?: SortOrder
    sentimentPositive?: SortOrder
    sentimentNegative?: SortOrder
    sentimentNeutral?: SortOrder
    summary?: SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrder
    errorMessage?: SortOrder
    processingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalysisResultSumOrderByAggregateInput = {
    sentimentPositive?: SortOrder
    sentimentNegative?: SortOrder
    sentimentNeutral?: SortOrder
    totalReviews?: SortOrder
    averageRating?: SortOrder
    processingTime?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AnalysisResultScalarRelationFilter = {
    is?: AnalysisResultWhereInput
    isNot?: AnalysisResultWhereInput
  }

  export type KeywordCountOrderByAggregateInput = {
    id?: SortOrder
    analysisResultId?: SortOrder
    keyword?: SortOrder
    sentiment?: SortOrder
    frequency?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type KeywordAvgOrderByAggregateInput = {
    frequency?: SortOrder
    confidence?: SortOrder
  }

  export type KeywordMaxOrderByAggregateInput = {
    id?: SortOrder
    analysisResultId?: SortOrder
    keyword?: SortOrder
    sentiment?: SortOrder
    frequency?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type KeywordMinOrderByAggregateInput = {
    id?: SortOrder
    analysisResultId?: SortOrder
    keyword?: SortOrder
    sentiment?: SortOrder
    frequency?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type KeywordSumOrderByAggregateInput = {
    frequency?: SortOrder
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SearchHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    resultCount?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchHistoryAvgOrderByAggregateInput = {
    resultCount?: SortOrder
  }

  export type SearchHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    resultCount?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    resultCount?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchHistorySumOrderByAggregateInput = {
    resultCount?: SortOrder
  }

  export type WatchListUserIdProductIdCompoundUniqueInput = {
    userId: string
    productId: string
  }

  export type WatchListCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    priceAlert?: SortOrder
    targetPrice?: SortOrder
    lastNotifiedAt?: SortOrder
    analysisFrequency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchListAvgOrderByAggregateInput = {
    targetPrice?: SortOrder
  }

  export type WatchListMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    priceAlert?: SortOrder
    targetPrice?: SortOrder
    lastNotifiedAt?: SortOrder
    analysisFrequency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchListMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    priceAlert?: SortOrder
    targetPrice?: SortOrder
    lastNotifiedAt?: SortOrder
    analysisFrequency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchListSumOrderByAggregateInput = {
    targetPrice?: SortOrder
  }

  export type SystemConfigCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type SearchHistoryCreateNestedManyWithoutUserInput = {
    create?: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput> | SearchHistoryCreateWithoutUserInput[] | SearchHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SearchHistoryCreateOrConnectWithoutUserInput | SearchHistoryCreateOrConnectWithoutUserInput[]
    createMany?: SearchHistoryCreateManyUserInputEnvelope
    connect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
  }

  export type AnalysisRequestCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput> | AnalysisRequestCreateWithoutUserInput[] | AnalysisRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutUserInput | AnalysisRequestCreateOrConnectWithoutUserInput[]
    createMany?: AnalysisRequestCreateManyUserInputEnvelope
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
  }

  export type WatchListCreateNestedManyWithoutUserInput = {
    create?: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput> | WatchListCreateWithoutUserInput[] | WatchListUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutUserInput | WatchListCreateOrConnectWithoutUserInput[]
    createMany?: WatchListCreateManyUserInputEnvelope
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
  }

  export type UserProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type SearchHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput> | SearchHistoryCreateWithoutUserInput[] | SearchHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SearchHistoryCreateOrConnectWithoutUserInput | SearchHistoryCreateOrConnectWithoutUserInput[]
    createMany?: SearchHistoryCreateManyUserInputEnvelope
    connect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
  }

  export type AnalysisRequestUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput> | AnalysisRequestCreateWithoutUserInput[] | AnalysisRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutUserInput | AnalysisRequestCreateOrConnectWithoutUserInput[]
    createMany?: AnalysisRequestCreateManyUserInputEnvelope
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
  }

  export type WatchListUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput> | WatchListCreateWithoutUserInput[] | WatchListUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutUserInput | WatchListCreateOrConnectWithoutUserInput[]
    createMany?: WatchListCreateManyUserInputEnvelope
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type SearchHistoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput> | SearchHistoryCreateWithoutUserInput[] | SearchHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SearchHistoryCreateOrConnectWithoutUserInput | SearchHistoryCreateOrConnectWithoutUserInput[]
    upsert?: SearchHistoryUpsertWithWhereUniqueWithoutUserInput | SearchHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SearchHistoryCreateManyUserInputEnvelope
    set?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    disconnect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    delete?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    connect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    update?: SearchHistoryUpdateWithWhereUniqueWithoutUserInput | SearchHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SearchHistoryUpdateManyWithWhereWithoutUserInput | SearchHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SearchHistoryScalarWhereInput | SearchHistoryScalarWhereInput[]
  }

  export type AnalysisRequestUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput> | AnalysisRequestCreateWithoutUserInput[] | AnalysisRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutUserInput | AnalysisRequestCreateOrConnectWithoutUserInput[]
    upsert?: AnalysisRequestUpsertWithWhereUniqueWithoutUserInput | AnalysisRequestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalysisRequestCreateManyUserInputEnvelope
    set?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    disconnect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    delete?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    update?: AnalysisRequestUpdateWithWhereUniqueWithoutUserInput | AnalysisRequestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalysisRequestUpdateManyWithWhereWithoutUserInput | AnalysisRequestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
  }

  export type WatchListUpdateManyWithoutUserNestedInput = {
    create?: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput> | WatchListCreateWithoutUserInput[] | WatchListUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutUserInput | WatchListCreateOrConnectWithoutUserInput[]
    upsert?: WatchListUpsertWithWhereUniqueWithoutUserInput | WatchListUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WatchListCreateManyUserInputEnvelope
    set?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    disconnect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    delete?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    update?: WatchListUpdateWithWhereUniqueWithoutUserInput | WatchListUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WatchListUpdateManyWithWhereWithoutUserInput | WatchListUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
  }

  export type UserProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type SearchHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput> | SearchHistoryCreateWithoutUserInput[] | SearchHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SearchHistoryCreateOrConnectWithoutUserInput | SearchHistoryCreateOrConnectWithoutUserInput[]
    upsert?: SearchHistoryUpsertWithWhereUniqueWithoutUserInput | SearchHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SearchHistoryCreateManyUserInputEnvelope
    set?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    disconnect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    delete?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    connect?: SearchHistoryWhereUniqueInput | SearchHistoryWhereUniqueInput[]
    update?: SearchHistoryUpdateWithWhereUniqueWithoutUserInput | SearchHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SearchHistoryUpdateManyWithWhereWithoutUserInput | SearchHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SearchHistoryScalarWhereInput | SearchHistoryScalarWhereInput[]
  }

  export type AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput> | AnalysisRequestCreateWithoutUserInput[] | AnalysisRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutUserInput | AnalysisRequestCreateOrConnectWithoutUserInput[]
    upsert?: AnalysisRequestUpsertWithWhereUniqueWithoutUserInput | AnalysisRequestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalysisRequestCreateManyUserInputEnvelope
    set?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    disconnect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    delete?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    update?: AnalysisRequestUpdateWithWhereUniqueWithoutUserInput | AnalysisRequestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalysisRequestUpdateManyWithWhereWithoutUserInput | AnalysisRequestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
  }

  export type WatchListUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput> | WatchListCreateWithoutUserInput[] | WatchListUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutUserInput | WatchListCreateOrConnectWithoutUserInput[]
    upsert?: WatchListUpsertWithWhereUniqueWithoutUserInput | WatchListUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WatchListCreateManyUserInputEnvelope
    set?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    disconnect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    delete?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    update?: WatchListUpdateWithWhereUniqueWithoutUserInput | WatchListUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WatchListUpdateManyWithWhereWithoutUserInput | WatchListUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    upsert?: UserUpsertWithoutProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfileInput, UserUpdateWithoutProfileInput>, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type CategoryCreateNestedOneWithoutChildrenInput = {
    create?: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput
    connect?: CategoryWhereUniqueInput
  }

  export type CategoryCreateNestedManyWithoutParentInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type ProductCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type CategoryUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput
    upsert?: CategoryUpsertWithoutChildrenInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutChildrenInput, CategoryUpdateWithoutChildrenInput>, CategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type CategoryUpdateManyWithoutParentNestedInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutParentInput | CategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutParentInput | CategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutParentInput | CategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type ProductUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type CategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutParentInput | CategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutParentInput | CategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutParentInput | CategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutProductsInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    connect?: CategoryWhereUniqueInput
  }

  export type AnalysisResultCreateNestedManyWithoutProductInput = {
    create?: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput> | AnalysisResultCreateWithoutProductInput[] | AnalysisResultUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutProductInput | AnalysisResultCreateOrConnectWithoutProductInput[]
    createMany?: AnalysisResultCreateManyProductInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type AnalysisRequestCreateNestedManyWithoutProductInput = {
    create?: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput> | AnalysisRequestCreateWithoutProductInput[] | AnalysisRequestUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutProductInput | AnalysisRequestCreateOrConnectWithoutProductInput[]
    createMany?: AnalysisRequestCreateManyProductInputEnvelope
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
  }

  export type WatchListCreateNestedManyWithoutProductInput = {
    create?: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput> | WatchListCreateWithoutProductInput[] | WatchListUncheckedCreateWithoutProductInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutProductInput | WatchListCreateOrConnectWithoutProductInput[]
    createMany?: WatchListCreateManyProductInputEnvelope
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
  }

  export type PriceHistoryCreateNestedManyWithoutProductInput = {
    create?: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput> | PriceHistoryCreateWithoutProductInput[] | PriceHistoryUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutProductInput | PriceHistoryCreateOrConnectWithoutProductInput[]
    createMany?: PriceHistoryCreateManyProductInputEnvelope
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
  }

  export type AnalysisResultUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput> | AnalysisResultCreateWithoutProductInput[] | AnalysisResultUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutProductInput | AnalysisResultCreateOrConnectWithoutProductInput[]
    createMany?: AnalysisResultCreateManyProductInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type AnalysisRequestUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput> | AnalysisRequestCreateWithoutProductInput[] | AnalysisRequestUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutProductInput | AnalysisRequestCreateOrConnectWithoutProductInput[]
    createMany?: AnalysisRequestCreateManyProductInputEnvelope
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
  }

  export type WatchListUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput> | WatchListCreateWithoutProductInput[] | WatchListUncheckedCreateWithoutProductInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutProductInput | WatchListCreateOrConnectWithoutProductInput[]
    createMany?: WatchListCreateManyProductInputEnvelope
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
  }

  export type PriceHistoryUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput> | PriceHistoryCreateWithoutProductInput[] | PriceHistoryUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutProductInput | PriceHistoryCreateOrConnectWithoutProductInput[]
    createMany?: PriceHistoryCreateManyProductInputEnvelope
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUpdateOneWithoutProductsNestedInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    upsert?: CategoryUpsertWithoutProductsInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutProductsInput, CategoryUpdateWithoutProductsInput>, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type AnalysisResultUpdateManyWithoutProductNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput> | AnalysisResultCreateWithoutProductInput[] | AnalysisResultUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutProductInput | AnalysisResultCreateOrConnectWithoutProductInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutProductInput | AnalysisResultUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: AnalysisResultCreateManyProductInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutProductInput | AnalysisResultUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutProductInput | AnalysisResultUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisRequestUpdateManyWithoutProductNestedInput = {
    create?: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput> | AnalysisRequestCreateWithoutProductInput[] | AnalysisRequestUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutProductInput | AnalysisRequestCreateOrConnectWithoutProductInput[]
    upsert?: AnalysisRequestUpsertWithWhereUniqueWithoutProductInput | AnalysisRequestUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: AnalysisRequestCreateManyProductInputEnvelope
    set?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    disconnect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    delete?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    update?: AnalysisRequestUpdateWithWhereUniqueWithoutProductInput | AnalysisRequestUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: AnalysisRequestUpdateManyWithWhereWithoutProductInput | AnalysisRequestUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
  }

  export type WatchListUpdateManyWithoutProductNestedInput = {
    create?: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput> | WatchListCreateWithoutProductInput[] | WatchListUncheckedCreateWithoutProductInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutProductInput | WatchListCreateOrConnectWithoutProductInput[]
    upsert?: WatchListUpsertWithWhereUniqueWithoutProductInput | WatchListUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: WatchListCreateManyProductInputEnvelope
    set?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    disconnect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    delete?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    update?: WatchListUpdateWithWhereUniqueWithoutProductInput | WatchListUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: WatchListUpdateManyWithWhereWithoutProductInput | WatchListUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
  }

  export type PriceHistoryUpdateManyWithoutProductNestedInput = {
    create?: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput> | PriceHistoryCreateWithoutProductInput[] | PriceHistoryUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutProductInput | PriceHistoryCreateOrConnectWithoutProductInput[]
    upsert?: PriceHistoryUpsertWithWhereUniqueWithoutProductInput | PriceHistoryUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PriceHistoryCreateManyProductInputEnvelope
    set?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    disconnect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    delete?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    update?: PriceHistoryUpdateWithWhereUniqueWithoutProductInput | PriceHistoryUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PriceHistoryUpdateManyWithWhereWithoutProductInput | PriceHistoryUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
  }

  export type AnalysisResultUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput> | AnalysisResultCreateWithoutProductInput[] | AnalysisResultUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutProductInput | AnalysisResultCreateOrConnectWithoutProductInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutProductInput | AnalysisResultUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: AnalysisResultCreateManyProductInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutProductInput | AnalysisResultUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutProductInput | AnalysisResultUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput> | AnalysisRequestCreateWithoutProductInput[] | AnalysisRequestUncheckedCreateWithoutProductInput[]
    connectOrCreate?: AnalysisRequestCreateOrConnectWithoutProductInput | AnalysisRequestCreateOrConnectWithoutProductInput[]
    upsert?: AnalysisRequestUpsertWithWhereUniqueWithoutProductInput | AnalysisRequestUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: AnalysisRequestCreateManyProductInputEnvelope
    set?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    disconnect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    delete?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    connect?: AnalysisRequestWhereUniqueInput | AnalysisRequestWhereUniqueInput[]
    update?: AnalysisRequestUpdateWithWhereUniqueWithoutProductInput | AnalysisRequestUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: AnalysisRequestUpdateManyWithWhereWithoutProductInput | AnalysisRequestUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
  }

  export type WatchListUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput> | WatchListCreateWithoutProductInput[] | WatchListUncheckedCreateWithoutProductInput[]
    connectOrCreate?: WatchListCreateOrConnectWithoutProductInput | WatchListCreateOrConnectWithoutProductInput[]
    upsert?: WatchListUpsertWithWhereUniqueWithoutProductInput | WatchListUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: WatchListCreateManyProductInputEnvelope
    set?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    disconnect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    delete?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    connect?: WatchListWhereUniqueInput | WatchListWhereUniqueInput[]
    update?: WatchListUpdateWithWhereUniqueWithoutProductInput | WatchListUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: WatchListUpdateManyWithWhereWithoutProductInput | WatchListUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
  }

  export type PriceHistoryUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput> | PriceHistoryCreateWithoutProductInput[] | PriceHistoryUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutProductInput | PriceHistoryCreateOrConnectWithoutProductInput[]
    upsert?: PriceHistoryUpsertWithWhereUniqueWithoutProductInput | PriceHistoryUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PriceHistoryCreateManyProductInputEnvelope
    set?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    disconnect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    delete?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    update?: PriceHistoryUpdateWithWhereUniqueWithoutProductInput | PriceHistoryUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PriceHistoryUpdateManyWithWhereWithoutProductInput | PriceHistoryUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutPriceHistoryInput = {
    create?: XOR<ProductCreateWithoutPriceHistoryInput, ProductUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPriceHistoryInput
    connect?: ProductWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ProductUpdateOneRequiredWithoutPriceHistoryNestedInput = {
    create?: XOR<ProductCreateWithoutPriceHistoryInput, ProductUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPriceHistoryInput
    upsert?: ProductUpsertWithoutPriceHistoryInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPriceHistoryInput, ProductUpdateWithoutPriceHistoryInput>, ProductUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type UserCreateNestedOneWithoutAnalysisRequestsInput = {
    create?: XOR<UserCreateWithoutAnalysisRequestsInput, UserUncheckedCreateWithoutAnalysisRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysisRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutAnalysisRequestsInput = {
    create?: XOR<ProductCreateWithoutAnalysisRequestsInput, ProductUncheckedCreateWithoutAnalysisRequestsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAnalysisRequestsInput
    connect?: ProductWhereUniqueInput
  }

  export type UserUpdateOneWithoutAnalysisRequestsNestedInput = {
    create?: XOR<UserCreateWithoutAnalysisRequestsInput, UserUncheckedCreateWithoutAnalysisRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysisRequestsInput
    upsert?: UserUpsertWithoutAnalysisRequestsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnalysisRequestsInput, UserUpdateWithoutAnalysisRequestsInput>, UserUncheckedUpdateWithoutAnalysisRequestsInput>
  }

  export type ProductUpdateOneRequiredWithoutAnalysisRequestsNestedInput = {
    create?: XOR<ProductCreateWithoutAnalysisRequestsInput, ProductUncheckedCreateWithoutAnalysisRequestsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAnalysisRequestsInput
    upsert?: ProductUpsertWithoutAnalysisRequestsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutAnalysisRequestsInput, ProductUpdateWithoutAnalysisRequestsInput>, ProductUncheckedUpdateWithoutAnalysisRequestsInput>
  }

  export type ProductCreateNestedOneWithoutAnalysisResultsInput = {
    create?: XOR<ProductCreateWithoutAnalysisResultsInput, ProductUncheckedCreateWithoutAnalysisResultsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAnalysisResultsInput
    connect?: ProductWhereUniqueInput
  }

  export type KeywordCreateNestedManyWithoutAnalysisResultInput = {
    create?: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput> | KeywordCreateWithoutAnalysisResultInput[] | KeywordUncheckedCreateWithoutAnalysisResultInput[]
    connectOrCreate?: KeywordCreateOrConnectWithoutAnalysisResultInput | KeywordCreateOrConnectWithoutAnalysisResultInput[]
    createMany?: KeywordCreateManyAnalysisResultInputEnvelope
    connect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
  }

  export type KeywordUncheckedCreateNestedManyWithoutAnalysisResultInput = {
    create?: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput> | KeywordCreateWithoutAnalysisResultInput[] | KeywordUncheckedCreateWithoutAnalysisResultInput[]
    connectOrCreate?: KeywordCreateOrConnectWithoutAnalysisResultInput | KeywordCreateOrConnectWithoutAnalysisResultInput[]
    createMany?: KeywordCreateManyAnalysisResultInputEnvelope
    connect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUpdateOneRequiredWithoutAnalysisResultsNestedInput = {
    create?: XOR<ProductCreateWithoutAnalysisResultsInput, ProductUncheckedCreateWithoutAnalysisResultsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAnalysisResultsInput
    upsert?: ProductUpsertWithoutAnalysisResultsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutAnalysisResultsInput, ProductUpdateWithoutAnalysisResultsInput>, ProductUncheckedUpdateWithoutAnalysisResultsInput>
  }

  export type KeywordUpdateManyWithoutAnalysisResultNestedInput = {
    create?: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput> | KeywordCreateWithoutAnalysisResultInput[] | KeywordUncheckedCreateWithoutAnalysisResultInput[]
    connectOrCreate?: KeywordCreateOrConnectWithoutAnalysisResultInput | KeywordCreateOrConnectWithoutAnalysisResultInput[]
    upsert?: KeywordUpsertWithWhereUniqueWithoutAnalysisResultInput | KeywordUpsertWithWhereUniqueWithoutAnalysisResultInput[]
    createMany?: KeywordCreateManyAnalysisResultInputEnvelope
    set?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    disconnect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    delete?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    connect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    update?: KeywordUpdateWithWhereUniqueWithoutAnalysisResultInput | KeywordUpdateWithWhereUniqueWithoutAnalysisResultInput[]
    updateMany?: KeywordUpdateManyWithWhereWithoutAnalysisResultInput | KeywordUpdateManyWithWhereWithoutAnalysisResultInput[]
    deleteMany?: KeywordScalarWhereInput | KeywordScalarWhereInput[]
  }

  export type KeywordUncheckedUpdateManyWithoutAnalysisResultNestedInput = {
    create?: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput> | KeywordCreateWithoutAnalysisResultInput[] | KeywordUncheckedCreateWithoutAnalysisResultInput[]
    connectOrCreate?: KeywordCreateOrConnectWithoutAnalysisResultInput | KeywordCreateOrConnectWithoutAnalysisResultInput[]
    upsert?: KeywordUpsertWithWhereUniqueWithoutAnalysisResultInput | KeywordUpsertWithWhereUniqueWithoutAnalysisResultInput[]
    createMany?: KeywordCreateManyAnalysisResultInputEnvelope
    set?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    disconnect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    delete?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    connect?: KeywordWhereUniqueInput | KeywordWhereUniqueInput[]
    update?: KeywordUpdateWithWhereUniqueWithoutAnalysisResultInput | KeywordUpdateWithWhereUniqueWithoutAnalysisResultInput[]
    updateMany?: KeywordUpdateManyWithWhereWithoutAnalysisResultInput | KeywordUpdateManyWithWhereWithoutAnalysisResultInput[]
    deleteMany?: KeywordScalarWhereInput | KeywordScalarWhereInput[]
  }

  export type AnalysisResultCreateNestedOneWithoutKeywordEntriesInput = {
    create?: XOR<AnalysisResultCreateWithoutKeywordEntriesInput, AnalysisResultUncheckedCreateWithoutKeywordEntriesInput>
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutKeywordEntriesInput
    connect?: AnalysisResultWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnalysisResultUpdateOneRequiredWithoutKeywordEntriesNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutKeywordEntriesInput, AnalysisResultUncheckedCreateWithoutKeywordEntriesInput>
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutKeywordEntriesInput
    upsert?: AnalysisResultUpsertWithoutKeywordEntriesInput
    connect?: AnalysisResultWhereUniqueInput
    update?: XOR<XOR<AnalysisResultUpdateToOneWithWhereWithoutKeywordEntriesInput, AnalysisResultUpdateWithoutKeywordEntriesInput>, AnalysisResultUncheckedUpdateWithoutKeywordEntriesInput>
  }

  export type UserCreateNestedOneWithoutSearchHistoryInput = {
    create?: XOR<UserCreateWithoutSearchHistoryInput, UserUncheckedCreateWithoutSearchHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutSearchHistoryInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSearchHistoryNestedInput = {
    create?: XOR<UserCreateWithoutSearchHistoryInput, UserUncheckedCreateWithoutSearchHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutSearchHistoryInput
    upsert?: UserUpsertWithoutSearchHistoryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSearchHistoryInput, UserUpdateWithoutSearchHistoryInput>, UserUncheckedUpdateWithoutSearchHistoryInput>
  }

  export type UserCreateNestedOneWithoutWatchListInput = {
    create?: XOR<UserCreateWithoutWatchListInput, UserUncheckedCreateWithoutWatchListInput>
    connectOrCreate?: UserCreateOrConnectWithoutWatchListInput
    connect?: UserWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutWatchListInput = {
    create?: XOR<ProductCreateWithoutWatchListInput, ProductUncheckedCreateWithoutWatchListInput>
    connectOrCreate?: ProductCreateOrConnectWithoutWatchListInput
    connect?: ProductWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutWatchListNestedInput = {
    create?: XOR<UserCreateWithoutWatchListInput, UserUncheckedCreateWithoutWatchListInput>
    connectOrCreate?: UserCreateOrConnectWithoutWatchListInput
    upsert?: UserUpsertWithoutWatchListInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWatchListInput, UserUpdateWithoutWatchListInput>, UserUncheckedUpdateWithoutWatchListInput>
  }

  export type ProductUpdateOneRequiredWithoutWatchListNestedInput = {
    create?: XOR<ProductCreateWithoutWatchListInput, ProductUncheckedCreateWithoutWatchListInput>
    connectOrCreate?: ProductCreateOrConnectWithoutWatchListInput
    upsert?: ProductUpsertWithoutWatchListInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutWatchListInput, ProductUpdateWithoutWatchListInput>, ProductUncheckedUpdateWithoutWatchListInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UserProfileCreateWithoutUserInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatarUrl?: string | null
    timezone?: string
    language?: string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUncheckedCreateWithoutUserInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatarUrl?: string | null
    timezone?: string
    language?: string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileCreateOrConnectWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SearchHistoryCreateWithoutUserInput = {
    id?: string
    query: string
    resultCount?: number
    createdAt?: Date | string
  }

  export type SearchHistoryUncheckedCreateWithoutUserInput = {
    id?: string
    query: string
    resultCount?: number
    createdAt?: Date | string
  }

  export type SearchHistoryCreateOrConnectWithoutUserInput = {
    where: SearchHistoryWhereUniqueInput
    create: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput>
  }

  export type SearchHistoryCreateManyUserInputEnvelope = {
    data: SearchHistoryCreateManyUserInput | SearchHistoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AnalysisRequestCreateWithoutUserInput = {
    id?: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
    product: ProductCreateNestedOneWithoutAnalysisRequestsInput
  }

  export type AnalysisRequestUncheckedCreateWithoutUserInput = {
    id?: string
    productId: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type AnalysisRequestCreateOrConnectWithoutUserInput = {
    where: AnalysisRequestWhereUniqueInput
    create: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput>
  }

  export type AnalysisRequestCreateManyUserInputEnvelope = {
    data: AnalysisRequestCreateManyUserInput | AnalysisRequestCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WatchListCreateWithoutUserInput = {
    id?: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutWatchListInput
  }

  export type WatchListUncheckedCreateWithoutUserInput = {
    id?: string
    productId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatchListCreateOrConnectWithoutUserInput = {
    where: WatchListWhereUniqueInput
    create: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput>
  }

  export type WatchListCreateManyUserInputEnvelope = {
    data: WatchListCreateManyUserInput | WatchListCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserProfileUpsertWithoutUserInput = {
    update: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    notificationPreferences?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    refreshTokenHash?: StringFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    lastUsedAt?: DateTimeFilter<"UserSession"> | Date | string
  }

  export type SearchHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: SearchHistoryWhereUniqueInput
    update: XOR<SearchHistoryUpdateWithoutUserInput, SearchHistoryUncheckedUpdateWithoutUserInput>
    create: XOR<SearchHistoryCreateWithoutUserInput, SearchHistoryUncheckedCreateWithoutUserInput>
  }

  export type SearchHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: SearchHistoryWhereUniqueInput
    data: XOR<SearchHistoryUpdateWithoutUserInput, SearchHistoryUncheckedUpdateWithoutUserInput>
  }

  export type SearchHistoryUpdateManyWithWhereWithoutUserInput = {
    where: SearchHistoryScalarWhereInput
    data: XOR<SearchHistoryUpdateManyMutationInput, SearchHistoryUncheckedUpdateManyWithoutUserInput>
  }

  export type SearchHistoryScalarWhereInput = {
    AND?: SearchHistoryScalarWhereInput | SearchHistoryScalarWhereInput[]
    OR?: SearchHistoryScalarWhereInput[]
    NOT?: SearchHistoryScalarWhereInput | SearchHistoryScalarWhereInput[]
    id?: StringFilter<"SearchHistory"> | string
    userId?: StringFilter<"SearchHistory"> | string
    query?: StringFilter<"SearchHistory"> | string
    resultCount?: IntFilter<"SearchHistory"> | number
    createdAt?: DateTimeFilter<"SearchHistory"> | Date | string
  }

  export type AnalysisRequestUpsertWithWhereUniqueWithoutUserInput = {
    where: AnalysisRequestWhereUniqueInput
    update: XOR<AnalysisRequestUpdateWithoutUserInput, AnalysisRequestUncheckedUpdateWithoutUserInput>
    create: XOR<AnalysisRequestCreateWithoutUserInput, AnalysisRequestUncheckedCreateWithoutUserInput>
  }

  export type AnalysisRequestUpdateWithWhereUniqueWithoutUserInput = {
    where: AnalysisRequestWhereUniqueInput
    data: XOR<AnalysisRequestUpdateWithoutUserInput, AnalysisRequestUncheckedUpdateWithoutUserInput>
  }

  export type AnalysisRequestUpdateManyWithWhereWithoutUserInput = {
    where: AnalysisRequestScalarWhereInput
    data: XOR<AnalysisRequestUpdateManyMutationInput, AnalysisRequestUncheckedUpdateManyWithoutUserInput>
  }

  export type AnalysisRequestScalarWhereInput = {
    AND?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
    OR?: AnalysisRequestScalarWhereInput[]
    NOT?: AnalysisRequestScalarWhereInput | AnalysisRequestScalarWhereInput[]
    id?: StringFilter<"AnalysisRequest"> | string
    userId?: StringNullableFilter<"AnalysisRequest"> | string | null
    productId?: StringFilter<"AnalysisRequest"> | string
    taskId?: StringFilter<"AnalysisRequest"> | string
    status?: StringFilter<"AnalysisRequest"> | string
    progress?: IntFilter<"AnalysisRequest"> | number
    requestType?: StringFilter<"AnalysisRequest"> | string
    priority?: IntFilter<"AnalysisRequest"> | number
    createdAt?: DateTimeFilter<"AnalysisRequest"> | Date | string
    completedAt?: DateTimeNullableFilter<"AnalysisRequest"> | Date | string | null
  }

  export type WatchListUpsertWithWhereUniqueWithoutUserInput = {
    where: WatchListWhereUniqueInput
    update: XOR<WatchListUpdateWithoutUserInput, WatchListUncheckedUpdateWithoutUserInput>
    create: XOR<WatchListCreateWithoutUserInput, WatchListUncheckedCreateWithoutUserInput>
  }

  export type WatchListUpdateWithWhereUniqueWithoutUserInput = {
    where: WatchListWhereUniqueInput
    data: XOR<WatchListUpdateWithoutUserInput, WatchListUncheckedUpdateWithoutUserInput>
  }

  export type WatchListUpdateManyWithWhereWithoutUserInput = {
    where: WatchListScalarWhereInput
    data: XOR<WatchListUpdateManyMutationInput, WatchListUncheckedUpdateManyWithoutUserInput>
  }

  export type WatchListScalarWhereInput = {
    AND?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
    OR?: WatchListScalarWhereInput[]
    NOT?: WatchListScalarWhereInput | WatchListScalarWhereInput[]
    id?: StringFilter<"WatchList"> | string
    userId?: StringFilter<"WatchList"> | string
    productId?: StringFilter<"WatchList"> | string
    priceAlert?: BoolFilter<"WatchList"> | boolean
    targetPrice?: DecimalNullableFilter<"WatchList"> | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: DateTimeNullableFilter<"WatchList"> | Date | string | null
    analysisFrequency?: StringFilter<"WatchList"> | string
    isActive?: BoolFilter<"WatchList"> | boolean
    createdAt?: DateTimeFilter<"WatchList"> | Date | string
    updatedAt?: DateTimeFilter<"WatchList"> | Date | string
  }

  export type UserCreateWithoutProfileInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutUserInput
    watchList?: WatchListCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryUncheckedCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutUserInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
  }

  export type UserUpsertWithoutProfileInput = {
    update: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutUserNestedInput
    watchList?: WatchListUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUncheckedUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    searchHistory?: SearchHistoryCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutUserInput
    watchList?: WatchListCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    searchHistory?: SearchHistoryUncheckedCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutUserInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    searchHistory?: SearchHistoryUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutUserNestedInput
    watchList?: WatchListUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    searchHistory?: SearchHistoryUncheckedUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CategoryCreateWithoutChildrenInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: CategoryCreateNestedOneWithoutChildrenInput
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    parentId?: string | null
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutChildrenInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
  }

  export type CategoryCreateWithoutParentInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: CategoryCreateNestedManyWithoutParentInput
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutParentInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput>
  }

  export type CategoryCreateManyParentInputEnvelope = {
    data: CategoryCreateManyParentInput | CategoryCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type ProductCreateWithoutCategoryInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutProductInput
    watchList?: WatchListCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultUncheckedCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutProductInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductCreateManyCategoryInputEnvelope = {
    data: ProductCreateManyCategoryInput | ProductCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutChildrenInput = {
    update: XOR<CategoryUpdateWithoutChildrenInput, CategoryUncheckedUpdateWithoutChildrenInput>
    create: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutChildrenInput, CategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type CategoryUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CategoryUpdateOneWithoutChildrenNestedInput
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutParentInput, CategoryUncheckedUpdateWithoutParentInput>
    create: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutParentInput, CategoryUncheckedUpdateWithoutParentInput>
  }

  export type CategoryUpdateManyWithWhereWithoutParentInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutParentInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    parentId?: StringNullableFilter<"Category"> | string | null
    path?: StringFilter<"Category"> | string
    level?: IntFilter<"Category"> | number
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
  }

  export type ProductUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
  }

  export type ProductUpdateManyWithWhereWithoutCategoryInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    url?: StringFilter<"Product"> | string
    categoryId?: StringNullableFilter<"Product"> | string | null
    currentPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    averageRating?: FloatNullableFilter<"Product"> | number | null
    totalReviews?: IntFilter<"Product"> | number
    imageUrl?: StringNullableFilter<"Product"> | string | null
    isActive?: BoolFilter<"Product"> | boolean
    lastCrawledAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type CategoryCreateWithoutProductsInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: CategoryCreateNestedOneWithoutChildrenInput
    children?: CategoryCreateNestedManyWithoutParentInput
  }

  export type CategoryUncheckedCreateWithoutProductsInput = {
    id?: string
    name: string
    parentId?: string | null
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput
  }

  export type CategoryCreateOrConnectWithoutProductsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
  }

  export type AnalysisResultCreateWithoutProductInput = {
    id?: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    keywordEntries?: KeywordCreateNestedManyWithoutAnalysisResultInput
  }

  export type AnalysisResultUncheckedCreateWithoutProductInput = {
    id?: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    keywordEntries?: KeywordUncheckedCreateNestedManyWithoutAnalysisResultInput
  }

  export type AnalysisResultCreateOrConnectWithoutProductInput = {
    where: AnalysisResultWhereUniqueInput
    create: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput>
  }

  export type AnalysisResultCreateManyProductInputEnvelope = {
    data: AnalysisResultCreateManyProductInput | AnalysisResultCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type AnalysisRequestCreateWithoutProductInput = {
    id?: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
    user?: UserCreateNestedOneWithoutAnalysisRequestsInput
  }

  export type AnalysisRequestUncheckedCreateWithoutProductInput = {
    id?: string
    userId?: string | null
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type AnalysisRequestCreateOrConnectWithoutProductInput = {
    where: AnalysisRequestWhereUniqueInput
    create: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput>
  }

  export type AnalysisRequestCreateManyProductInputEnvelope = {
    data: AnalysisRequestCreateManyProductInput | AnalysisRequestCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type WatchListCreateWithoutProductInput = {
    id?: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWatchListInput
  }

  export type WatchListUncheckedCreateWithoutProductInput = {
    id?: string
    userId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatchListCreateOrConnectWithoutProductInput = {
    where: WatchListWhereUniqueInput
    create: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput>
  }

  export type WatchListCreateManyProductInputEnvelope = {
    data: WatchListCreateManyProductInput | WatchListCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type PriceHistoryCreateWithoutProductInput = {
    id?: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type PriceHistoryUncheckedCreateWithoutProductInput = {
    id?: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type PriceHistoryCreateOrConnectWithoutProductInput = {
    where: PriceHistoryWhereUniqueInput
    create: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput>
  }

  export type PriceHistoryCreateManyProductInputEnvelope = {
    data: PriceHistoryCreateManyProductInput | PriceHistoryCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutProductsInput = {
    update: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutProductsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type CategoryUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CategoryUpdateOneWithoutChildrenNestedInput
    children?: CategoryUpdateManyWithoutParentNestedInput
  }

  export type CategoryUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput
  }

  export type AnalysisResultUpsertWithWhereUniqueWithoutProductInput = {
    where: AnalysisResultWhereUniqueInput
    update: XOR<AnalysisResultUpdateWithoutProductInput, AnalysisResultUncheckedUpdateWithoutProductInput>
    create: XOR<AnalysisResultCreateWithoutProductInput, AnalysisResultUncheckedCreateWithoutProductInput>
  }

  export type AnalysisResultUpdateWithWhereUniqueWithoutProductInput = {
    where: AnalysisResultWhereUniqueInput
    data: XOR<AnalysisResultUpdateWithoutProductInput, AnalysisResultUncheckedUpdateWithoutProductInput>
  }

  export type AnalysisResultUpdateManyWithWhereWithoutProductInput = {
    where: AnalysisResultScalarWhereInput
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyWithoutProductInput>
  }

  export type AnalysisResultScalarWhereInput = {
    AND?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
    OR?: AnalysisResultScalarWhereInput[]
    NOT?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
    id?: StringFilter<"AnalysisResult"> | string
    productId?: StringFilter<"AnalysisResult"> | string
    taskId?: StringFilter<"AnalysisResult"> | string
    status?: StringFilter<"AnalysisResult"> | string
    sentimentPositive?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNegative?: FloatNullableFilter<"AnalysisResult"> | number | null
    sentimentNeutral?: FloatNullableFilter<"AnalysisResult"> | number | null
    summary?: StringNullableFilter<"AnalysisResult"> | string | null
    keywords?: JsonNullableFilter<"AnalysisResult">
    totalReviews?: IntFilter<"AnalysisResult"> | number
    averageRating?: FloatNullableFilter<"AnalysisResult"> | number | null
    ratingDistribution?: JsonNullableFilter<"AnalysisResult">
    errorMessage?: StringNullableFilter<"AnalysisResult"> | string | null
    processingTime?: IntNullableFilter<"AnalysisResult"> | number | null
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    updatedAt?: DateTimeFilter<"AnalysisResult"> | Date | string
  }

  export type AnalysisRequestUpsertWithWhereUniqueWithoutProductInput = {
    where: AnalysisRequestWhereUniqueInput
    update: XOR<AnalysisRequestUpdateWithoutProductInput, AnalysisRequestUncheckedUpdateWithoutProductInput>
    create: XOR<AnalysisRequestCreateWithoutProductInput, AnalysisRequestUncheckedCreateWithoutProductInput>
  }

  export type AnalysisRequestUpdateWithWhereUniqueWithoutProductInput = {
    where: AnalysisRequestWhereUniqueInput
    data: XOR<AnalysisRequestUpdateWithoutProductInput, AnalysisRequestUncheckedUpdateWithoutProductInput>
  }

  export type AnalysisRequestUpdateManyWithWhereWithoutProductInput = {
    where: AnalysisRequestScalarWhereInput
    data: XOR<AnalysisRequestUpdateManyMutationInput, AnalysisRequestUncheckedUpdateManyWithoutProductInput>
  }

  export type WatchListUpsertWithWhereUniqueWithoutProductInput = {
    where: WatchListWhereUniqueInput
    update: XOR<WatchListUpdateWithoutProductInput, WatchListUncheckedUpdateWithoutProductInput>
    create: XOR<WatchListCreateWithoutProductInput, WatchListUncheckedCreateWithoutProductInput>
  }

  export type WatchListUpdateWithWhereUniqueWithoutProductInput = {
    where: WatchListWhereUniqueInput
    data: XOR<WatchListUpdateWithoutProductInput, WatchListUncheckedUpdateWithoutProductInput>
  }

  export type WatchListUpdateManyWithWhereWithoutProductInput = {
    where: WatchListScalarWhereInput
    data: XOR<WatchListUpdateManyMutationInput, WatchListUncheckedUpdateManyWithoutProductInput>
  }

  export type PriceHistoryUpsertWithWhereUniqueWithoutProductInput = {
    where: PriceHistoryWhereUniqueInput
    update: XOR<PriceHistoryUpdateWithoutProductInput, PriceHistoryUncheckedUpdateWithoutProductInput>
    create: XOR<PriceHistoryCreateWithoutProductInput, PriceHistoryUncheckedCreateWithoutProductInput>
  }

  export type PriceHistoryUpdateWithWhereUniqueWithoutProductInput = {
    where: PriceHistoryWhereUniqueInput
    data: XOR<PriceHistoryUpdateWithoutProductInput, PriceHistoryUncheckedUpdateWithoutProductInput>
  }

  export type PriceHistoryUpdateManyWithWhereWithoutProductInput = {
    where: PriceHistoryScalarWhereInput
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyWithoutProductInput>
  }

  export type PriceHistoryScalarWhereInput = {
    AND?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
    OR?: PriceHistoryScalarWhereInput[]
    NOT?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
    id?: StringFilter<"PriceHistory"> | string
    productId?: StringFilter<"PriceHistory"> | string
    price?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"PriceHistory"> | Date | string
  }

  export type ProductCreateWithoutPriceHistoryInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutProductsInput
    analysisResults?: AnalysisResultCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutProductInput
    watchList?: WatchListCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPriceHistoryInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultUncheckedCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutProductInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPriceHistoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPriceHistoryInput, ProductUncheckedCreateWithoutPriceHistoryInput>
  }

  export type ProductUpsertWithoutPriceHistoryInput = {
    update: XOR<ProductUpdateWithoutPriceHistoryInput, ProductUncheckedUpdateWithoutPriceHistoryInput>
    create: XOR<ProductCreateWithoutPriceHistoryInput, ProductUncheckedCreateWithoutPriceHistoryInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPriceHistoryInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPriceHistoryInput, ProductUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type ProductUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutProductsNestedInput
    analysisResults?: AnalysisResultUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutProductNestedInput
    watchList?: WatchListUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUncheckedUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutProductNestedInput
  }

  export type UserCreateWithoutAnalysisRequestsInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryCreateNestedManyWithoutUserInput
    watchList?: WatchListCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnalysisRequestsInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryUncheckedCreateNestedManyWithoutUserInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnalysisRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnalysisRequestsInput, UserUncheckedCreateWithoutAnalysisRequestsInput>
  }

  export type ProductCreateWithoutAnalysisRequestsInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutProductsInput
    analysisResults?: AnalysisResultCreateNestedManyWithoutProductInput
    watchList?: WatchListCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutAnalysisRequestsInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultUncheckedCreateNestedManyWithoutProductInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutAnalysisRequestsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutAnalysisRequestsInput, ProductUncheckedCreateWithoutAnalysisRequestsInput>
  }

  export type UserUpsertWithoutAnalysisRequestsInput = {
    update: XOR<UserUpdateWithoutAnalysisRequestsInput, UserUncheckedUpdateWithoutAnalysisRequestsInput>
    create: XOR<UserCreateWithoutAnalysisRequestsInput, UserUncheckedCreateWithoutAnalysisRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnalysisRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnalysisRequestsInput, UserUncheckedUpdateWithoutAnalysisRequestsInput>
  }

  export type UserUpdateWithoutAnalysisRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUpdateManyWithoutUserNestedInput
    watchList?: WatchListUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnalysisRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUncheckedUpdateManyWithoutUserNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProductUpsertWithoutAnalysisRequestsInput = {
    update: XOR<ProductUpdateWithoutAnalysisRequestsInput, ProductUncheckedUpdateWithoutAnalysisRequestsInput>
    create: XOR<ProductCreateWithoutAnalysisRequestsInput, ProductUncheckedCreateWithoutAnalysisRequestsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutAnalysisRequestsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutAnalysisRequestsInput, ProductUncheckedUpdateWithoutAnalysisRequestsInput>
  }

  export type ProductUpdateWithoutAnalysisRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutProductsNestedInput
    analysisResults?: AnalysisResultUpdateManyWithoutProductNestedInput
    watchList?: WatchListUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutAnalysisRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUncheckedUpdateManyWithoutProductNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutAnalysisResultsInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutProductsInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutProductInput
    watchList?: WatchListCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutAnalysisResultsInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutProductInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutAnalysisResultsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutAnalysisResultsInput, ProductUncheckedCreateWithoutAnalysisResultsInput>
  }

  export type KeywordCreateWithoutAnalysisResultInput = {
    id?: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
  }

  export type KeywordUncheckedCreateWithoutAnalysisResultInput = {
    id?: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
  }

  export type KeywordCreateOrConnectWithoutAnalysisResultInput = {
    where: KeywordWhereUniqueInput
    create: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput>
  }

  export type KeywordCreateManyAnalysisResultInputEnvelope = {
    data: KeywordCreateManyAnalysisResultInput | KeywordCreateManyAnalysisResultInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithoutAnalysisResultsInput = {
    update: XOR<ProductUpdateWithoutAnalysisResultsInput, ProductUncheckedUpdateWithoutAnalysisResultsInput>
    create: XOR<ProductCreateWithoutAnalysisResultsInput, ProductUncheckedCreateWithoutAnalysisResultsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutAnalysisResultsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutAnalysisResultsInput, ProductUncheckedUpdateWithoutAnalysisResultsInput>
  }

  export type ProductUpdateWithoutAnalysisResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutProductsNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutProductNestedInput
    watchList?: WatchListUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutAnalysisResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutProductNestedInput
  }

  export type KeywordUpsertWithWhereUniqueWithoutAnalysisResultInput = {
    where: KeywordWhereUniqueInput
    update: XOR<KeywordUpdateWithoutAnalysisResultInput, KeywordUncheckedUpdateWithoutAnalysisResultInput>
    create: XOR<KeywordCreateWithoutAnalysisResultInput, KeywordUncheckedCreateWithoutAnalysisResultInput>
  }

  export type KeywordUpdateWithWhereUniqueWithoutAnalysisResultInput = {
    where: KeywordWhereUniqueInput
    data: XOR<KeywordUpdateWithoutAnalysisResultInput, KeywordUncheckedUpdateWithoutAnalysisResultInput>
  }

  export type KeywordUpdateManyWithWhereWithoutAnalysisResultInput = {
    where: KeywordScalarWhereInput
    data: XOR<KeywordUpdateManyMutationInput, KeywordUncheckedUpdateManyWithoutAnalysisResultInput>
  }

  export type KeywordScalarWhereInput = {
    AND?: KeywordScalarWhereInput | KeywordScalarWhereInput[]
    OR?: KeywordScalarWhereInput[]
    NOT?: KeywordScalarWhereInput | KeywordScalarWhereInput[]
    id?: StringFilter<"Keyword"> | string
    analysisResultId?: StringFilter<"Keyword"> | string
    keyword?: StringFilter<"Keyword"> | string
    sentiment?: StringFilter<"Keyword"> | string
    frequency?: IntFilter<"Keyword"> | number
    confidence?: FloatFilter<"Keyword"> | number
    createdAt?: DateTimeFilter<"Keyword"> | Date | string
  }

  export type AnalysisResultCreateWithoutKeywordEntriesInput = {
    id?: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutAnalysisResultsInput
  }

  export type AnalysisResultUncheckedCreateWithoutKeywordEntriesInput = {
    id?: string
    productId: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalysisResultCreateOrConnectWithoutKeywordEntriesInput = {
    where: AnalysisResultWhereUniqueInput
    create: XOR<AnalysisResultCreateWithoutKeywordEntriesInput, AnalysisResultUncheckedCreateWithoutKeywordEntriesInput>
  }

  export type AnalysisResultUpsertWithoutKeywordEntriesInput = {
    update: XOR<AnalysisResultUpdateWithoutKeywordEntriesInput, AnalysisResultUncheckedUpdateWithoutKeywordEntriesInput>
    create: XOR<AnalysisResultCreateWithoutKeywordEntriesInput, AnalysisResultUncheckedCreateWithoutKeywordEntriesInput>
    where?: AnalysisResultWhereInput
  }

  export type AnalysisResultUpdateToOneWithWhereWithoutKeywordEntriesInput = {
    where?: AnalysisResultWhereInput
    data: XOR<AnalysisResultUpdateWithoutKeywordEntriesInput, AnalysisResultUncheckedUpdateWithoutKeywordEntriesInput>
  }

  export type AnalysisResultUpdateWithoutKeywordEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutAnalysisResultsNestedInput
  }

  export type AnalysisResultUncheckedUpdateWithoutKeywordEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSearchHistoryInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutUserInput
    watchList?: WatchListCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSearchHistoryInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutUserInput
    watchList?: WatchListUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSearchHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSearchHistoryInput, UserUncheckedCreateWithoutSearchHistoryInput>
  }

  export type UserUpsertWithoutSearchHistoryInput = {
    update: XOR<UserUpdateWithoutSearchHistoryInput, UserUncheckedUpdateWithoutSearchHistoryInput>
    create: XOR<UserCreateWithoutSearchHistoryInput, UserUncheckedCreateWithoutSearchHistoryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSearchHistoryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSearchHistoryInput, UserUncheckedUpdateWithoutSearchHistoryInput>
  }

  export type UserUpdateWithoutSearchHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutUserNestedInput
    watchList?: WatchListUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSearchHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutWatchListInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWatchListInput = {
    id?: string
    email: string
    password: string
    role?: string
    isActive?: boolean
    emailVerified?: boolean
    lastLoginAt?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    searchHistory?: SearchHistoryUncheckedCreateNestedManyWithoutUserInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWatchListInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWatchListInput, UserUncheckedCreateWithoutWatchListInput>
  }

  export type ProductCreateWithoutWatchListInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutProductsInput
    analysisResults?: AnalysisResultCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutWatchListInput = {
    id?: string
    name: string
    url: string
    categoryId?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    analysisResults?: AnalysisResultUncheckedCreateNestedManyWithoutProductInput
    analysisRequests?: AnalysisRequestUncheckedCreateNestedManyWithoutProductInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutWatchListInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutWatchListInput, ProductUncheckedCreateWithoutWatchListInput>
  }

  export type UserUpsertWithoutWatchListInput = {
    update: XOR<UserUpdateWithoutWatchListInput, UserUncheckedUpdateWithoutWatchListInput>
    create: XOR<UserCreateWithoutWatchListInput, UserUncheckedCreateWithoutWatchListInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWatchListInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWatchListInput, UserUncheckedUpdateWithoutWatchListInput>
  }

  export type UserUpdateWithoutWatchListInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWatchListInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    searchHistory?: SearchHistoryUncheckedUpdateManyWithoutUserNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProductUpsertWithoutWatchListInput = {
    update: XOR<ProductUpdateWithoutWatchListInput, ProductUncheckedUpdateWithoutWatchListInput>
    create: XOR<ProductCreateWithoutWatchListInput, ProductUncheckedCreateWithoutWatchListInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutWatchListInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutWatchListInput, ProductUncheckedUpdateWithoutWatchListInput>
  }

  export type ProductUpdateWithoutWatchListInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutProductsNestedInput
    analysisResults?: AnalysisResultUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutWatchListInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUncheckedUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutProductNestedInput
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    refreshTokenHash: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type SearchHistoryCreateManyUserInput = {
    id?: string
    query: string
    resultCount?: number
    createdAt?: Date | string
  }

  export type AnalysisRequestCreateManyUserInput = {
    id?: string
    productId: string
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type WatchListCreateManyUserInput = {
    id?: string
    productId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisRequestUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product?: ProductUpdateOneRequiredWithoutAnalysisRequestsNestedInput
  }

  export type AnalysisRequestUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisRequestUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WatchListUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutWatchListNestedInput
  }

  export type WatchListUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchListUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateManyParentInput = {
    id?: string
    name: string
    path: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateManyCategoryInput = {
    id?: string
    name: string
    url: string
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    averageRating?: number | null
    totalReviews?: number
    imageUrl?: string | null
    isActive?: boolean
    lastCrawledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUpdateManyWithoutParentNestedInput
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUpdateManyWithoutProductNestedInput
    watchList?: WatchListUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisResults?: AnalysisResultUncheckedUpdateManyWithoutProductNestedInput
    analysisRequests?: AnalysisRequestUncheckedUpdateManyWithoutProductNestedInput
    watchList?: WatchListUncheckedUpdateManyWithoutProductNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    totalReviews?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCrawledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisResultCreateManyProductInput = {
    id?: string
    taskId: string
    status?: string
    sentimentPositive?: number | null
    sentimentNegative?: number | null
    sentimentNeutral?: number | null
    summary?: string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: number
    averageRating?: number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    processingTime?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalysisRequestCreateManyProductInput = {
    id?: string
    userId?: string | null
    taskId: string
    status?: string
    progress?: number
    requestType: string
    priority?: number
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type WatchListCreateManyProductInput = {
    id?: string
    userId: string
    priceAlert?: boolean
    targetPrice?: Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: Date | string | null
    analysisFrequency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PriceHistoryCreateManyProductInput = {
    id?: string
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type AnalysisResultUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keywordEntries?: KeywordUpdateManyWithoutAnalysisResultNestedInput
  }

  export type AnalysisResultUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keywordEntries?: KeywordUncheckedUpdateManyWithoutAnalysisResultNestedInput
  }

  export type AnalysisResultUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    sentimentPositive?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNegative?: NullableFloatFieldUpdateOperationsInput | number | null
    sentimentNeutral?: NullableFloatFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableJsonNullValueInput | InputJsonValue
    totalReviews?: IntFieldUpdateOperationsInput | number
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingDistribution?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisRequestUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutAnalysisRequestsNestedInput
  }

  export type AnalysisRequestUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisRequestUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    taskId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    requestType?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WatchListUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWatchListNestedInput
  }

  export type WatchListUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchListUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    priceAlert?: BoolFieldUpdateOperationsInput | boolean
    targetPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lastNotifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analysisFrequency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordCreateManyAnalysisResultInput = {
    id?: string
    keyword: string
    sentiment: string
    frequency: number
    confidence: number
    createdAt?: Date | string
  }

  export type KeywordUpdateWithoutAnalysisResultInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordUncheckedUpdateWithoutAnalysisResultInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordUncheckedUpdateManyWithoutAnalysisResultInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}