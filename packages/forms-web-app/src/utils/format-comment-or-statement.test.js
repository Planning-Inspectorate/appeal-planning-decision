const {
	formatFinalComment,
	formatStatement,
	formatComments
} = require('./format-comment-or-statement');
const { formatDocumentDetails } = require('@pins/common');
jest.mock('@pins/common', () => ({
	formatDocumentDetails: jest.fn()
}));
describe('formatCommentOrStatement', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	describe('formatFinalComment', () => {
		it('formats final comments with documents', () => {
			const finalComments = [
				{
					comments: 'This is a final comment.',
					FinalCommentDocuments: [
						{ Document: { id: 'doc1', filename: 'doc1.txt' } },
						{ Document: { id: 'doc2', filename: 'doc2.txt' } }
					]
				}
			];
			formatDocumentDetails.mockReturnValue('formatted-documents');
			const result = formatFinalComment(finalComments);
			expect(result).toEqual([
				{
					key: { text: 'Final Comments 1' },
					value: {
						text: 'This is a final comment.',
						truncatedText: 'This is a final comment.',
						truncated: false,
						documents: 'formatted-documents'
					}
				}
			]);
			expect(formatDocumentDetails).toHaveBeenCalledWith(
				[
					{ id: 'doc1', filename: 'doc1.txt' },
					{ id: 'doc2', filename: 'doc2.txt' }
				],
				'finalComment'
			);
		});
		it('truncates final comments longer than 150 characters', () => {
			const finalComments = [
				{
					comments: 'A'.repeat(160),
					FinalCommentDocuments: []
				}
			];
			const result = formatFinalComment(finalComments);
			expect(result).toEqual([
				{
					key: { text: 'Final Comments 1' },
					value: {
						text: 'A'.repeat(160),
						truncatedText: 'A'.repeat(150) + '...',
						truncated: true,
						documents: 'formatted-documents'
					}
				}
			]);
		});
	});
	describe('formatStatement', () => {
		it('formats statements with documents', () => {
			const statements = [
				{
					statement: 'This is a statement.',
					StatementDocuments: [{ Document: { id: 'doc1', filename: 'doc1.txt' } }]
				}
			];
			formatDocumentDetails.mockReturnValue('formatted-documents');
			const result = formatStatement(statements);
			expect(result).toEqual([
				{
					key: { text: 'Statement 1' },
					value: {
						text: 'This is a statement.',
						truncatedText: 'This is a statement.',
						truncated: false,
						documents: 'formatted-documents'
					}
				}
			]);
			expect(formatDocumentDetails).toHaveBeenCalledWith(
				[{ id: 'doc1', filename: 'doc1.txt' }],
				'appealStatement'
			);
		});
		it('truncates statements longer than 150 characters', () => {
			const statements = [
				{
					statement: 'A'.repeat(200),
					StatementDocuments: []
				}
			];
			const result = formatStatement(statements);
			expect(result).toEqual([
				{
					key: { text: 'Statement 1' },
					value: {
						text: 'A'.repeat(200),
						truncatedText: 'A'.repeat(150) + '...',
						truncated: true,
						documents: 'formatted-documents'
					}
				}
			]);
		});
	});
	describe('formatComments', () => {
		it('formats and sorts interested party comments by date', () => {
			const comments = [
				{ comment: 'First comment', createdAt: '2024-10-15T12:00:00Z' },
				{ comment: 'Second comment', createdAt: '2024-10-14T12:00:00Z' }
			];
			const result = formatComments(comments);
			expect(result).toEqual([
				{
					key: { text: 'Interested Party 1' },
					value: {
						text: 'Second comment',
						truncatedText: 'Second comment',
						truncated: false,
						documents: undefined
					}
				},
				{
					key: { text: 'Interested Party 2' },
					value: {
						text: 'First comment',
						truncatedText: 'First comment',
						truncated: false,
						documents: undefined
					}
				}
			]);
		});
		it('truncates interested party comments longer than 150 characters', () => {
			const comments = [
				{
					comment: 'A'.repeat(200),
					createdAt: '2024-10-15T12:00:00Z'
				}
			];
			const result = formatComments(comments);
			expect(result).toEqual([
				{
					key: { text: 'Interested Party 1' },
					value: {
						text: 'A'.repeat(200),
						truncatedText: 'A'.repeat(150) + '...',
						truncated: true,
						documents: undefined
					}
				}
			]);
		});
	});
});
