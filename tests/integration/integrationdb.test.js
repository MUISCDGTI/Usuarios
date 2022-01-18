const User = require('../../users');
const mongoose = require('mongoose');
const dbConnect = require('../../db');

describe('Users DB connection', () => {
  beforeAll(() => {
    return dbConnect();
  }, 30000);
  it('Should perform all basic db operations', (done) => {
    const user = new User({ name: '______test_name', email: '______test_email@test.com', password: '______test_pasword' });
    user.save((errSave, savedUser) => {
      expect(errSave).toBeNull();
      const _id = savedUser._id;
      User.find({ _id, name: '______test_name', email: '______test_email@test.com' }, (errFind, users) => {
        expect(errSave).toBeNull();
        expect(users.length).toBeTruthy();
        User.findByIdAndDelete(_id, (errDelete) => {
          expect(errDelete).toBeNull();
          done();
        });
      });
    });
  });
  afterAll((done) => {
    mongoose.connection.close(done);
  });
});