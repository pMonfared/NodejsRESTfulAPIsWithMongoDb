const request = require('supertest');
const { Course } = require('../../../models/course');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/courses', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Course.remove({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all courses', async () => { 
            await Course.collection.insertMany([
                {
                    name: "test 1",
                    category: 'mobile',
                    author: 'author test 1',
                    tags: ['tg test 1', 'tg test 2'],
                    isPublished: true,
                    price: 12
                },
                {
                    name: "test 2",
                    category: 'web',
                    author: 'author test 2',
                    tags: ['tg test 3', 'tg test 4'],
                    isPublished: true,
                    price: 20
                }
            ])

            const res = await request(server).get('/api/courses');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=> g.name == 'test 1')).toBeTruthy();
            expect(res.body.some(g=> g.name == 'test 2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => { 
       it('should return a course if valid id is passed', async () => {
           const course = new Course({
             name: "test 1",
             category: 'mobile',
             author: 'author test 1',
             tags: ['tg test 1', 'tg test 2'],
             isPublished: true,
             price: 12
           });
           await course.save();

           const res = await request(server).get('/api/courses/' + course._id);

           expect(res.status).toBe(200);
           expect(res.body).toHaveProperty('name', course.name);
       });

       it('should return 404 if invalid id is passed', async () => {
        const res = await request(server).get('/api/courses/1');

        expect(res.status).toBe(404);
       });

       it('should return 404 if no course with the given id exist', async () => {
        const res = await request(server).get('/api/courses/'+ mongoose.Types.ObjectId());

        expect(res.status).toBe(404);
       });

    });

    describe('POST /', () => {
        
        let token;
        let name;

        const exec = async () => {
            return await request(server)
               .post('/api/courses')
               .set('x-auth-token',token)
               .send({
                name,
                category: 'mobile',
                author: 'author test 1',
                tags: ['tg test 1', 'tg test 2'],
                isPublished: true,
                price: 12
              });
        }

        beforeEach(() => { 
            token = new User().generateAuthToken();
            name = 'test 1'
        })
 

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if course is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if course is more than 255 characters', async () => {
            name = new Array(260).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the course if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            const course = await Course.find({ name: 'test 1'});
            expect(course).not.toBeNull();
        });

        it('should retrun the course if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'test 1');
        });
    });

    describe('PUT /', () => {
        let token;
        let newName;
        let course;
        let id; 
        const exec = async () => {
            return await request(server)
               .put('/api/courses/' + id)
               .set('x-auth-token',token)
               .send({
                name: newName,
                category: 'mobile',
                author: 'author test 1',
                tags: ['tg test 1', 'tg test 2'],
                isPublished: true,
                price: 12
              });
        }

        beforeEach(async () => { 
             // Before each test we need to create a genre and 
             // put it in the database.      
             course = new Course({
                    name: 'test 1',
                    category: 'mobile',
                    author: 'author test 1',
                    tags: ['tg test 1', 'tg test 2'],
                    isPublished: true,
                    price: 12
                  });

             await course.save();
            
            token = new User().generateAuthToken();
            id = course._id;
            newName = 'test 1 updated'; 
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
          });
      
          it('should return 400 if course name is less than 5 characters', async () => {
            newName = '1234'; 
            
            const res = await exec();
      
            expect(res.status).toBe(400);
          });
      
          it('should return 400 if course name is more than 50 characters', async () => {
            newName = new Array(260).join('a');
      
            const res = await exec();
      
            expect(res.status).toBe(400);
          });
      
          it('should return 404 if id is invalid', async () => {
            id = 1;
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should return 404 if course with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should update the course if input is valid', async () => {
            await exec();
      
            const updatedCourse = await Course.findById(course._id);
      
            expect(updatedCourse.name).toBe(newName);
          });
      
          it('should return the updated course if it is valid', async () => {
            const res = await exec();
      
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
          });
    })

    describe('DELETE /:id', () => {
        let token;
        let course;
        let id; 
        const exec = async () => {
            return await request(server)
               .delete('/api/courses/' + id)
               .set('x-auth-token',token)
               .send();
        }

        beforeEach(async () => { 
             // Before each test we need to create a genre and 
             // put it in the database.      
             course = new Course({
                    name: 'test 1',
                    category: 'mobile',
                    author: 'author test 1',
                    tags: ['tg test 1', 'tg test 2'],
                    isPublished: true,
                    price: 12
                  });

             await course.save();
            
            token = new User({ isAdmin: true }).generateAuthToken();
            id = course._id;
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
          });
      
          it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken(); 
      
            const res = await exec();
      
            expect(res.status).toBe(403);
          });
      
          it('should return 404 if id is invalid', async () => {
            id = 1; 
            
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should return 404 if no course with the given id was found', async () => {
            id = mongoose.Types.ObjectId();
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should delete the course if input is valid', async () => {
            await exec();
      
            const courseInDb = await Course.findById(id);
      
            expect(courseInDb).toBeNull();
          });
      
          it('should return the removed course', async () => {
            const res = await exec();
      
            expect(res.body).toHaveProperty('_id', course._id.toHexString());
            expect(res.body).toHaveProperty('name', course.name);
          });

    })
});