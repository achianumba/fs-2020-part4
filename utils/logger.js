const info = (...args) => {
    console.log(...args, '\n')
}

const error = (...args) => {
    console.error(...args, '\n');
}

module.exports = { info, error };