"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'cast': {
            return [tfc.cast(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('dtype', node, tensorMap, context))];
        }
        case 'expandDims': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            return [tfc.expandDims(utils_1.getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'squeeze': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            return [tfc.squeeze(utils_1.getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'reshape': {
            return [tfc.reshape(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('shape', node, tensorMap, context))];
        }
        case 'pad': {
            return [tfc.pad(utils_1.getParamValue('x', node, tensorMap, context), utils_1.split(utils_1.getParamValue('padding', node, tensorMap, context), 2), utils_1.getParamValue('constantValue', node, tensorMap, context))];
        }
        case 'spaceToBatchND': {
            var blockShape = utils_1.getParamValue('blockShape', node, tensorMap, context);
            var paddings = utils_1.split(utils_1.getParamValue('paddings', node, tensorMap, context), 2);
            return [tfc.spaceToBatchND(utils_1.getParamValue('x', node, tensorMap, context), blockShape, paddings)];
        }
        case 'batchToSpaceND': {
            var blockShape = utils_1.getParamValue('blockShape', node, tensorMap, context);
            var crops = utils_1.split(utils_1.getParamValue('crops', node, tensorMap, context), 2);
            return [tfc.batchToSpaceND(utils_1.getParamValue('x', node, tensorMap, context), blockShape, crops)];
        }
        case 'depthToSpace': {
            var blockSize = utils_1.getParamValue('blockSize', node, tensorMap, context);
            var dataFormat = utils_1.getParamValue('dataFormat', node, tensorMap, context);
            return [tfc.depthToSpace(utils_1.getParamValue('x', node, tensorMap, context), blockSize, dataFormat)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'transformation';
//# sourceMappingURL=transformation_executor.js.map