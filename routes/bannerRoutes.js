const express = require('express');
const router = express.Router();
const { getBanners, createBanner,getBannerss,getAllData } = require('../controllers/bannerController');

// GET /api/admin/banner - Fetch all banners
// router.get('/banner', getBanners);

// router.get('/banners', getBannerss);

router.get('/', getAllData);



// POST /api/admin/banner - Create a new banner
router.post('/banner', createBanner);

module.exports = router;
