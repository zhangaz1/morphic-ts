import * as chai from 'chai'

import { ProgramInterpreter, Materialized } from '../../../src/usage/materializer'
import { makeSummoner, Summoners } from '../../../src/usage/summoner'
import { cacheUnaryFunction } from '../../../src/common/core'

import { ProgramNoUnionURI } from '../../../src/batteries/program-no-union'
import { modelEqInterpreter, EqURI } from '../../../src/eq-interpreters/interpreters'
import { Eq } from 'fp-ts/lib/Eq'
import { interpretable } from '../../../src/usage/programs-infer'
import { ProgramType } from '../../../src/usage/ProgramType'

export const EqInterpreterURI = Symbol()
export type EqInterpreterURI = typeof EqInterpreterURI

interface EqInterpreter<A> {
  eq: Eq<A>
}

declare module '../../../src/usage/InterpreterResult' {
  interface InterpreterResult<E, A> {
    [EqInterpreterURI]: EqInterpreter<A>
  }
}
declare module '../../../src/usage/ProgramType' {
  interface ProgramNoUnionInterpreters {
    [EqInterpreterURI]: Summoner
  }
}

const eqInterp: ProgramInterpreter<ProgramNoUnionURI, EqInterpreterURI> = _program => {
  const program = interpretable(_program)
  return {
    eq: program(modelEqInterpreter).eq
  }
}

/** Type level override to keep Morph type name short */
export interface M<L, A> extends Materialized<L, A, ProgramNoUnionURI, EqInterpreterURI> {}
export interface UM<A> extends Materialized<unknown, A, ProgramNoUnionURI, EqInterpreterURI> {}

export interface Morph {
  <L, A>(F: ProgramType<L, A>[ProgramNoUnionURI]): M<L, A>
}

export interface Summoner extends Summoners<ProgramNoUnionURI, EqInterpreterURI>, Morph {}

const summonAs = makeSummoner(cacheUnaryFunction, eqInterp)

describe('Eq', () => {
  it('unknown', () => {
    const { eq } = summonAs(F => F.unknown())
    chai.assert.strictEqual(eq.equals('a', 'a'), true)
    chai.assert.strictEqual(eq.equals('a', 'b'), false)
    const arr1 = ['a', 'b']
    const arr2 = ['a', 'b']
    chai.assert.strictEqual(eq.equals(arr1, arr2), false)
    chai.assert.strictEqual(eq.equals(arr1, arr1), true)
  })
  it('returns false when comparing incomplete values', () => {
    const Foo = eqInterp(F =>
      F.interface(
        {
          date: F.date(),
          a: F.string({ [EqURI]: undefined })
        },
        'Foo'
      )
    )

    const { eq } = Foo

    const date = new Date(12345)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date } as any), false)
  })

  it('eq', () => {
    const Foo = summonAs(F =>
      F.interface(
        {
          date: F.date(),
          a: F.string()
        },
        'Foo'
      )
    )

    const { eq } = Foo

    const date = new Date(12345)
    const date2 = new Date(12346)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date, a: '' }), true)
    chai.assert.strictEqual(eq.equals({ date, a: '' }, { date: date2, a: '' }), false)
  })

  it('eq', () => {
    const Foo = summonAs(F =>
      F.interface(
        {
          dates: F.array(
            F.interface(
              {
                date: F.date()
              },
              'HasDate'
            )
          ),
          a: F.string()
        },
        'Foo'
      )
    )

    const { eq } = Foo

    const date = new Date(12345)
    const date2 = new Date(12346)
    chai.assert.strictEqual(
      eq.equals({ dates: [{ date }, { date }], a: '' }, { dates: [{ date }, { date }], a: '' }),
      true
    )

    chai.assert.strictEqual(
      eq.equals({ dates: [{ date: date2 }, { date }], a: '' }, { dates: [{ date }, { date: date2 }], a: '' }),
      false
    )
  })

  it('partial', () => {
    interface Foo {
      type: 'foo'
      a: string
      b: number
    }
    const Foo = summonAs(F =>
      F.partial(
        {
          type: F.stringLiteral('foo'),
          a: F.string(),
          b: F.number()
        },
        'Foo'
      )
    )

    const { eq } = Foo
    chai.assert.deepStrictEqual(eq.equals({}, {}), true)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { type: 'foo' }), true)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { type: 'foo', a: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo', a: 'foo' }, { type: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, { a: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({}, { type: 'foo' }), false)
    chai.assert.deepStrictEqual(eq.equals({ type: 'foo' }, {}), false)
  })

  it('taggedUnion', () => {
    interface Foo {
      type: 'foo'
      a: string
      b: number
    }
    const Foo = summonAs<unknown, Foo>(F =>
      F.interface(
        {
          type: F.stringLiteral('foo'),
          a: F.string(),
          b: F.number()
        },
        'Foo'
      )
    )

    interface Bar {
      type: 'bar'
      c: string
      d: number
    }
    const Bar = summonAs<unknown, Bar>(F =>
      F.interface(
        {
          type: F.stringLiteral('bar'),
          c: F.string(),
          d: F.number()
        },
        'Bar'
      )
    )

    const FooBar = summonAs(F =>
      F.taggedUnion(
        'type',
        {
          foo: Foo(F),
          bar: Bar(F)
        },
        'FooBar'
      )
    )

    const eq = FooBar.eq

    const fooA: Foo | Bar = { type: 'foo', a: 'a', b: 12 }
    const fooB: Foo | Bar = { type: 'foo', a: 'b', b: 12 }
    const fooC: Foo | Bar = { type: 'foo', a: 'a', b: 12 }

    const barA: Foo | Bar = { type: 'bar', c: 'a', d: 12 }
    const barB: Foo | Bar = { type: 'bar', c: 'b', d: 12 }

    chai.assert.deepStrictEqual(eq.equals(fooA, fooA), true)
    chai.assert.deepStrictEqual(eq.equals(fooA, fooC), true)
    chai.assert.deepStrictEqual(eq.equals(fooA, fooB), false)
    chai.assert.deepStrictEqual(eq.equals(fooA, barA), false)
    chai.assert.deepStrictEqual(eq.equals(barA, barB), false)
    chai.assert.deepStrictEqual(eq.equals(barB, barB), true)
  })
})
