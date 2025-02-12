import { describe, expectTypeOf, it } from 'vitest'
import { createQueries, queryOptions } from '..'
import type { CreateQueryResult } from '..'

describe('createQueries', () => {
  it('should return correct data for dynamic queries with mixed result types', () => {
    const Queries1 = {
      get: () =>
        queryOptions({
          queryKey: ['key1'],
          queryFn: () => Promise.resolve(1),
        }),
    }
    const Queries2 = {
      get: () =>
        queryOptions({
          queryKey: ['key2'],
          queryFn: () => Promise.resolve(true),
        }),
    }

    const queries1List = [1, 2, 3].map(() => ({ ...Queries1.get() }))
    const result = createQueries(() => ({
      queries: [...queries1List, { ...Queries2.get() }],
    }))

    expectTypeOf(result).toEqualTypeOf<
      [
        ...Array<CreateQueryResult<number, Error>>,
        CreateQueryResult<boolean, Error>,
      ]
    >()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!result[0]) {
      throw new Error('Type check failure')
    }
    expectTypeOf(result[0].data).toEqualTypeOf<number | boolean | undefined>()
  })
})
