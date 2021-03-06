import * as tfc from '@tensorflow/tfjs-core';
import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { Layer, LayerConfig, SymbolicTensor } from '../engine/topology';
import { Kwargs, Shape } from '../types';
import { RegularizerFn } from '../types';
import { LayerVariable } from '../variables';
import { RNN } from './recurrent';
export interface WrapperLayerConfig extends LayerConfig {
    layer: Layer;
}
export declare abstract class Wrapper extends Layer {
    readonly layer: Layer;
    constructor(config: WrapperLayerConfig);
    build(inputShape: Shape | Shape[]): void;
    trainable: boolean;
    readonly trainableWeights: LayerVariable[];
    readonly nonTrainableWeights: LayerVariable[];
    readonly updates: Tensor[];
    readonly losses: RegularizerFn[];
    getWeights(): Tensor[];
    setWeights(weights: Tensor[]): void;
    getConfig(): serialization.ConfigDict;
    static fromConfig<T extends serialization.Serializable>(cls: serialization.SerializableConstructor<T>, config: serialization.ConfigDict, customObjects?: tfc.serialization.ConfigDict): T;
}
export declare class TimeDistributed extends Wrapper {
    static className: string;
    constructor(config: WrapperLayerConfig);
    build(inputShape: Shape | Shape[]): void;
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
export declare type BidirectionalMergeMode = 'sum' | 'mul' | 'concat' | 'ave';
export declare const VALID_BIDIRECTIONAL_MERGE_MODES: string[];
export declare function checkBidirectionalMergeMode(value?: string): void;
export interface BidirectionalLayerConfig extends WrapperLayerConfig {
    layer: RNN;
    mergeMode?: BidirectionalMergeMode;
}
export declare class Bidirectional extends Wrapper {
    static className: string;
    private forwardLayer;
    private backwardLayer;
    private mergeMode;
    private returnSequences;
    private returnState;
    private numConstants?;
    private _trainable;
    constructor(config: BidirectionalLayerConfig);
    trainable: boolean;
    getWeights(): Tensor[];
    setWeights(weights: Tensor[]): void;
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    apply(inputs: Tensor | Tensor[] | SymbolicTensor | SymbolicTensor[], kwargs?: Kwargs): Tensor | Tensor[] | SymbolicTensor | SymbolicTensor[];
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    resetStates(states?: Tensor | Tensor[]): void;
    build(inputShape: Shape | Shape[]): void;
    readonly trainableWeights: LayerVariable[];
    readonly nonTrainableWeights: LayerVariable[];
    getConfig(): serialization.ConfigDict;
    static fromConfig<T extends serialization.Serializable>(cls: serialization.SerializableConstructor<T>, config: serialization.ConfigDict): T;
}
