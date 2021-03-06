"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('div', test_util_1.ALL_ENVS, function () {
    it('same shape', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var c = tf.tensor2d([1, 2, 3, 4, 2, 5], [2, 3]);
        var r = tf.div(a, c);
        test_util_1.expectArraysClose(r, [1, 1, 1, 1, 2.5, 6 / 5]);
    });
    it('integer division implements floor divide', function () {
        var a = tf.tensor1d([-6, -6, -5, -4, -3, -3, 3, 3, 2], 'int32');
        var c = tf.tensor1d([-2, 2, 3, 2, -3, 3, 2, 3, 2], 'int32');
        var r = tf.div(a, c);
        expect(r.dtype).toEqual('int32');
        test_util_1.expectArraysClose(r, [3, -3, -2, -2, 1, -1, 1, 1, 1]);
    });
    it('integer division broadcasts', function () {
        var a = tf.tensor1d([-5, -4, 3, 2], 'int32');
        var c = tf.scalar(2, 'int32');
        var r = tf.div(a, c);
        expect(r.dtype).toEqual('int32');
        test_util_1.expectArraysClose(r, [-3, -2, 1, 1]);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor2d([1, 2], [2, 1]);
        var c = tf.tensor2d([3, NaN], [2, 1]);
        var r = tf.div(a, c);
        test_util_1.expectArraysClose(r, [1 / 3, NaN]);
    });
    it('broadcasting same rank Tensors different shape', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([2, 3], [2, 1]);
        var result = tf.div(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [1 / 2, 1, -1, -4 / 3];
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcast 2D + 1D', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor1d([1, 2]);
        var result = tf.div(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [1, 1, -3, -2];
        test_util_1.expectArraysClose(result, expected);
    });
    it('throws when passed tensors of different types', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([1, 2, 3, 4, 2, 5], [2, 3], 'int32');
        expect(function () { return tf.div(a, b); }).toThrowError();
        expect(function () { return tf.div(b, a); }).toThrowError();
    });
    it('throws when passed tensors of different shapes', function () {
        var a = tf.tensor2d([1, 2, -3, -4, 5, 6], [2, 3]);
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2]);
        expect(function () { return tf.div(a, b); }).toThrowError();
        expect(function () { return tf.div(b, a); }).toThrowError();
    });
    it('scalar divided by array', function () {
        var c = tf.scalar(2);
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var r = tf.div(c, a);
        test_util_1.expectArraysClose(r, [2 / 1, 2 / 2, 2 / 3, 2 / 4, 2 / 5, 2 / 6]);
    });
    it('scalar divided by array propagates NaNs', function () {
        var c = tf.scalar(NaN);
        var a = tf.tensor2d([1, 2, 3], [1, 3]);
        var r = tf.div(c, a);
        test_util_1.expectArraysEqual(r, [NaN, NaN, NaN]);
    });
    it('array divided by scalar', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var c = tf.scalar(2);
        var r = tf.div(a, c);
        test_util_1.expectArraysClose(r, [1 / 2, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2]);
    });
    it('array divided by scalar propagates NaNs', function () {
        var a = tf.tensor2d([1, 2, NaN], [1, 3]);
        var c = tf.scalar(2);
        var r = tf.div(a, c);
        test_util_1.expectArraysClose(r, [1 / 2, 2 / 2, NaN]);
    });
    it('gradient: Scalar', function () {
        var a = tf.scalar(5);
        var b = tf.scalar(2);
        var dy = tf.scalar(4);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [4 / 2]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-4 * 5 / (2 * 2)]);
    });
    it('gradient: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([1, 10, 20]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 / 3, 10 / 4, 20 / 5]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1 * 1 / 9, -10 * 2 / 16, -20 * 3 / 25]);
    });
    it('gradient: Tensor1D with int32', function () {
        var a = tf.tensor1d([1, 2, 3], 'int32');
        var b = tf.tensor1d([3, 4, 5], 'int32');
        var dy = tf.tensor1d([1, 10, 20]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 / 3, 10 / 4, 20 / 5]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1 * 1 / 9, -10 * 2 / 16, -20 * 3 / 25]);
    });
    it('gradient: 1d<int32> with 1d<bool> ', function () {
        var a = tf.tensor1d([true, false, true], 'bool');
        var b = tf.tensor1d([1, 2, 3], 'int32');
        var dy = tf.tensor1d([1, 19, 20]);
        var grads = tf.grads(function (a, b) { return tf.div(a.toInt(), b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1, 19 / 2, 20 / 3]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1 / 1, 0, -20 / 9]);
    });
    it('gradient: Tensor2D', function () {
        var a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        var b = tf.tensor2d([1, 3, 4, 5], [2, 2]);
        var dy = tf.tensor2d([1, 10, 15, 20], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 / 1, 10 / 3, 15 / 4, 20 / 5]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1 * 3 / 1, -10 * 1 / 9, -15 * 2 / 16, -20 * 3 / 25]);
    });
    it('gradient: scalar / Tensor1D', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([6, 7, 8]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [6 / 3 + 7 / 4 + 8 / 5]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-6 * 2 / 9, -7 * 2 / 16, -8 * 2 / 25]);
    });
    it('gradient: Tensor2D / scalar', function () {
        var a = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        var b = tf.scalar(2);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [6 / 2, 7 / 2, 8 / 2, 9 / 2]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-6 * 2 / 4 + -7 * 3 / 4 + -8 * 4 / 4 + -9 * 5 / 4]);
    });
    it('gradient: Tensor2D / Tensor2D w/ broadcast', function () {
        var a = tf.tensor2d([3, 4], [2, 1]);
        var b = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.div(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [6 / 2 + 7 / 3, 8 / 4 + 9 / 5]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-6 * 3 / 4, -7 * 3 / 9, -8 * 4 / 16, -9 * 4 / 25]);
    });
    it('throws when passed a as a non-tensor', function () {
        expect(function () { return tf.div({}, tf.scalar(1)); })
            .toThrowError(/Argument 'a' passed to 'div' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', function () {
        expect(function () { return tf.div(tf.scalar(1), {}); })
            .toThrowError(/Argument 'b' passed to 'div' must be a Tensor/);
    });
    it('accepts a tensor-like object', function () {
        var r = tf.div([[1, 2, 3], [4, 5, 6]], 2);
        expect(r.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(r, [1 / 2, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2]);
    });
});
jasmine_util_1.describeWithFlags('mul', test_util_1.ALL_ENVS, function () {
    it('strict same-shaped tensors', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2]);
        var expected = [5, 6, -12, 28];
        var result = tf.mulStrict(a, b);
        expect(result.shape).toEqual([2, 2]);
        expect(result.dtype).toBe('float32');
        test_util_1.expectArraysClose(result, expected);
    });
    it('strict propagates NaNs', function () {
        var a = tf.tensor2d([1, 3, 4, 0], [2, 2]);
        var b = tf.tensor2d([NaN, 3, NaN, 3], [2, 2]);
        var result = tf.mulStrict(a, b);
        expect(result.dtype).toBe('float32');
        test_util_1.expectArraysClose(result, [NaN, 9, NaN, 0]);
    });
    it('strict throws when passed tensors of different shapes', function () {
        var a = tf.tensor2d([1, 2, -3, -4, 5, 6], [2, 3]);
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2]);
        expect(function () { return tf.mulStrict(a, b); }).toThrowError();
        expect(function () { return tf.mulStrict(b, a); }).toThrowError();
    });
    it('strict throws when dtypes do not match', function () {
        var a = tf.tensor2d([1, 2, -3, -4, 5, 6], [2, 3], 'float32');
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2], 'int32');
        expect(function () { return tf.mulStrict(a, b); }).toThrowError();
        expect(function () { return tf.mulStrict(b, a); }).toThrowError();
    });
    it('strict int32 * int32', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2], 'int32');
        var b = tf.tensor2d([2, 1, 3, -4], [2, 2], 'int32');
        var res = tf.mulStrict(a, b);
        expect(res.dtype).toBe('int32');
        test_util_1.expectArraysClose(res, [2, 2, -9, 16]);
    });
    it('same-shaped tensors', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2]);
        var expected = [5, 6, -12, 28];
        var result = tf.mul(a, b);
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcasting tensors', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.scalar(2);
        var expected = [2, 4, -6, -8];
        var result = tf.mul(a, b);
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcasting same rank Tensors different shape', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([2, 3], [2, 1]);
        var result = tf.mul(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [2, 4, -9, -12];
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcast 2D + 1D', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor1d([1, 2]);
        var result = tf.mul(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [1, 4, -3, -8];
        test_util_1.expectArraysClose(result, expected);
    });
    it('gradient: Scalar', function () {
        var a = tf.scalar(5);
        var b = tf.scalar(2);
        var dy = tf.scalar(4);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [b.get() * dy.get()]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [a.get() * dy.get()]);
    });
    it('gradient: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([1, 10, 20]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [3 * 1, 4 * 10, 5 * 20]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [1 * 1, 2 * 10, 3 * 20]);
    });
    it('gradient: Tensor1D with dtype int32', function () {
        var a = tf.tensor1d([1, 2, 3], 'int32');
        var b = tf.tensor1d([3, 4, 5], 'int32');
        var dy = tf.tensor1d([1, 10, 20]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [3 * 1, 4 * 10, 5 * 20]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [1 * 1, 2 * 10, 3 * 20]);
    });
    it('gradient: Tensor2D', function () {
        var a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        var b = tf.tensor2d([1, 3, 4, 5], [2, 2]);
        var dy = tf.tensor2d([1, 10, 15, 20], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 * 1, 3 * 10, 4 * 15, 5 * 20]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [3 * 1, 1 * 10, 2 * 15, 3 * 20]);
    });
    it('gradient: scalar * Tensor1D', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([6, 7, 8]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [3 * 6 + 4 * 7 + 5 * 8]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [2 * 6, 2 * 7, 2 * 8]);
    });
    it('gradient: Tensor2D * scalar', function () {
        var a = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        var b = tf.scalar(2);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [2 * 6, 2 * 7, 2 * 8, 2 * 9]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [2 * 6 + 3 * 7 + 4 * 8 + 5 * 9]);
    });
    it('gradient: Tensor2D * Tensor2D w/ broadcast', function () {
        var a = tf.tensor2d([3, 4], [2, 1]);
        var b = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.mul(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [2 * 6 + 3 * 7, 4 * 8 + 5 * 9]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [6 * 3, 7 * 3, 8 * 4, 9 * 4]);
    });
    it('complex number multiplication', function () {
        var real1 = tf.tensor1d([2]);
        var imag1 = tf.tensor1d([3]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([4]);
        var imag2 = tf.tensor1d([5]);
        var complex2 = tf.complex(real2, imag2);
        var result = complex1.mul(complex2);
        expect(result.dtype).toBe('complex64');
        expect(result.shape).toEqual([1]);
        test_util_1.expectArraysClose(result, [2 * 4 - 3 * 5, 2 * 5 + 3 * 4]);
    });
    it('complex number broadcasting multiplication', function () {
        var real1 = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var imag1 = tf.tensor2d([10, 20, -30, -40], [2, 2]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([4]);
        var imag2 = tf.tensor1d([5]);
        var complex2 = tf.complex(real2, imag2);
        var result = tf.mul(complex1, complex2);
        expect(result.dtype).toEqual('complex64');
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, [
            1 * 4 - 10 * 5, 1 * 5 + 10 * 4, 2 * 4 - 20 * 5, 2 * 5 + 20 * 4,
            -3 * 4 + 30 * 5, -3 * 5 + -30 * 4, -4 * 4 + 40 * 5, -4 * 5 + -40 * 4
        ]);
    });
    it('throws when passed a as a non-tensor', function () {
        expect(function () { return tf.mul({}, tf.scalar(1)); })
            .toThrowError(/Argument 'a' passed to 'mul' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', function () {
        expect(function () { return tf.mul(tf.scalar(1), {}); })
            .toThrowError(/Argument 'b' passed to 'mul' must be a Tensor/);
    });
    it('throws when dtypes dont match', function () {
        expect(function () { return tf.mul(tf.scalar(1, 'int32'), tf.scalar(1)); })
            .toThrowError(/The dtypes of the first\(int32\) and second\(float32\) input must match/);
    });
    it('accepts a tensor-like object', function () {
        var result = tf.mul([[1, 2], [-3, -4]], 2);
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, [2, 4, -6, -8]);
    });
});
jasmine_util_1.describeWithFlags('pow', test_util_1.ALL_ENVS, function () {
    it('same-shaped tensors', function () {
        var a = tf.tensor2d([1, -2, -3, 0, 7, 1], [2, 3]);
        var b = tf.tensor2d([5, 3, 4, 5, 2, -3], [2, 3], 'int32');
        var expected = [1, -8, 81, 0, 49, 1];
        var result = tf.pow(a, b);
        expect(result.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(result, expected, 0.01);
    });
    it('int32^int32 returns int32', function () {
        var a = tf.tensor1d([1, 2, 3], 'int32');
        var exp = tf.scalar(2, 'int32');
        var result = tf.pow(a, exp);
        expect(result.shape).toEqual([3]);
        expect(result.dtype).toBe('int32');
        test_util_1.expectArraysEqual(result, [1, 4, 9]);
    });
    it('different-shaped tensors', function () {
        var a = tf.tensor2d([1, -2, -3, 0, 7, 1], [2, 3]);
        var b = tf.scalar(2, 'int32');
        var expected = [1, 4, 9, 0, 49, 1];
        var result = tf.pow(a, b);
        expect(result.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(result, expected, 0.05);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor2d([NaN, 3, NaN, 0], [2, 2]);
        var b = tf.tensor2d([1, 3, 2, 3], [2, 2], 'int32');
        var result = tf.pow(a, b);
        test_util_1.expectArraysClose(result, [NaN, 27, NaN, 0], 0.05);
    });
    it('handles non int32 exponent param', function () {
        var a = tf.tensor1d([2, 4]);
        var b = tf.tensor1d([.5, 1.2]);
        var result = tf.pow(a, b);
        var expected = [Math.pow(2, 0.5), Math.pow(4, 1.2)];
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcasting same rank Tensors different shape', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([2, 1], [2, 1], 'int32');
        var result = tf.pow(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [1, 4, -3, -4];
        test_util_1.expectArraysClose(result, expected);
    });
    it('broadcast 2D + 1D', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor1d([1, 2], 'int32');
        var result = tf.pow(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [1, 4, -3, 16];
        test_util_1.expectArraysClose(result, expected);
    });
    it('powStrict same-shaped tensors', function () {
        var a = tf.tensor2d([1, -2, -3, 0, 7, 1], [2, 3]);
        var b = tf.tensor2d([5, 3, 4, 5, 2, -3], [2, 3], 'int32');
        var expected = [1, -8, 81, 0, 49, 1];
        var result = tf.powStrict(a, b);
        expect(result.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(result, expected, 0.01);
    });
    it('powStrict throws when passed tensors of different shapes', function () {
        var a = tf.tensor2d([1, 2, -3, -4, 5, 6], [2, 3]);
        var b = tf.tensor2d([5, 3, 4, -7], [2, 2], 'int32');
        expect(function () { return tf.powStrict(a, b); }).toThrowError();
    });
    it('powStrict handles non int32 exponent param', function () {
        var a = tf.tensor1d([2, 4]);
        var b = tf.tensor1d([.5, 1.2]);
        var result = tf.powStrict(a, b);
        var expected = [Math.pow(2, 0.5), Math.pow(4, 1.2)];
        test_util_1.expectArraysClose(result, expected);
    });
    it('gradients: Scalar ^ Scalar', function () {
        var a = tf.scalar(5);
        var b = tf.scalar(2, 'int32');
        var dy = tf.scalar(3);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [2 * 5 * 3]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [3 * Math.pow(5, 2) * Math.log(5)]);
    });
    it('gradients: x ^ 2 where x = 0', function () {
        var f = function (x) { return x.pow(tf.scalar(2)).asScalar(); };
        var g = tf.grad(f)(tf.scalar(0));
        test_util_1.expectArraysClose(g, [0]);
    });
    it('gradients: Scalar ^ Scalar fractional exponent', function () {
        var a = tf.scalar(4.0);
        var b = tf.scalar(1.5);
        var dy = tf.scalar(3.0);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1.5 * Math.pow(4, 0.5) * 3]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [3.0 * Math.pow(4, 1.5) * Math.log(4.0)]);
    });
    it('gradients: Tensor ^ Tensor', function () {
        var a = tf.tensor1d([-1, .5, 2]);
        var b = tf.tensor1d([3, 2, -1], 'int32');
        var dy = tf.tensor1d([1, 5, 10]);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [
            3 * Math.pow(-1, 2) * 1, 2 * Math.pow(.5, 1) * 5,
            -1 * Math.pow(2, -2) * 10
        ], 1e-1);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [
            NaN, 5 * Math.pow(.5, 2) * Math.log(.5),
            10 * Math.pow(2, -1) * Math.log(2)
        ]);
    });
    it('gradient: scalar / Tensor1D', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([6, 7, 8]);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [
            6 * 3 * Math.pow(2, 2) + 7 * 4 * Math.pow(2, 3) + 8 * 5 * Math.pow(2, 4)
        ]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [
            6 * Math.pow(2, 3) * Math.log(2), 7 * Math.pow(2, 4) * Math.log(2),
            8 * Math.pow(2, 5) * Math.log(2)
        ]);
    });
    it('gradient: Tensor2D / scalar', function () {
        var a = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        var b = tf.scalar(2);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [
            6 * 2 * Math.pow(2, 1), 7 * 2 * Math.pow(3, 1), 8 * 2 * Math.pow(4, 1),
            9 * 2 * Math.pow(5, 1)
        ]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [6 * Math.pow(2, 2) * Math.log(2) + 7 * Math.pow(3, 2) * Math.log(3) +
                8 * Math.pow(4, 2) * Math.log(4) + 9 * Math.pow(5, 2) * Math.log(5)]);
    });
    it('gradient: Tensor2D / Tensor2D w/ broadcast', function () {
        var a = tf.tensor2d([3, 4], [2, 1]);
        var b = tf.tensor2d([[2, 3], [.4, .5]], [2, 2]);
        var dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.pow(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [
            6 * 2 * Math.pow(3, 1) + 7 * 3 * Math.pow(3, 2),
            8 * .4 * Math.pow(4, .4 - 1) + 9 * .5 * Math.pow(4, .5 - 1)
        ]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [
            6 * Math.pow(3, 2) * Math.log(3), 7 * Math.pow(3, 3) * Math.log(3),
            8 * Math.pow(4, .4) * Math.log(4), 9 * Math.pow(4, .5) * Math.log(4)
        ]);
    });
    it('throws when passed base as a non-tensor', function () {
        expect(function () { return tf.pow({}, tf.scalar(1)); })
            .toThrowError(/Argument 'base' passed to 'pow' must be a Tensor/);
    });
    it('throws when passed exp as a non-tensor', function () {
        expect(function () { return tf.pow(tf.scalar(1), {}); })
            .toThrowError(/Argument 'exp' passed to 'pow' must be a Tensor/);
    });
    it('accepts a tensor-like object', function () {
        var result = tf.pow([1, 2, 3], 2);
        expect(result.shape).toEqual([3]);
        expect(result.dtype).toBe('float32');
        test_util_1.expectArraysEqual(result, [1, 4, 9]);
    });
    it('negative base and whole exponent not NaN', function () {
        var a = tf.tensor1d([-2, -3, -4], 'float32');
        var b = tf.tensor1d([2, -3, 4], 'float32');
        var expected = [Math.pow(-2, 2), Math.pow(-3, -3), Math.pow(-4, 4)];
        var result = tf.pow(a, b);
        test_util_1.expectArraysClose(result, expected);
    });
    it('negative base and fract exponent NaN', function () {
        var a = tf.tensor1d([-2, -3, -4], 'float32');
        var b = tf.tensor1d([2.1, -3.01, 4.1], 'float32');
        var expected = [NaN, NaN, NaN];
        var result = tf.pow(a, b);
        test_util_1.expectArraysClose(result, expected);
    });
});
jasmine_util_1.describeWithFlags('add', test_util_1.ALL_ENVS, function () {
    it('c + A', function () {
        var c = tf.scalar(5);
        var a = tf.tensor1d([1, 2, 3]);
        var result = tf.add(c, a);
        test_util_1.expectArraysClose(result, [6, 7, 8]);
    });
    it('c + A propagates NaNs', function () {
        var c = tf.scalar(NaN);
        var a = tf.tensor1d([1, 2, 3]);
        var res = tf.add(c, a);
        test_util_1.expectArraysEqual(res, [NaN, NaN, NaN]);
    });
    it('A + B broadcasting same rank Tensors different shape', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([2, 3], [2, 1]);
        var result = tf.add(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [3, 4, 0, -1];
        test_util_1.expectArraysClose(result, expected);
    });
    it('A + B broadcast 2D + 1D', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor1d([1, 2]);
        var result = tf.add(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [2, 4, -2, -2];
        test_util_1.expectArraysClose(result, expected);
    });
    it('A + B', function () {
        var a = tf.tensor1d([2, 5, 1]);
        var b = tf.tensor1d([4, 2, -1]);
        var result = tf.add(a, b);
        var expected = [6, 7, 0];
        test_util_1.expectArraysClose(result, expected);
    });
    it('A + B propagates NaNs', function () {
        var a = tf.tensor1d([2, 5, NaN]);
        var b = tf.tensor1d([4, 2, -1]);
        var res = tf.add(a, b);
        test_util_1.expectArraysClose(res, [6, 7, NaN]);
    });
    it('A + B throws when passed tensors with different shape', function () {
        var a = tf.tensor1d([2, 5, 1, 5]);
        var b = tf.tensor1d([4, 2, -1]);
        expect(function () { return tf.add(a, b); }).toThrowError();
        expect(function () { return tf.add(b, a); }).toThrowError();
    });
    it('2D+scalar broadcast', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.scalar(2);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [3, 4, 5, 6, 7, 8]);
    });
    it('scalar+1D broadcast', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([1, 2, 3, 4, 5, 6]);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([6]);
        test_util_1.expectArraysClose(res, [3, 4, 5, 6, 7, 8]);
    });
    it('2D+2D broadcast each with 1 dim', function () {
        var a = tf.tensor2d([1, 2, 5], [1, 3]);
        var b = tf.tensor2d([7, 3], [2, 1]);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [8, 9, 12, 4, 5, 8]);
    });
    it('2D+2D broadcast inner dim of b', function () {
        var a = tf.tensor2d([1, 2, 5, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([7, 3], [2, 1]);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [8, 9, 12, 7, 8, 9]);
    });
    it('3D+scalar', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1]);
        var b = tf.scalar(-1);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 3, 1]);
        test_util_1.expectArraysClose(res, [0, 1, 2, 3, 4, 5]);
    });
    it('6D+scalar', function () {
        var a = tf.range(0, 64).reshape([2, 2, 2, 2, 2, 2]);
        var b = tf.scalar(-1);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 2, 2, 2, 2, 2]);
        var expectedResult = [
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
            47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62
        ];
        test_util_1.expectArraysClose(res, expectedResult);
    });
    it('6D+2D', function () {
        var a = tf.range(0, 64).reshape([2, 2, 2, 2, 2, 2]);
        var b = tf.tensor2d([11, 13, 17, 19], [2, 2]);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([2, 2, 2, 2, 2, 2]);
        var expectedResult = [
            11, 14, 19, 22, 15, 18, 23, 26, 19, 22, 27, 30, 23, 26, 31, 34,
            27, 30, 35, 38, 31, 34, 39, 42, 35, 38, 43, 46, 39, 42, 47, 50,
            43, 46, 51, 54, 47, 50, 55, 58, 51, 54, 59, 62, 55, 58, 63, 66,
            59, 62, 67, 70, 63, 66, 71, 74, 67, 70, 75, 78, 71, 74, 79, 82
        ];
        test_util_1.expectArraysClose(res, expectedResult);
    });
    it('add tensors with 0 in shape', function () {
        var a = tf.tensor1d([1]);
        var b = tf.tensor3d([], [0, 0, 5]);
        var res = tf.add(a, b);
        expect(res.shape).toEqual([0, 0, 5]);
        test_util_1.expectArraysEqual(res, []);
    });
    it('gradient: scalar + 1D broadcast', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([7, 8, 9]);
        var grads = tf.grads(function (a, b) { return tf.add(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [7 + 8 + 9]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [7, 8, 9]);
    });
    it('gradient: 2D + 2D broadcast', function () {
        var a = tf.tensor2d([2, 3], [2, 1]);
        var b = tf.tensor2d([4, 5, 6, 7], [2, 2]);
        var dy = tf.tensor2d([5, 4, 3, 2], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.add(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [5 + 4, 3 + 2]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [5, 4, 3, 2]);
    });
    it('complex number addition', function () {
        var real1 = tf.tensor1d([1]);
        var imag1 = tf.tensor1d([2]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([3]);
        var imag2 = tf.tensor1d([4]);
        var complex2 = tf.complex(real2, imag2);
        var result = complex1.add(complex2);
        expect(result.dtype).toBe('complex64');
        expect(result.shape).toEqual([1]);
        test_util_1.expectArraysClose(result, [4, 6]);
    });
    it('complex number reshape and then addition', function () {
        var real1 = tf.tensor1d([1]);
        var imag1 = tf.tensor1d([2]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([3]);
        var imag2 = tf.tensor1d([4]);
        var complex2 = tf.complex(real2, imag2);
        var complex1Reshaped = complex1.reshape([1, 1, 1]);
        var complex2Reshaped = complex2.reshape([1, 1, 1]);
        var result = complex1Reshaped.add(complex2Reshaped);
        expect(result.dtype).toBe('complex64');
        expect(result.shape).toEqual([1, 1, 1]);
        test_util_1.expectArraysClose(result, [4, 6]);
    });
    it('complex number broadcasting addition', function () {
        var real1 = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var imag1 = tf.tensor2d([10, 20, -30, -40], [2, 2]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([4]);
        var imag2 = tf.tensor1d([5]);
        var complex2 = tf.complex(real2, imag2);
        var result = tf.add(complex1, complex2);
        expect(result.dtype).toEqual('complex64');
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, [1 + 4, 10 + 5, 2 + 4, 20 + 5, -3 + 4, -30 + 5, -4 + 4, -40 + 5]);
    });
    it('throws when passed a as a non-tensor', function () {
        expect(function () { return tf.add({}, tf.scalar(1)); })
            .toThrowError(/Argument 'a' passed to 'add' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', function () {
        expect(function () { return tf.add(tf.scalar(1), {}); })
            .toThrowError(/Argument 'b' passed to 'add' must be a Tensor/);
    });
    it('throws when dtypes dont match', function () {
        expect(function () { return tf.add(tf.scalar(1, 'int32'), tf.scalar(1)); })
            .toThrowError(/The dtypes of the first\(int32\) and second\(float32\) input must match/);
    });
    it('accepts a tensor-like object', function () {
        var result = tf.add(5, [1, 2, 3]);
        test_util_1.expectArraysClose(result, [6, 7, 8]);
    });
});
jasmine_util_1.describeWithFlags('addN', test_util_1.ALL_ENVS, function () {
    it('a single tensor', function () {
        var res = tf.addN([tf.tensor1d([1, 2, 3])]);
        test_util_1.expectArraysClose(res, [1, 2, 3]);
    });
    it('two tensors, int32', function () {
        var res = tf.addN([
            tf.tensor1d([1, 2, -1], 'int32'),
            tf.tensor1d([5, 3, 2], 'int32'),
        ]);
        test_util_1.expectArraysClose(res, [6, 5, 1]);
        expect(res.dtype).toBe('int32');
        expect(res.shape).toEqual([3]);
    });
    it('three tensors', function () {
        var res = tf.addN([
            tf.tensor1d([1, 2]),
            tf.tensor1d([5, 3]),
            tf.tensor1d([-5, -2]),
        ]);
        test_util_1.expectArraysClose(res, [1, 3]);
        expect(res.dtype).toBe('float32');
        expect(res.shape).toEqual([2]);
    });
    it('accepts a tensor-like object', function () {
        var res = tf.addN([[1, 2], [3, 4]]);
        test_util_1.expectArraysClose(res, [4, 6]);
        expect(res.dtype).toBe('float32');
        expect(res.shape).toEqual([2]);
    });
    it('list of numbers gets treated as a list of scalars', function () {
        var res = tf.addN([1, 2, 3, 4]);
        test_util_1.expectArraysClose(res, [10]);
        expect(res.dtype).toBe('float32');
        expect(res.shape).toEqual([]);
    });
    it('errors if list is empty', function () {
        expect(function () { return tf.addN([]); })
            .toThrowError(/Must pass at least one tensor to tf.addN\(\), but got 0/);
    });
    it('errors if argument is not an array', function () {
        expect(function () { return tf.addN(tf.scalar(3)); })
            .toThrowError(/The argument passed to tf.addN\(\) must be a list of tensors/);
    });
    it('errors if arguments not of same dtype', function () {
        expect(function () { return tf.addN([tf.scalar(1, 'int32'), tf.scalar(2, 'float32')]); })
            .toThrowError(/All tensors passed to tf.addN\(\) must have the same dtype/);
    });
    it('errors if arguments not of same shape', function () {
        expect(function () { return tf.addN([tf.scalar(1), tf.tensor1d([2])]); })
            .toThrowError(/All tensors passed to tf.addN\(\) must have the same shape/);
    });
});
jasmine_util_1.describeWithFlags('sub', test_util_1.ALL_ENVS, function () {
    it('c - A', function () {
        var c = tf.scalar(5);
        var a = tf.tensor1d([7, 2, 3]);
        var result = tf.sub(c, a);
        test_util_1.expectArraysClose(result, [-2, 3, 2]);
    });
    it('A - c', function () {
        var a = tf.tensor1d([1, 2, -3]);
        var c = tf.scalar(5);
        var result = tf.sub(a, c);
        test_util_1.expectArraysClose(result, [-4, -3, -8]);
    });
    it('A - c propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN, 3]);
        var c = tf.scalar(5);
        var res = tf.sub(a, c);
        test_util_1.expectArraysClose(res, [-4, NaN, -2]);
    });
    it('A - B', function () {
        var a = tf.tensor1d([2, 5, 1]);
        var b = tf.tensor1d([4, 2, -1]);
        var result = tf.sub(a, b);
        var expected = [-2, 3, 2];
        test_util_1.expectArraysClose(result, expected);
    });
    it('A - B propagates NaNs', function () {
        var a = tf.tensor1d([2, 5, 1]);
        var b = tf.tensor1d([4, NaN, -1]);
        var res = tf.sub(a, b);
        test_util_1.expectArraysClose(res, [-2, NaN, 2]);
    });
    it('A - B throws when passed tensors with different shape', function () {
        var a = tf.tensor1d([2, 5, 1, 5]);
        var b = tf.tensor1d([4, 2, -1]);
        expect(function () { return tf.sub(a, b); }).toThrowError();
        expect(function () { return tf.sub(b, a); }).toThrowError();
    });
    it('A - B broadcasting same rank Tensors different shape', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor2d([2, 3], [2, 1]);
        var result = tf.sub(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [-1, 0, -6, -7];
        test_util_1.expectArraysClose(result, expected);
    });
    it('A - B broadcast 2D + 1D', function () {
        var a = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var b = tf.tensor1d([1, 2]);
        var result = tf.sub(a, b);
        expect(result.shape).toEqual([2, 2]);
        var expected = [0, 0, -4, -6];
        test_util_1.expectArraysClose(result, expected);
    });
    it('2D-scalar broadcast', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.scalar(2);
        var res = tf.sub(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [-1, 0, 1, 2, 3, 4]);
    });
    it('scalar-1D broadcast', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([1, 2, 3, 4, 5, 6]);
        var res = tf.sub(a, b);
        expect(res.shape).toEqual([6]);
        test_util_1.expectArraysClose(res, [1, 0, -1, -2, -3, -4]);
    });
    it('2D-2D broadcast each with 1 dim', function () {
        var a = tf.tensor2d([1, 2, 5], [1, 3]);
        var b = tf.tensor2d([7, 3], [2, 1]);
        var res = tf.sub(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [-6, -5, -2, -2, -1, 2]);
    });
    it('2D-2D broadcast inner dim of b', function () {
        var a = tf.tensor2d([1, 2, 5, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([7, 3], [2, 1]);
        var res = tf.sub(a, b);
        expect(res.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(res, [-6, -5, -2, 1, 2, 3]);
    });
    it('3D-scalar', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1]);
        var b = tf.scalar(-1);
        var res = tf.sub(a, b);
        expect(res.shape).toEqual([2, 3, 1]);
        test_util_1.expectArraysClose(res, [2, 3, 4, 5, 6, 7]);
    });
    it('gradients: basic 1D arrays', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([3, 2, 1]);
        var dy = tf.tensor1d([1, 10, 20]);
        var grads = tf.grads(function (a, b) { return tf.sub(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1, 10, 20]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1, -10, -20]);
    });
    it('gradients: basic 2D arrays', function () {
        var a = tf.tensor2d([0, 1, 2, 3], [2, 2]);
        var b = tf.tensor2d([3, 2, 1, 0], [2, 2]);
        var dy = tf.tensor2d([1, 10, 15, 20], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.sub(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1, 10, 15, 20]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-1, -10, -15, -20]);
    });
    it('gradient: 1D - scalar broadcast', function () {
        var a = tf.tensor1d([3, 4, 5]);
        var b = tf.scalar(2);
        var dy = tf.tensor1d([7, 8, 9]);
        var grads = tf.grads(function (a, b) { return tf.sub(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [7, 8, 9]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-7 - 8 - 9]);
    });
    it('gradient: scalar - 1D broadcast', function () {
        var a = tf.scalar(2);
        var b = tf.tensor1d([3, 4, 5]);
        var dy = tf.tensor1d([7, 8, 9]);
        var grads = tf.grads(function (a, b) { return tf.sub(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [7 + 8 + 9]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-7, -8, -9]);
    });
    it('gradient: 2D - 2D broadcast', function () {
        var a = tf.tensor2d([4, 5, 6, 7], [2, 2]);
        var b = tf.tensor2d([2, 3], [2, 1]);
        var dy = tf.tensor2d([5, 4, 3, 2], [2, 2]);
        var grads = tf.grads(function (a, b) { return tf.sub(a, b); });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [5, 4, 3, 2]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        test_util_1.expectArraysClose(db, [-5 - 4, -3 - 2]);
    });
    it('complex number subtraction', function () {
        var real1 = tf.tensor1d([3]);
        var imag1 = tf.tensor1d([5]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([1]);
        var imag2 = tf.tensor1d([0]);
        var complex2 = tf.complex(real2, imag2);
        var result = complex1.sub(complex2);
        expect(result.dtype).toBe('complex64');
        expect(result.shape).toEqual([1]);
        test_util_1.expectArraysClose(result, [2, 5]);
    });
    it('complex number broadcasting subtraction', function () {
        var real1 = tf.tensor2d([1, 2, -3, -4], [2, 2]);
        var imag1 = tf.tensor2d([10, 20, -30, -40], [2, 2]);
        var complex1 = tf.complex(real1, imag1);
        var real2 = tf.tensor1d([4]);
        var imag2 = tf.tensor1d([5]);
        var complex2 = tf.complex(real2, imag2);
        var result = tf.sub(complex1, complex2);
        expect(result.dtype).toEqual('complex64');
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, [1 - 4, 10 - 5, 2 - 4, 20 - 5, -3 - 4, -30 - 5, -4 - 4, -40 - 5]);
    });
    it('throws when passed a as a non-tensor', function () {
        expect(function () { return tf.sub({}, tf.scalar(1)); })
            .toThrowError(/Argument 'a' passed to 'sub' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', function () {
        expect(function () { return tf.sub(tf.scalar(1), {}); })
            .toThrowError(/Argument 'b' passed to 'sub' must be a Tensor/);
    });
    it('throws when dtypes dont match', function () {
        expect(function () { return tf.sub(tf.scalar(1, 'int32'), tf.scalar(1)); })
            .toThrowError(/The dtypes of the first\(int32\) and second\(float32\) input must match/);
    });
    it('throws when dtypes dont match', function () {
        expect(function () { return tf.sub(tf.scalar(1, 'float32'), tf.complex(1, 2)); })
            .toThrowError(/The dtypes of the first\(float32\) and second\(complex64\) input must match/);
    });
    it('accepts a tensor-like object', function () {
        var result = tf.sub(5, [7, 2, 3]);
        test_util_1.expectArraysClose(result, [-2, 3, 2]);
    });
});
//# sourceMappingURL=arithmetic_test.js.map