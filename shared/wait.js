function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(`${ms} milliseconds have passed!`)
    }, ms)
  })
}

module.exports = wait
