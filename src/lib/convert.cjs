const { SourceMapConsumer: asyncSourceMapConsumer } = require("source-map");
const { SourceMapConsumer } = require("source-map-js");
const chalk = require("chalk");

const regex = /(\.js):(\d+):(\d+)\)?/gm;

const fnColors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];

/**
 * Using the original async "source-map" package
 * It use WASM.
 * @param {string} sourceMap
 * @param {string} input
 * @param {boolean} colorize
 * @return {Promise<string>}
 */
module.exports.convertAsync = async function convertAsync(
    sourceMap,
    input,
    colorize = false,
) {
    const consumer = await asyncSourceMapConsumer.with(
        sourceMap,
        null,
        (_consumer) => _consumer,
    );

    const result = convert(consumer, input, colorize);

    consumer.destroy();

    return result;
};

/**
 * Using the forked sync "source-map-js" package (it's used by sass, etc...).
 * It doesn't use WASM.
 * @param {string} sourceMap
 * @param {string} input
 * @param {boolean} colorize
 * @return {string}
 */
module.exports.convertSync = async function convertAsync(
    sourceMap,
    input,
    colorize = false,
) {
    const consumer = new SourceMapConsumer(sourceMap);

    return convert(consumer, input, colorize);
};

/**
 * Agnostic to the consumer.
 * @param {SourceMapConsumer|asyncSourceMapConsumer} consumer
 * @param {string} input
 * @param {boolean} colorize
 * @return {string}
 */
function convert(consumer, input, colorize = false) {
    const result = input.replace(regex, (...args) => {
        // console.log(...args);
        const [match, , line, column] = args;
        const original = consumer.originalPositionFor({
            line: +line,
            column: +column,
        });
        // console.log(original);

        original.source = original.source.replace("webpack://", "");
        if (!colorize) return `${match} - ${JSON.stringify(original)}`;

        return `${match} - ${Object.entries(original)
            .map(([key, value], index) =>
                chalk.bold(fnColors[index](`${key} : ${value}`)),
            )
            .join(", ")}`;
    });

    return result;
}
