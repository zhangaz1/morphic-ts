import { identity } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import { cacheUnaryFunction, Compact } from '@morphic-ts/common/lib/core'
import { Includes } from '@morphic-ts/common/lib/utils'
import { pipe } from 'fp-ts/lib/pipeable'

import * as U from './usage'

import { BASTJInterpreterURI } from './interpreters-BASTJ'
import { ProgramUnionURI } from './program'

import { modelFastCheckInterpreter } from '@morphic-ts/fastcheck-interpreters/lib/interpreters'
import {
  modelIoTsStrictInterpreter,
  modelIoTsNonStrictInterpreter
} from '@morphic-ts/io-ts-interpreters/lib/interpreters'
import { modelJsonSchemaInterpreter } from '@morphic-ts/json-schema-interpreters/lib'
import { resolveSchema } from '@morphic-ts/json-schema-interpreters/lib/utils'
import { DepsErrorMsg } from './usage/summoner'

/** Type level override to keep Morph type name short */
/**
 *  @since 0.0.1
 */
export interface M<R, L, A> extends U.Materialized<R, L, A, ProgramUnionURI, BASTJInterpreterURI> {}
/**
 *  @since 0.0.1
 */
export interface UM<R, A> extends M<R, unknown, A> {}

/**
 *  @since 0.0.1
 */
export const AsOpaque = <R, E, A>(x: M<R, E, A>): M<R, E, A> => x
/**
 *  @since 0.0.1
 */
export const AsUOpaque = <R, A>(x: UM<R, A>): UM<R, A> => x

/**
 *  @since 0.0.1
 */
export interface Summoner<R> extends U.Summoners<ProgramUnionURI, BASTJInterpreterURI, R> {
  <L, A, R2 extends R>(F: U.ProgramType<R2, L, A>[ProgramUnionURI]): Includes<
    R,
    R2,
    M<R, L, A>,
    Compact<DepsErrorMsg<R, R2>>
  >
}

export const summonFor = <R>(env: NonNullable<R>) =>
  U.makeSummoner<Summoner<R>>(cacheUnaryFunction, program => ({
    build: identity,
    arb: program(modelFastCheckInterpreter)(env).arb,
    strictType: program(modelIoTsStrictInterpreter)(env).type,
    type: program(modelIoTsNonStrictInterpreter)(env).type,
    jsonSchema: pipe(program(modelJsonSchemaInterpreter)(env).schema({}), E.chain(resolveSchema))
  }))
