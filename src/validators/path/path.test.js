const appRootPath = require('app-root-path').path

const pathValidator = require('./path')

const options = {
  validateString: false,
  validateExists: false,
  validateAppPath: false,
}

describe('Test path validator:', () => {
  it('should return error of string', () => {
    try {
      pathValidator('asdfx *g/sd_f ds', { ...options, validateString: true })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('should return error of exists', () => {
    try {
      pathValidator('asdfx *g/sd_f ds', { ...options, validateExists: true })
    } catch (e) {
      console.log(e)
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('should return error of app root path', () => {
    try {
      pathValidator(appRootPath, { ...options, validateAppPath: true })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
