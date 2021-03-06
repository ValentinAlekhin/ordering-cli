const ShortID = require('./ShortId')

describe('Test ShortID:', () => {
  const idsCount = 10000
  let shortID

  beforeEach(() => {
    shortID = new ShortID()
    for (let i = 0; i < idsCount; i++) {
      shortID.createId()
    }
  })

  it('should create new id', () => {
    const newId = shortID.createId()

    expect(newId).toBeDefined()
    expect(typeof newId).toBe('string')
  })

  it(`should contains ${idsCount} ids`, () => {
    const ids = shortID.ids

    expect(ids).toBeDefined()
    expect(ids.length).toBe(idsCount)
  })

  it('adding existing id should return error', () => {
    const newId = shortID.ids[0]

    try {
      shortID.addIds([newId])
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('should contain new id', () => {
    const newId = `sdkfvjosfv awdifuhba asodhf2342 34`

    shortID.addIds([newId])

    expect(shortID.ids.includes(newId)).toBeTruthy()
  })

  it('ids should not be repeated', () => {
    let areAllItemsIsDifferent = true

    shortID.ids.forEach((id, i) => {
      if (!areAllItemsIsDifferent) return

      shortID.ids.forEach((id2, i2) => {
        if (i === i2) return
        areAllItemsIsDifferent = id !== id2
      })
    })

    expect(areAllItemsIsDifferent).toBeTruthy()
  })
})
