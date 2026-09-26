require('dotenv').config();
const mongoose = require('mongoose');
const SkinAnalysis = require('./src/models/SkinAnalysis');
const PhotoAnalysis = require('./src/models/PhotoAnalysis');
const User = require('./src/models/User');
const { getSkinJourney } = require('./src/controllers/journeyController');
const { getHistory: getSkinHistory, getAnalysisById: getSkinById } = require('./src/controllers/analysisController');
const { getHistory: getPhotoHistory, getAnalysisById: getPhotoById } = require('./src/controllers/photoAnalysisController');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const runTests = async () => {
  try {
    // 1. Connect to local memory DB or actual test DB
    // Assuming we use process.env.MONGO_URI from .env
    if (!process.env.MONGO_URI) {
      console.log('Skipping tests because MONGO_URI is not set.');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for testing.');

    // 2. Setup mock users
    const user1 = await User.create({ name: 'User1', email: 'user1@test.com', passwordHash: 'hash123' });
    const user2 = await User.create({ name: 'User2', email: 'user2@test.com', passwordHash: 'hash123' });

    // 3. Setup mock data
    const sa1 = await SkinAnalysis.create({ userId: user1._id, answers: {}, skinType: 'Oily', sensitivity: 'High', scores: { hydration: 5 } });
    const sa2 = await SkinAnalysis.create({ userId: user2._id, answers: {}, skinType: 'Dry', sensitivity: 'Low', scores: { hydration: 3 } });

    const pa1 = await PhotoAnalysis.create({ userId: user1._id, imageQuality: { usable: true }, faceDetected: true, observations: [] });

    // Mock Express Req/Res
    const mockRes = () => {
      const res = {};
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => { res.data = data; return res; };
      return res;
    };

    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
      if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
      }
    };

    // TEST: Authenticated user can retrieve history & newest first & only current user's
    let req = { user: { id: user1._id } };
    let res = mockRes();
    await getSkinHistory(req, res);
    assert(res.statusCode === 200 && res.data.length === 1 && res.data[0].skinType === 'Oily', 'Skin History: Returns only user1 records');

    // TEST: Detail endpoint works
    req = { user: { id: user1._id }, params: { id: sa1._id } };
    res = mockRes();
    await getSkinById(req, res);
    assert(res.statusCode === 200 && res.data.skinType === 'Oily', 'Skin Detail: Fetches own record correctly');

    // TEST: Another user's record cannot be retrieved
    req = { user: { id: user1._id }, params: { id: sa2._id } };
    res = mockRes();
    await getSkinById(req, res);
    assert(res.statusCode === 404, 'Skin Detail: Cannot fetch another user record');

    // TEST: Photo history returns only current user's records
    req = { user: { id: user1._id } };
    res = mockRes();
    await getPhotoHistory(req, res);
    assert(res.statusCode === 200 && res.data.length === 1, 'Photo History: Returns only user1 records');

    // TEST: Photo detail endpoint works
    req = { user: { id: user1._id }, params: { id: pa1._id } };
    res = mockRes();
    await getPhotoById(req, res);
    assert(res.statusCode === 200 && res.data.imageQuality.usable === true, 'Photo Detail: Fetches own record correctly');

    // TEST: Another user's photo result cannot be retrieved
    req = { user: { id: user2._id }, params: { id: pa1._id } };
    res = mockRes();
    await getPhotoById(req, res);
    assert(res.statusCode === 404, 'Photo Detail: Cannot fetch another user photo record');

    // TEST: Combined endpoint returns latest for user 1
    req = { user: { id: user1._id } };
    res = mockRes();
    await getSkinJourney(req, res);
    assert(res.statusCode === 200 && res.data.latestSkinAnalysis.skinType === 'Oily' && res.data.latestPhotoAnalysis.imageQuality.usable === true, 'Skin Journey: Combined endpoint returns correct latest data');

    console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);

    // Cleanup
    await User.deleteMany({ email: { $in: ['user1@test.com', 'user2@test.com'] } });
    await SkinAnalysis.deleteMany({ _id: { $in: [sa1._id, sa2._id] } });
    await PhotoAnalysis.deleteMany({ _id: pa1._id });

    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
};

runTests();
