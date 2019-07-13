/* eslint-disable no-undef */
import chai from 'chai';
import 'chai/register-expect';
import chaihttp from 'chai-http';
import fs from 'fs';
import app from '../src/app';

chai.use(chaihttp);

describe('car ads', () => {
  const validUser = {
    email: 'temi@gmail.com',
    password: 'biodun',
  };
  it('sign a user in then post a car ad', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(validUser)
      .end((err, res) => {
        if (err) {
          console.log(err.message);
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .post('/api/v1/car')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', bearerToken)
          .field('state', 'used')
          .field('price', 50000)
          .field('status', 'available')
          .field('manufacturer', 'toyota')
          .field('model', 'camry')
          .field('body_type', 'car')
          .attach('car_image', fs.readFileSync('./image/new.jpg'), 'new.jpg')
          .end((err1, res1) => {
            if (err1) {
              console.log(err1.message);
              return;
            }
            expect(res1.body).to.have.a.status(201);
            expect(data).to.have.a.property('state');
            expect(data)
              .to.have.a.property('status')
              .and.to.be.eql('available');
            expect(data).to.have.a.property('price');
            expect(data).to.have.a.property('manufacturer');
            expect(data).to.have.a.property('model');
            expect(data).to.have.a.property('body_type');
            expect(data).to.have.a.property('created_on');
            done();
          });
      });
  });
  it('should update price of car ad', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          console.log(err.message);
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .patch('/api/v1/car/10/price')
          .set('Authorization', bearerToken)
          .send({
            price: 70000,
          })
          .end((err2, res2) => {
            if (err2) {
              console.log(err);
              return;
            }
            expect(res2.body).to.have.status(200);
            expect(res2.body.data).have.a.property('id');
            expect(res2.body.data).have.a.property('email');
            expect(res2.body.data).have.a.property('created_on');
            expect(res2.body.data).have.a.property('manufacturer');
            expect(res2.body.data).have.a.property('price');
            expect(res2.body.data).have.a.property('state');
            expect(res2.body.data).have.a.property('status');
            done();
          });
      });
  });
  it('should update car status to sold', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          console.log(err.message);
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .patch('/api/v1/car/10/status')
          .set('Authorization', bearerToken)
          .send({
            status: 'sold',
          })
          .end((err2, res2) => {
            if (err2) {
              console.log(err);
              return;
            }
            expect(res2.body).to.have.status(200);
            expect(res2.body.data).have.a.property('id');
            expect(res2.body.data).have.a.property('email');
            expect(res2.body.data).have.a.property('created_on');
            expect(res2.body.data).have.a.property('manufacturer');
            expect(res2.body.data).have.a.property('price');
            expect(res2.body.data).have.a.property('state');
            expect(res2.body.data).have.a.property('status');
            done();
          });
      });
  });
  it('should view car by id', (done) => {
    chai
      .request(app)
      .get('/api/v1/car/10')
      .end((err, res) => {
        if (err) {
          console.log(err.message);
        }
        expect(res.body).to.have.status(200);
        expect(res.body.data).have.a.property('id');
        expect(res.body.data).have.a.property('owner');
        expect(res.body.data).have.a.property('created_on');
        expect(res.body.data)
          .have.a.property('state')
          .and.to.be.a('string');
        expect(res.body.data)
          .have.a.property('status')
          .and.to.be.a('string');
        expect(res.body.data).have.a.property('price');
        expect(res.body.data)
          .have.a.property('manufacturer')
          .and.to.be.a('string');
        expect(res.body.data)
          .have.a.property('model')
          .and.to.be.a('string');
        expect(res.body.data)
          .have.a.property('body_type')
          .and.to.be.a('string');
        expect(res.body.data).have.a.property('car_image');
        done();
      });
  });
  it('should get all available cars', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .get('/api/v1/car')
          .set('Authorization', bearerToken)
          .query({ status: 'available' })
          .end((err2, res2) => {
            if (err2) {
              console.log(err2.message);
            }
            expect(res2.body).to.have.status(200);
            expect(res2.body).to.be.a('object');
            expect(res2.body.data).to.be.an('array');
            done();
          });
      });
  });
  it('should get all sold and available cars', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .get('/api/v1/car')
          .set('Authorization', bearerToken)
          .end((err2, res2) => {
            if (err2) {
              console.log(err2.message);
            }
            expect(res2.body).to.have.status(200);
            expect(res2.body).to.be.a('object');
            expect(res2.body.data).to.be.an('array');
            done();
          });
      });
  });
  it('should get all car within a price range', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .get('/api/v1/car')
          .query({
            status: 'available',
            min_price: 40000,
            max_price: 150000,
          })
          .set('Authorization', bearerToken)
          .end((err2, res2) => {
            if (err2) {
              console.log(err2.message);
              return;
            }
            expect(res2.body).to.have.status(200);
            expect(res2.body).to.be.a('object');
            expect(res2.body.data).to.be.an('array');
            done();
          });
      });
  });
  it('admin delete car by id', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temi@gmail.com',
        password: 'biodun',
      })
      .end((err, res) => {
        if (err) {
          return;
        }
        const { token } = res.body.data;
        const bearerToken = `Bearer ${token}`;
        chai
          .request(app)
          .delete('/api/v1/car/11')
          .set('Authorization', bearerToken)
          .end((err2, res2) => {
            if (err2) {
              console.log(err2.message);
              return;
            }
            expect(res2.body).to.have.status(200);
            done();
          });
      });
  });
});