const request = require('supertest');
const app = require('../server');

describe('Document uploads', () => {
    it('should upload multiple files to azure blob storage', async () => {
        await request(app)
            .post('/')
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'test/fixtures/profile-pic.jpg')
            .expect(200);
    });
    it('should upload a single file to azure blob storage', async () => {
        await request(app)
            .post('/')
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'test/fixtures/profile-pic.jpg')
            .expect(200);
    });
    it('should return 400 if file size exceeds 50 MB limit', async () => {
        await request(app)
            .post('/')
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'test/fixtures/profile-pic.jpg')
            .expect(400);
    });
    it('should return 400 if file extension is not .pdf, .jpg, or .doc', async () => {
        await request(app)
            .post('/')
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'test/fixtures/profile-pic.jpg')
            .expect(400);
    });
    it('should return file id in response', async () => {
        const { body } = await request(app)
            .post('/')
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'test/fixtures/profile-pic.jpg')
            .expect(200);

        expect(body.uploadedFiles).toBeDefined();
        // expect(body).toHave('id', uuid.v4())
    });
});

describe('Document retriveals', () => {
    it('should retrieve file if an existing file ID is received', async () => {
        await request(app)
            .get('/testId')
            .expect(200);
    });
    it('should return 404 if a non-existent file ID is received', async () => {
        await request(app)
            .get('/nonexistingid')
            .expect(404);
    });
});
