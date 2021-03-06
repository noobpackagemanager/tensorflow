import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { Constraint, ConstraintIdentifier } from '../constraints';
import { Layer, LayerConfig } from '../engine/topology';
import { Initializer, InitializerIdentifier } from '../initializers';
import { Regularizer, RegularizerIdentifier } from '../regularizers';
import { Kwargs, Shape } from '../types';
export declare function batchNormalization(x: Tensor, mean: Tensor, variance: Tensor, beta?: Tensor, gamma?: Tensor, epsilon?: number): Tensor;
export declare function normalizeBatchInTraining(x: Tensor, gamma: Tensor, beta: Tensor, reductionAxes: number[], epsilon?: number): [Tensor, Tensor, Tensor];
export interface BatchNormalizationLayerConfig extends LayerConfig {
    axis?: number;
    momentum?: number;
    epsilon?: number;
    center?: boolean;
    scale?: boolean;
    betaInitializer?: InitializerIdentifier | Initializer;
    gammaInitializer?: InitializerIdentifier | Initializer;
    movingMeanInitializer?: InitializerIdentifier | Initializer;
    movingVarianceInitializer?: InitializerIdentifier | Initializer;
    betaConstraint?: ConstraintIdentifier | Constraint;
    gammaConstraint?: ConstraintIdentifier | Constraint;
    betaRegularizer?: RegularizerIdentifier | Regularizer;
    gammaRegularizer?: RegularizerIdentifier | Regularizer;
}
export declare class BatchNormalization extends Layer {
    static className: string;
    private readonly axis;
    private readonly momentum;
    private readonly epsilon;
    private readonly center;
    private readonly scale;
    private readonly betaInitializer;
    private readonly gammaInitializer;
    private readonly movingMeanInitializer;
    private readonly movingVarianceInitializer;
    private readonly betaConstraint;
    private readonly gammaConstraint;
    private readonly betaRegularizer;
    private readonly gammaRegularizer;
    private gamma;
    private beta;
    private movingMean;
    private movingVariance;
    private stepCount;
    constructor(config?: BatchNormalizationLayerConfig);
    build(inputShape: Shape | Shape[]): void;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    getConfig(): serialization.ConfigDict;
}
