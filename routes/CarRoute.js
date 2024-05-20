const express = require('express');
const router = express.Router();
const CarsModel = require('../models/Car');
const multer = require("multer")
const path = require('path');
const fs = require('fs');
router.use(express.json());
const cloudinary = require('../utils/cloudinary');

//multer


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage })




router.get('/fetchCars', async (req, res) => {
    try {
        const cars = await CarsModel.find({});
        res.json({ data: cars });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




router.get('/fetchCar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const car = await CarsModel.findById(id);

        if (!car) {
            return res.status(404).json({ error: 'car not found' });
        }
        res.json({ data: car });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// router.post('/createCar', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No image uploaded' });
//         }
        
//         const data = JSON.parse(req.body.data);
//         const car = new CarsModel(data);
//         const savedcar = await car.save();
//         res.status(201).json({ data: savedcar });

//     } catch (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json({ error: 'Image upload failed' });
//         }
//         res.status(500).json({ error: err.message });
//     }

// });



router.post('/createCar', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.url;
        const data = JSON.parse(req.body.data);
        data.image = image;

        const car = new CarsModel(data);
        const savedcar = await car.save();
        res.status(201).json({ data: savedcar });
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        }
        return res.status(500).json({ error: err.message });
    }
});













router.delete('/deleteCarById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const car = await CarsModel.findByIdAndDelete(id);

        if (!car) {
            return res.status(404).json({ error: 'car not found' });
        }

        if (car.image) {
            const imagePath = path.join(__dirname, '../images', car.image);
            console.log(imagePath);
            
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                console.log('Image does not exist:', imagePath);
            }
        }

        res.json({ message: 'car deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/updateCarsById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const updatedcar = await CarsModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedcar) {
            return res.status(404).json({ error: 'car not found' });
        }

        res.json({ data: updatedcar });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
