const NumberEntryQuestion = require('./question');

describe('number-entry/question', () => {
	const section = { segment: 'test-section', name: 'Test section' };

	const buildJourney = (answerVal) => {
		return {
			response: { answers: { age: answerVal } },
			getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
			getBackLink: jest.fn().mockReturnValue('/back'),
			getCurrentQuestionUrl: jest.fn().mockReturnValue('/current'),
			getSection: jest.fn().mockReturnValue(section)
		};
	};

	const buildQuestion = () =>
		new NumberEntryQuestion({
			title: 'Your age',
			question: 'What is your age?',
			fieldName: 'age',
			suffix: 'years',
			label: 'Age'
		});

	it('constructor stores label and suffix', () => {
		const q = buildQuestion();
		expect(q.label).toBe('Age');
		expect(q.suffix).toBe('years');
	});

	describe('prepQuestionForRendering', () => {
		it('returns 0 as string', () => {
			const q = buildQuestion();
			const journey = buildJourney(0);
			const vm = q.prepQuestionForRendering({ section, journey });
			expect(vm.answer).toBe('0');
		});

		it('keeps numeric answer as number', () => {
			const q = buildQuestion();
			const journey = buildJourney(42);
			const vm = q.prepQuestionForRendering({ section, journey });
			expect(vm.answer).toBe(42);
		});

		it('returns empty string when answer missing', () => {
			const q = buildQuestion();
			const journey = buildJourney(undefined);
			const vm = q.prepQuestionForRendering({ section, journey });
			expect(vm.answer).toBe('');
		});
	});

	describe('formatAnswerForSummary', () => {
		it("doesn't capitalise", () => {
			const q = buildQuestion();
			const journey = buildJourney(5);
			const result = q.formatAnswerForSummary('test-section', journey, 'a B C');
			expect(result).toEqual([
				expect.objectContaining({
					key: 'Your age',
					value: 'a B C'
				})
			]);
		});
	});
});
