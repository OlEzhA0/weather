const chai = require('chai')

const equal = (value, expected = true) => chai.expect(value).to.equal(expected)
const toBeNot = (value, expected) => chai.expect(value).to.be.not[expected]
const haveOwnProperty = (object, property) =>
  chai.expect(object).haveOwnProperty(property)

const haveOwnProperties = (object, properies) => {
  for (let i = 0; i < properies.length - 1; i++) {
    chai.expect(object).haveOwnProperty(properies[i])
  }
}

module.exports = { equal, toBeNot, haveOwnProperty, haveOwnProperties }
