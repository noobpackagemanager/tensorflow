import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { Layer, LayerConfig } from '../engine/topology';
import { Kwargs, Shape } from '../types';
export interface ReLULayerConfig extends LayerConfig {
    maxValue?: number;
}
export declare class ReLU extends Layer {
    static className: string;
    maxValue: number;
    constructor(config?: ReLULayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    getConfig(): serialization.ConfigDict;
}
export interface LeakyReLULayerConfig extends LayerConfig {
    alpha?: number;
}
export declare class LeakyReLU extends Layer {
    static className: string;
    readonly alpha: number;
    readonly DEFAULT_ALPHA: number;
    constructor(config?: LeakyReLULayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    getConfig(): serialization.ConfigDict;
}
export interface ELULayerConfig extends LayerConfig {
    alpha?: number;
}
export declare class ELU extends Layer {
    static className: string;
    readonly alpha: number;
    readonly DEFAULT_ALPHA: number;
    constructor(config?: ELULayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    getConfig(): serialization.ConfigDict;
}
export interface ThresholdedReLULayerConfig extends LayerConfig {
    theta?: number;
}
export declare class ThresholdedReLU extends Layer {
    static className: string;
    readonly theta: number;
    private readonly thetaTensor;
    readonly DEFAULT_THETA: number;
    constructor(config?: ThresholdedReLULayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    getConfig(): serialization.ConfigDict;
}
export interface SoftmaxLayerConfig extends LayerConfig {
    axis?: number;
}
export declare class Softmax extends Layer {
    static className: string;
    readonly axis: number;
    readonly softmax: (t: Tensor, a?: number) => Tensor;
    readonly DEFAULT_AXIS: number;
    constructor(config?: SoftmaxLayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    getConfig(): serialization.ConfigDict;
}
