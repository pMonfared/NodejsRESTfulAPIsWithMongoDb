
const request = require('supertest');
const { User } = require('../../../models/user');
const { Course } = require('../../../models/course');

let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Course.remove({});
        await server.close();
     });

    let token;

    const exec = () => {
       return request(server)
       .post('/api/courses')
       .set('x-auth-token',token)
       .send({
            name: 'test 1',
            category: 'mobile',
            author: 'author test 1',
            tags: ['tg test 1', 'tg test 2'],
            isPublished: true,
            price: 12
          })
    }

    beforeEach(() => { 
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();
        
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid', async () => {
        const res = await exec();
         
        expect(res.status).toBe(200);
    })
});