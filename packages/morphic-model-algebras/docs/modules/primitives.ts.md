---
title: primitives.ts
nav_order: 5
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [ModelAlgebraPrimitive (interface)](#modelalgebraprimitive-interface)
- [ModelAlgebraPrimitive1 (interface)](#modelalgebraprimitive1-interface)
- [ModelAlgebraPrimitive2 (interface)](#modelalgebraprimitive2-interface)
- [Keys (type alias)](#keys-type-alias)
- [PrimitiveURI (type alias)](#primitiveuri-type-alias)
- [PrimitiveURI (constant)](#primitiveuri-constant)

---

# ModelAlgebraPrimitive (interface)

**Signature**

```ts
export interface ModelAlgebraPrimitive<F, Env> {
  _F: F
  nullable: {
    <L, A>(T: HKT2<F, Env, L, A>, config?: ConfigsForType<Env, L | null, Option<A>>): HKT2<F, Env, null | L, Option<A>>
  }
  boolean: {
    (config?: ConfigsForType<Env, boolean, boolean>): HKT2<F, Env, boolean, boolean>
  }
  number: {
    (config?: ConfigsForType<Env, number, number>): HKT2<F, Env, number, number>
  }
  bigint: {
    (config?: ConfigsForType<Env, string, bigint>): HKT2<F, Env, string, bigint>
  }
  string: {
    (config?: ConfigsForType<Env, string, string>): HKT2<F, Env, string, string>
  }
  stringLiteral: {
    <T extends string>(value: T, config?: ConfigsForType<Env, string, T>): HKT2<F, Env, string, typeof value>
  }
  keysOf: {
    <K extends Keys>(keys: K, config?: ConfigsForType<Env, string, keyof K>): HKT2<F, Env, string, keyof typeof keys>
  }
  array: {
    <L, A>(a: HKT2<F, Env, L, A>, config?: ConfigsForType<Env, Array<L>, Array<A>>): HKT2<F, Env, Array<L>, Array<A>>
  }
  nonEmptyArray: {
    <L, A>(a: HKT2<F, Env, L, A>, config?: ConfigsForType<Env, L[], NonEmptyArray<A>>): HKT2<
      F,
      Env,
      L[],
      NonEmptyArray<A>
    >
  }
  date: {
    (config?: ConfigsForType<Env, string, Date>): HKT2<F, Env, string, Date>
  }
  uuid: {
    (config?: ConfigsForType<Env, string, UUID>): HKT2<F, Env, string, UUID>
  }
  either: {
    <EE, EA, AE, AA>(
      e: HKT2<F, Env, EE, EA>,
      a: HKT2<F, Env, AE, AA>,
      config?: ConfigsForType<Env, Either<EE, AE>, Either<EA, AA>>
    ): HKT2<F, Env, Either<EE, AE>, Either<EA, AA>>
  }
  option: {
    <E, A>(a: HKT2<F, Env, E, A>, config?: ConfigsForType<Env, Option<E>, Option<A>>): HKT2<
      F,
      Env,
      Option<E>,
      Option<A>
    >
  }
}
```

Added in v0.0.1

# ModelAlgebraPrimitive1 (interface)

**Signature**

```ts
export interface ModelAlgebraPrimitive1<F extends URIS, Env extends AnyEnv> {
  _F: F
  nullable: <A>(T: Kind<F, Env, A>, config?: ConfigsForType<Env, null | A, Option<A>>) => Kind<F, Env, Option<A>>
  boolean(config?: ConfigsForType<Env, boolean, boolean>): Kind<F, Env, boolean>
  number(config?: ConfigsForType<Env, number, number>): Kind<F, Env, number>
  bigint(config?: ConfigsForType<Env, string, bigint>): Kind<F, Env, bigint>
  string(config?: ConfigsForType<Env, string, string>): Kind<F, Env, string>
  stringLiteral: <T extends string>(value: T, config?: ConfigsForType<Env, string, T>) => Kind<F, Env, typeof value>
  keysOf: <K extends Keys>(keys: K, config?: ConfigsForType<Env, string, keyof K>) => Kind<F, Env, keyof typeof keys>
  array: <A>(a: Kind<F, Env, A>, config?: ConfigsForType<Env, unknown[], A[]>) => Kind<F, Env, Array<A>>
  nonEmptyArray: <A>(
    a: Kind<F, Env, A>,
    config?: ConfigsForType<Env, unknown[], NonEmptyArray<A>>
  ) => Kind<F, Env, NonEmptyArray<A>>
  date(config?: ConfigsForType<Env, string, Date>): Kind<F, Env, Date>
  uuid(config?: ConfigsForType<Env, string, UUID>): Kind<F, Env, UUID>
  either: <EA, AA>(
    e: Kind<F, Env, EA>,
    a: Kind<F, Env, AA>,
    config?: ConfigsForType<Env, unknown, Either<EA, AA>>
  ) => Kind<F, Env, Either<EA, AA>>
  option: {
    <A>(a: Kind<F, Env, A>, config?: ConfigsForType<Env, unknown, Option<A>>): Kind<F, Env, Option<A>>
  }
}
```

Added in v0.0.1

# ModelAlgebraPrimitive2 (interface)

**Signature**

```ts
export interface ModelAlgebraPrimitive2<F extends URIS2, Env extends AnyEnv> {
  _F: F
  nullable: <L, A>(
    T: Kind2<F, Env, L, A>,
    config?: ConfigsForType<Env, null | L, Option<A>>
  ) => Kind2<F, Env, null | L, Option<A>>
  boolean(config?: ConfigsForType<Env, boolean, boolean>): Kind2<F, Env, boolean, boolean>
  number(config?: ConfigsForType<Env, number, number>): Kind2<F, Env, number, number>
  bigint(config?: ConfigsForType<Env, string, bigint>): Kind2<F, Env, string, bigint>
  string(config?: ConfigsForType<Env, string, string>): Kind2<F, Env, string, string>
  stringLiteral: <T extends string>(
    value: T,
    config?: ConfigsForType<Env, string, T>
  ) => Kind2<F, Env, string, typeof value>
  keysOf: <K extends Keys>(
    keys: K,
    config?: ConfigsForType<Env, string, keyof K>
  ) => Kind2<F, Env, string, keyof typeof keys>
  array: <L, A>(
    a: Kind2<F, Env, L, A>,
    config?: ConfigsForType<Env, Array<L>, Array<A>>
  ) => Kind2<F, Env, Array<L>, Array<A>>
  nonEmptyArray: <L, A>(
    a: Kind2<F, Env, L, A>,
    config?: ConfigsForType<Env, L[], NonEmptyArray<A>>
  ) => Kind2<F, Env, L[], NonEmptyArray<A>>
  date(config?: ConfigsForType<Env, string, Date>): Kind2<F, Env, string, Date>
  uuid(config?: ConfigsForType<Env, string, UUID>): Kind2<F, Env, string, UUID>
  either: <EE, EA, AE, AA>(
    e: Kind2<F, Env, EE, EA>,
    a: Kind2<F, Env, AE, AA>,
    config?: ConfigsForType<Env, Either<EE, AE>, Either<EA, AA>>
  ) => Kind2<F, Env, Either<EE, AE>, Either<EA, AA>>
  option: {
    <E, A>(a: Kind2<F, Env, E, A>, config?: ConfigsForType<Env, Option<E>, Option<A>>): Kind2<
      F,
      Env,
      Option<E>,
      Option<A>
    >
  }
}
```

Added in v0.0.1

# Keys (type alias)

**Signature**

```ts
export type Keys = Record<string, null>
```

Added in v0.0.1

# PrimitiveURI (type alias)

**Signature**

```ts
export type PrimitiveURI = typeof PrimitiveURI
```

Added in v0.0.1

# PrimitiveURI (constant)

**Signature**

```ts
export const PrimitiveURI: "PrimitiveURI" = ...
```

Added in v0.0.1
