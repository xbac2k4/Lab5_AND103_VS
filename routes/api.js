const express = require('express');
const router = express.Router();
const database = require('../config/connect');
const DistributorModel = require('../model/Distributor');
const unidecode = require('unidecode');


router.get('/get-list', async (req, res) => {
    database.connect();
    try {
        let distributor = await DistributorModel.find().populate();
        console.log(distributor);
        res.json({
            "status": 200,
            "messenger": "Danh sách distributor",
            "data": distributor
        })
    } catch (error) {
        console.log(error);
    }
    
    // res.send(distributor)
})
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
router.get('/search-distributor', async (req, res) => {
    const key = req.query.key;
    try {
        // const searchTitle = unidecode(title);
        // const searchNameWithAccents = removeAccents(title);
        // const results = await DistributorModel.find({
        //     $or: [
        //         // { title: { "$regex": title, "$options": "i" } },
        //         // { title: { "$regex": searchTitle, "$options": "i" } }
        //         { title: { $regex: new RegExp(title, "i") } },
        //         { title: { $regex: new RegExp(searchTitle, "i") } }
        //     ]
        // });
        const data = await DistributorModel.find({ title: { $regex: new RegExp(key, "i") } })
        .sort({ createdAt: -1 });
        if (data) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
        // res.send(results);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi tìm kiếm" });
    }
});
// Thêm sản phẩm
router.post("/add-distributor", async (req, res) => {
    database.connect();
    try {
        const { title } = req.body;

        // Tạo một instance mới của model sản phẩm
        const newDistributor = new DistributorModel({
        //    title
            title: title
        });

        // Lưu sản phẩm mới vào cơ sở dữ liệu
        const savedDistributor = await DistributorModel.create(newDistributor);

        res.status(201).json(savedDistributor); // Trả về sản phẩm vừa được tạo thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sửa sản phẩm
router.put("/update-distributor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const updatedDistributor = await DistributorModel.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        if (!updatedDistributor) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(updatedDistributor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa sản phẩm
router.delete("/delete-distributor/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDistributor = await DistributorModel.findByIdAndDelete(id);

        if (!deletedDistributor) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;