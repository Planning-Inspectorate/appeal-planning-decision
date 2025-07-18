import BaseValidator from '../validator/base-validator';
import { JourneyResponse } from '../journey/journey-response';
import { Option } from './options-question';

export interface QuestionParameters {
	title: string;
	question: string;
	viewFolder: string;
	fieldName: string;
	url?: string;
	pageTitle?: string;
	description?: string;
	validators?: BaseValidator[];
	html?: string;
	hint?: string;
	interfaceType?: string;
	shouldDisplay?: (response: JourneyResponse) => boolean;
	autocomplete?: string;
	// is this question editable? defaults to true
	editable?: boolean;
	// static view data for this question
	viewData?: Object<string, any>;
	variables?: Array<string>;
}

export interface OptionsQuestionParameters extends QuestionParameters {
	options: Array<Option>;
}

export type MethodOverrides = Record<string, Function>;
