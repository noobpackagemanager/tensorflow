"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createNumberAttr(value) {
    return { value: value, type: 'number' };
}
exports.createNumberAttr = createNumberAttr;
function createNumberAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number' };
}
exports.createNumberAttrFromIndex = createNumberAttrFromIndex;
function createStrAttr(str) {
    return { value: str, type: 'string' };
}
exports.createStrAttr = createStrAttr;
function createBoolAttr(value) {
    return { value: value, type: 'bool' };
}
exports.createBoolAttr = createBoolAttr;
function createTensorShapeAttr(value) {
    return { value: value, type: 'shape' };
}
exports.createTensorShapeAttr = createTensorShapeAttr;
function createNumericArrayAttr(value) {
    return { value: value, type: 'number[]' };
}
exports.createNumericArrayAttr = createNumericArrayAttr;
function createNumericArrayAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number[]' };
}
exports.createNumericArrayAttrFromIndex = createNumericArrayAttrFromIndex;
function createTensorAttr(index) {
    return { inputIndex: index, type: 'tensor' };
}
exports.createTensorAttr = createTensorAttr;
function createTensorsAttr(index, paramLength) {
    return { inputIndex: index, inputParamLength: paramLength, type: 'tensors' };
}
exports.createTensorsAttr = createTensorsAttr;
function createDtypeAttr(dtype) {
    return { value: dtype, type: 'dtype' };
}
exports.createDtypeAttr = createDtypeAttr;
function validateParam(node, opMappers, tfOpName) {
    var opMapper = tfOpName != null ?
        opMappers.find(function (mapper) { return mapper.tfOpName === tfOpName; }) :
        opMappers.find(function (mapper) { return mapper.dlOpName === node.op; });
    return Object.keys(node.params).every(function (key) {
        var value = node.params[key];
        var def = opMapper.params.find(function (param) { return param.dlParamName === key; });
        return def && def.type === value.type &&
            def.tfInputIndex === value.inputIndex;
    });
}
exports.validateParam = validateParam;
//# sourceMappingURL=test_helper.js.map