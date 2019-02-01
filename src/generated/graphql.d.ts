export type Maybe<T> = T | null;

export enum UserRoleType {
  Admin = "admin",
  User = "user",
  Ghost = "ghost"
}

export type Error = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  me?: Maybe<User>;

  user?: Maybe<User>;

  users?: Maybe<User[]>;
}

export interface User {
  userId: string;

  email: string;

  password: string;

  isVerified: boolean;

  hasRequestedPasswordReset: boolean;

  role: UserRoleType[];

  isLoggedIn: boolean;
}

export interface Mutation {
  /** Registration Resolvers */
  register: Error;

  verify: Error;
  /** Login Resolvers */
  loginWithCredentials: Error;

  loginWithToken: Error;
  /** Reset Password Resolvers */
  resetPassword: Error;

  updatePassword: Error;
}

// ====================================================
// Arguments
// ====================================================

export interface UserQueryArgs {
  userId: string;
}
export interface RegisterMutationArgs {
  email: string;

  password: string;
}
export interface VerifyMutationArgs {
  token: string;
}
export interface LoginWithCredentialsMutationArgs {
  email: string;

  password: string;
}
export interface LoginWithTokenMutationArgs {
  token: string;
}
export interface ResetPasswordMutationArgs {
  email: string;
}
export interface UpdatePasswordMutationArgs {
  token: string;

  password: string;
}

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

import { IGraphQLContext } from "../context";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    me?: MeResolver<Maybe<User>, TypeParent, Context>;

    user?: UserResolver<Maybe<User>, TypeParent, Context>;

    users?: UsersResolver<Maybe<User[]>, TypeParent, Context>;
  }

  export type MeResolver<
    R = Maybe<User>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UserResolver<
    R = Maybe<User>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, UserArgs>;
  export interface UserArgs {
    userId: string;
  }

  export type UsersResolver<
    R = Maybe<User[]>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = User> {
    userId?: UserIdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;

    password?: PasswordResolver<string, TypeParent, Context>;

    isVerified?: IsVerifiedResolver<boolean, TypeParent, Context>;

    hasRequestedPasswordReset?: HasRequestedPasswordResetResolver<
      boolean,
      TypeParent,
      Context
    >;

    role?: RoleResolver<UserRoleType[], TypeParent, Context>;

    isLoggedIn?: IsLoggedInResolver<boolean, TypeParent, Context>;
  }

  export type UserIdResolver<
    R = string,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<
    R = string,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PasswordResolver<
    R = string,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type IsVerifiedResolver<
    R = boolean,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HasRequestedPasswordResetResolver<
    R = boolean,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type RoleResolver<
    R = UserRoleType[],
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type IsLoggedInResolver<
    R = boolean,
    Parent = User,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    /** Registration Resolvers */
    register?: RegisterResolver<Error, TypeParent, Context>;

    verify?: VerifyResolver<Error, TypeParent, Context>;
    /** Login Resolvers */
    loginWithCredentials?: LoginWithCredentialsResolver<
      Error,
      TypeParent,
      Context
    >;

    loginWithToken?: LoginWithTokenResolver<Error, TypeParent, Context>;
    /** Reset Password Resolvers */
    resetPassword?: ResetPasswordResolver<Error, TypeParent, Context>;

    updatePassword?: UpdatePasswordResolver<Error, TypeParent, Context>;
  }

  export type RegisterResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, RegisterArgs>;
  export interface RegisterArgs {
    email: string;

    password: string;
  }

  export type VerifyResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, VerifyArgs>;
  export interface VerifyArgs {
    token: string;
  }

  export type LoginWithCredentialsResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, LoginWithCredentialsArgs>;
  export interface LoginWithCredentialsArgs {
    email: string;

    password: string;
  }

  export type LoginWithTokenResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, LoginWithTokenArgs>;
  export interface LoginWithTokenArgs {
    token: string;
  }

  export type ResetPasswordResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, ResetPasswordArgs>;
  export interface ResetPasswordArgs {
    email: string;
  }

  export type UpdatePasswordResolver<
    R = Error,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, UpdatePasswordArgs>;
  export interface UpdatePasswordArgs {
    token: string;

    password: string;
  }
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  IGraphQLContext
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  IGraphQLContext
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  IGraphQLContext
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface ErrorScalarConfig extends GraphQLScalarTypeConfig<Error, any> {
  name: "Error";
}

export interface IResolvers {
  Query?: QueryResolvers.Resolvers;
  User?: UserResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  Error?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
