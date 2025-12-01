import { JourneyResponse } from './journey-response';
import { QuestionVariables } from './question';
import BaseValidator from './validator/base-validator';

type QuestionTypes =
	| 'checkbox'
	| 'multi-file-upload'
	| 'boolean'
	| 'radio'
	| 'date'
	| 'text-entry'
	| 'single-line-input'
	| 'multi-field-input'
	| 'number'
	| 'site-address'
	| 'unit-option'
	| 'list-add-more'
	| 'content'
	| 'dynamic-radio'
	// strictly for add more sub question type
	// todo refactor list add mores so there's no sub question
	| 'case'
	| 'address'
	| 'listed-building'
	| 'individual';

interface CommonQuestionProps {
	type: QuestionTypes;
	title: string;
	question: string;
	viewFolder?: string;
	fieldName: string;
	url?: string;
	pageTitle?: string;
	description?: string;
	label?: string;
	validators?: BaseValidator[];
	html?: string;
	hint?: string;
	shouldDisplay?: (response: JourneyResponse) => boolean;
	variables?: QuestionVariables[];
}

export type OptionWithoutDivider = {
	text: string;
	value: string;
	hint?: object;
	checked?: boolean | undefined;
	attributes?: Record<string, string>;
	behaviour?: 'exclusive';
	conditional?:
		| {
				question: string;
				type: string;
				fieldName: string;
				inputClasses?: string;
				html?: string;
				value?: unknown;
				label?: string;
				hint?: string;
		  }
		| {
				html: string;
		  };
	conditionalText?: {
		html: string;
	};
};

export type Option = OptionWithoutDivider | { divider: string };

interface InputField {
	fieldName: string;
	label: string;
	hint?: string;
	formatJoinString?: string; // optional property, used by formatAnswerForSummary (eg task list display), effective default to line break
	attributes?: Record<string, string>;
}

/*
 * UnitOptions are the options displayed in the radio format - in this case the value
 * represents the unit.
 * Conditionals must be used to capture the relevant quantity.
 * Each conditional must have a fieldName which uses the conditionalFieldName from the
 * UnitOptionEntryQuestion object as a base, followed by an underscore and unit reference
 * eg 'siteAreaSquareMetres_hectares' - this is required for validation and saving to the DB
 */
interface UnitOption {
	text: string;
	value: string;
	hint?: object;
	checked?: boolean | undefined;
	attributes?: Record<string, string>;
	behaviour?: 'exclusive';
	conditional:
		| {
				fieldName: string;
				suffix: string;
				value?: unknown;
				label?: string;
				hint?: string;
				conversionFactor?: number;
		  }
		| {
				html: string;
		  };
	validator: {
		min: number;
		max: number;
		regexps: RegexValidationProps[];
	};
}

type RegexValidationProps = {
	regex: Regex;
	regexMessage: string;
};

type CheckboxQuestionProps = CommonQuestionProps & {
	type: 'checkbox';
	options: Option[];
};

type MultiFileUploadQuestionProps = CommonQuestionProps & {
	type: 'multi-file-upload';
	documentType: { name: string };
	actionHiddenText?: string;
	showSkipLink?: boolean;
};

type BooleanQuestionProps = CommonQuestionProps & {
	type: 'boolean';
	options?: Option[];
	interfaceType?: 'checkbox' | 'radio';
};

type RadioQuestionProps = CommonQuestionProps & {
	type: 'radio';
	options: Option[];
	legend?: string;
};

type DateQuestionProps = CommonQuestionProps & {
	type: 'date';
};

type TextEntryQuestionProps = CommonQuestionProps & {
	type: 'text-entry';
	label?: string;
	textEntryCheckbox?: {
		header: string;
		name: string;
		text: string;
	};
};

type SingleLineInputQuestionProps = CommonQuestionProps & {
	type: 'single-line-input';
	label?: string;
	inputAttributes?: Record<string, string>;
};

type MultiFieldInputQuestionProps = CommonQuestionProps & {
	type: 'multi-field-input';
	label?: string;
	inputAttributes?: Record<string, string>;
	inputFields: InputField[];
	formatType?: 'contactDetails' | 'standard';
};

type NumberEntryQuestionProps = CommonQuestionProps & {
	type: 'number';
	label?: string;
	suffix?: string;
};

type SiteAddressQuestionProps = CommonQuestionProps & {
	type: 'site-address';
};

type UnitOptionEntryQuestionProps = CommonQuestionProps & {
	type: 'unit-option';
	conditionalFieldName: string;
	options: UnitOption[];
	label?: string;
};

export type SubQuestionProps = CommonQuestionProps & {
	type: 'case' | 'address' | 'listed-building' | 'individual';
	viewFolder: string;
};

type ListAddMoreQuestionProps = CommonQuestionProps & {
	type: 'list-add-more';
	subQuestionProps: SubQuestionProps;
	subQuestionLabel?: string;
	subQuestionTitle?: string;
	subQuestionFieldLabel?: string;
	subQuestionInputClasses?: string;
	width?: string;
};
export type ContentQuestionProps = CommonQuestionProps & {
	type: 'content';
	backLinkText?: string;
};

type DynamicRadioProps = CommonQuestionProps & {
	type: 'dynamic-radio';
	dynamicOptionsVariable: string;
	legend?: string;
};

export type QuestionProps =
	| CheckboxQuestionProps
	| MultiFileUploadQuestionProps
	| BooleanQuestionProps
	| RadioQuestionProps
	| DateQuestionProps
	| TextEntryQuestionProps
	| SingleLineInputQuestionProps
	| MultiFieldInputQuestionProps
	| NumberEntryQuestionProps
	| SiteAddressQuestionProps
	| UnitOptionEntryQuestionProps
	| ListAddMoreQuestionProps
	| ContentQuestionProps
	| DynamicRadioProps;
