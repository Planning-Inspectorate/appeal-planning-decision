import featureCheck from '@pins/common/src/is-feature-active.js';
import config from './config.js';

export const isFeatureActive = featureCheck.isFeatureActive(config.featureFlagging);
