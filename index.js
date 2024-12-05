const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const port = 4052;

app.use(bodyparser.json());


app.listen(port, () => {
    try {
        console.log(`server is running ${port}`);
        mongoose.connect(
            "mongodb+srv://arjunsuresh410:arjunsuresh410@cluster0.kbzr3.mongodb.net/db-basics2"
        );
        console.log("db connection established");
    } catch (err) {
        console.error(err);
    }
})

//Admin schemaStructure

const adminschemastructure = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "please use a valid email address"],
    },
    adminPassword: {
        type: String,
        unique: true,
        required: true,
    }
})

const Admin = mongoose.model("admin", adminschemastructure)

//Admin post by save() method

app.post("/Admin", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        let admin = new Admin({
            adminName: Name,
            adminEmail: Email,
            adminPassword: Password,
        })

        await admin.save();

        res.send({ message: "Admin details  inserted " })

    } catch (error) {
        console.error(error);

    }
})

// Admin Post by insertOne()

app.post("/AdmininsertOne", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        const result = await mongoose.connection.collection('admins').insertOne({
            adminName: Name,
            adminEmail: Email,
            adminPassword: Password
        });
        res.send({ message: "Admin details  inserted " })

    } catch (error) {
        console.error(error);

    }
})

// Admin Post by insertMany

app.post("/AdmininsertMany", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        const admin = [
            {
                adminName: Name,
                adminEmail: Email,
                adminPassword: Password
            },
            {
                adminName: "Name2",
                adminEmail: "Email2@gmail.com",
                adminPassword: "Password2"
            }
        ]
        const result = await mongoose.connection.collection('admins').insertMany(admin);
        res.send({ message: "Admin details  inserted " })

    } catch (error) {
        console.error(error);

    }
})


//Admin Get

app.get("/Admin", async (req, res) => {
    try {
        const admin = await Admin.find();
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.send(admin).status(200);
        }
    } catch (err) {
        console.error("Error Finding Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Admin Get By ID

app.get("/Admin/:id", async (req, res) => {
    try {
        const id = req.params.id
        const admin = await Admin.findById(id);
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.send(admin).status(200);
        }
    } catch (err) {
        console.error("Error Finding Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Admin Get By Filter

app.get("/AdminByFilter/:filter", async (req, res) => {
    try {
        const filter = req.params.filter
        const admin = await Admin.find({ adminName: filter });
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.send(admin).status(200);
        }
    } catch (err) {
        console.error("Error Finding Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Admin Get by using find One

app.get("/AdminByOne/:value", async (req, res) => {
    try {
        const value = req.params.value
        const admin = await Admin.findOne({ adminEmail: value })
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.send(admin).status(200);
        }
    } catch (err) {
        console.error("Error Finding Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Admin Delete by Id

app.delete("/Admin/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deletedAdmin });
        }
    } catch (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Admin  delete many

app.delete("/AdminMany/:name", async (req, res) => {
    try {
        const name = req.params.name;
        // const email = req.params.email;
        const deletedAdmin = await Admin.deleteMany({ adminName: name });

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deletedAdmin });
        }
    } catch (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Admin Delete One

app.delete("/AdminDeleteOne/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const deletedAdmin = await Admin.deleteOne({ adminName: name });
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deletedAdmin });
        }
    } catch (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Admin Find one Delete

app.delete("/AdminFindOneDelete/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const deletedAdmin = await Admin.findOneAndDelete({
            adminName: name
        },
            {
                sort: { _id: -1 },                       // Sort by newest first
                projection: { adminName: 1 }
            });
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deletedAdmin });
        }
    } catch (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Admin update by id



app.put("/Admin/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const { adminName, adminEmail, adminPassword } = req.body;
        const admin = await Admin.findById(id);
        if (admin) {

            const updatedDoc = await Admin.findByIdAndUpdate(
                id,
                { adminName, adminEmail, adminPassword },
                { new: true }
            );
            res.send({ msg: "Admin Changed", updatedDoc });

        } else {
            res.send("Admin Not Found");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//Admin UpdateMany 

app.put("/AdminUpdateMany/:email", async (req, res) => {
    try {
        const email = req.params.email
        const { adminName, adminEmail, adminPassword } = req.body;
        const admin = await Admin.findOne({ adminEmail: email });
        if (admin) {
            const updatedAdmin = await Admin.updateMany(
                { adminEmail: email },
                { adminName, adminEmail, adminPassword },
                { new: true }
            )
            res.send({ message: "Admin updated ", updatedAdmin });
        } else {
            res.send({ messgae: "Admin not found" });

        }
    } catch (err) {
        console.error(err);
        res.send("server error").status(500);
    }
})


//   Admin bulkWrite()

//.............Admin bulkwrite is not working beacuse it haven't many fields to update. i use bulkwrite in booking ....................................


// app.put("/AdminbulkWrite/:name/:email", async (req,res) => {
//     const name = req.params.name;
//     const email = req.params.email;
//     const {adminName,adminEmail,adminPassword} = req.body;

//     const updatedAdmin = await Admin.bulkWrite([
//         { updateOne:{ filter:{ adminEmail:email }, update: { $set: {adminPassword } }}},

//         {updateMany:{ filter:{adminName:name}, update:{$set:{adminPassword}}}}
//     ])
//     res.send({message:"Updated", updatedAdmin})
// })

//..................................................................................................


//Admin Update by using save()

app.put("/AdminBySave/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { adminName, adminEmail, adminPassword } = req.body;
        const updatedDetails = await Admin.findById(id).then(doc => {
            doc.adminEmail = adminEmail;
            doc.adminName = adminName;
            doc.adminPassword = adminPassword;
            return doc.save();
        })
        if (updatedDetails) {
            res.send({ message: "updated succefully", updatedDetails })
        }
        else {
            res.send({ message: "error found" })
        }
    } catch (err) {
        console.error(err);
    }
})

//Admin updated  by findOneAndUpdate()....................patch method

app.patch("/AdminFindOne/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const { adminPassword } = req.body;

        const findAdmin = await Admin.findOne({ adminEmail: email });
        if (findAdmin) {
            let updatedData = await Admin.findOneAndUpdate(
                { adminEmail: email },
                { adminPassword },
                { new: true }
            )
            res.send({ message: "email updated", updatedData }).status(200);
        } else {
            res.send({ message: "page not found" }).status(404);
        }
    } catch (err) {
        console.error(err);
        res.send({ messgae: "internal server error" }).status(500);
    }

})

// Admin Update by replace .....

app.put("/AdminReplaceOne/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const { adminName, adminEmail, adminPassword } = req.body;

        const updatedData = await Admin.replaceOne(
            { adminName: name },
            { adminName, adminEmail, adminPassword },
            { new: true }
        )
        if (updatedData) {
            res.send({ message: "Updated succesfully", updatedData });
        } else {
            res.send({ message: "page not found" }).status(404);
        }
    } catch (err) {
        console.error(err);
        res.send({ message: "server error" })
    }
})

//................booking collection.......................................

const bookingSchemaStructure = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: true,
    },
    bookingStatus: {
        type: Number,
    },
    bookingAmount: {
        type: Number,
        required: true,
    },
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "mechanic"
    }
})

const BookingDetails = mongoose.model("bookingDetails", bookingSchemaStructure)

// boooking Post method 

app.post("/BookingDetails", async (req, res) => {
    try {
        const { bookingDate, bookingStatus, bookingAmount, mechanicId } = req.body;
        let bookingDetails = new BookingDetails({
            bookingDate,
            bookingAmount,
            bookingStatus,
            mechanicId,
        })

        await bookingDetails.save()

        res.send({
            message: "Booking Details insered "
        })
    } catch (error) {
        console.error(error);

    }
})

//....................booking get method  ...... and populate the mechanic datas.........................

app.get("/Booking", async (req, res) => {
    try {

        const booking = await BookingDetails.find().populate('mechanicId');
        if (booking.length === 0) {
            return (
                res.status(404).json({ message: "booking not found" })
            )
        } else {
            res.send(booking).status(200);
        }

    } catch (error) {
        console.error("Error finding Bokking details :", error);
        res.status(500).send({ message: "internal server error " })
    }
})

// booking get by id

app.get("/BookingById/:id", async (req, res) => {
    try {
        const id = req.params.id
        const boookingById = await BookingDetails.findById(id)
        if (boookingById.length === 0) {
            res.status(404).send({
                message: "booking not found"
            })
        } else {
            res.send(boookingById).status(200);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            Message: "Internal server error"
        })
    }
})

//Booking Get BY filter (like any field Name ,contact etc..)

app.get("/BookingByFilter/:bookingdate", async (req, res) => {
    try {
        const Filter = req.params.bookingdate
        const bookingByFliter = await BookingDetails.find({ bookingDate: Filter })
        if (bookingByFliter.length === 0) {
            res.status(404).send({
                message: "Booking not found"
            })
        } else {
            res.send(bookingByFliter).status(200);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "internal sever error"
        })
    }
})

// booking pipline...............................
app.get("/BookingWithMec", async (req, res) => {
    try {
        const bookingWithMechanic = await BookingDetails.aggregate([
            {
                $lookup: {
                    from: "mechanics",
                    localField: "mechanicId",
                    foreignField: "_id",
                    as: "mechanicals"
                },
            },
            {
                $unwind: "$mechanicals"
            },
            {
                $project: {
                    _id: "$_id",
                    bookingDate: "$bookingDate",
                    bookingStatus: "$bookingStatus",
                    bookingAmount: "$bookingAmount",
                    mechanical: {
                        mechanicName: "$mechanicals.mechanicName",
                        mechanicContact: "$mechanicals.mechanicContact",
                        mechanicEmail: "$mechanicals.mechanicEmail"
                        // $eq:["bookingAmount:", 2380]
                    }
                }
            }
        ])
        console.log(bookingWithMechanic);

    } catch (error) {
        console.error("Error finding Bokking details :", error);
        res.status(500).send({ message: "internal server error " })
    }
})
// ................... Bookin by $match ..............................
app.get("/BookingwithMecMatch", async (req, res) => {
    try {
        const bookingWithMechanic = await BookingDetails.aggregate([
            {
                $lookup: {
                    from: "mechanics",
                    localField: "mechanicId",
                    foreignField: "_id",
                    as: "mechanicals"
                },
            },
            {
                $unwind: "$mechanicals"
            },
            {
                $match: { "bookingAmount": 2380 },
            },
            {
                $project: {
                    _id: "$_id",
                    bookingDate: "$bookingDate",
                    bookingStatus: "$bookingStatus",
                    bookingAmount: "$bookingAmount",
                    mechanical: {
                        mechanicName: "$mechanicals.mechanicName",
                        mechanicContact: "$mechanicals.mechanicContact",
                        mechanicEmail: "$mechanicals.mechanicEmail"
                        // $eq:["bookingAmount:", 2380]
                    }
                }
            }
        ])
        console.log(bookingWithMechanic);

    } catch (error) {
        console.error("Error finding Bokking details :", error);
        res.status(500).send({ message: "internal server error " })
    }
})

// booking delete by one 

app.delete("/BookingByOne/:mechId", async (req, res) => {
    try {
        const mechId = req.params.mechId;
        const deleteddata = await BookingDetails.deleteOne({ mechanicId: mechId })
        console.log(deleteddata);
        if (!deleteddata) {
            res.status(404).send({ message: "page not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deleteddata });

        }
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

// booking deleted by id 

app.delete("/BookingById/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDetails = await BookingDetails.findByIdAndDelete(id);
        if (!deletedDetails) {
            res.status(404).send({ message: "Page not found" });
        } else {
            res.json({ messgae: "Booking details deleted successfully ", deletedDetails });
        }
    } catch (err) {
        console.error("error  deleting booking details: ", err);
        res.status(500).json({ message: "Internal server error " })
    }
})

// booking deleted by many 

app.delete("/BookingBymany/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDetails = await BookingDetails.deleteMany({ mechanicId: id });
        if (!deletedDetails) {
            res.status(404).send({ message: "Page not found" });
        } else {
            res.json({ messgae: "Booking details deleted successfully ", deletedDetails });
        }
    } catch (err) {
        console.error("error  deleting booking details: ", err);
        res.status(500).json({ message: "Internal server error " })
    }
})

// update booking by Bulk Write

app.put("/Bookingddd/:mecid/:date", async (req, res) => {
    const mecid = req.params.mecid;
    const date = req.params.date;
    const { bookingAmount, mechanicId } = req.body;

    const updatedAdmin = await BookingDetails.bulkWrite([

        { updateOne: { filter: { mechanicId: mecid }, update: { $set: { mechanicId } } } },

        { updateMany: { filter: { bookingDate: date }, update: { $set: { bookingAmount } } } }
    ])
    res.send({ message: "Updated", updatedAdmin })
})

//...................... ReplaceOne.................................

app.put("/BookingReplaceOne/:date", async (req, res) => {
    try {
        const date = req.params.date;
        const { bookingDate, bookingAmount, bookingStatus, mechanicId, } = req.body;

        const updatedData = await BookingDetails.replaceOne(
            { bookingDate: date },
            { bookingDate, bookingAmount, bookingStatus, mechanicId },
            { new: true }
        )
        if (updatedData) {
            res.send({ message: "Updated succesfully", updatedData });
        } else {
            res.send({ message: "page not found" }).status(404);
        }
    } catch (err) {
        console.error(err);
        res.send({ message: "server error" })
    }
})


// brand collection

const brandSchemaStructure = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        unique: true,
    }
})

const Brand = mongoose.model("brand", brandSchemaStructure);

app.post("/Brand", async (req, res) => {

    try {
        const { brandName } = req.body;
        let brand = new Brand({
            brandName,
        })
        await brand.save();
        res.send({ message: "Brand details inserted" })
    } catch (err) {

        console.error(err);

    }

})


//barnd get method 

app.get("/Brand", async (req, res) => {

    try {
        const brand = await Brand.find();
        if (brand.length === 0) {
            res.status(404).send({
                messgae: "Brand not found"
            })
        } else {
            res.status(200).json(brand)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "internal serevrc error"
        })
    }
})

//brand get by id 

app.get("/BrandById/:id", async (req, res) => {

    try {
        const id = req.params.id;
        const brandbyid = await Brand.findById(id);
        if (brandbyid.length === 0) {
            res.status(404).json({
                message: "Brand page not found or the"
            })
        } else {
            res.send(brandbyid).status(200);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" })
    }

})
//brand get by filter

app.get("/BrandByFilter/:filter", async (req, res) => {

    try {
        const filter = req.params.filter;
        const Brandbyfliter = await Brand.find(filter);
        if (Brandbyfliter.length > 0) {
            res.send(Brandbyfliter).status(200);
        } else {
            res.send({ messgae: "page not found " }).status(404)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ messgae: "Internal server error" })
    }

})
// brand deleted by findoneDelete 
app.delete("/BrandFindOneDelete/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const deletedDetails = await Brand.findOneAndDelete({ brandName: name })
        if (deletedDetails) {
            res.send({ message: "Deteled successfully done :", deletedDetails }).status(200);
        } else {
            res.send({ Message: "Page not found " })
        }
    } catch (err) {
        console.error(err);
        res.send({ messgae: "internal server error " }).status(500)
    }
})



//cart collection 

const cartSchemaStructure = new mongoose.Schema({
    cartQty: {
        type: Number,
        required: true,
    },
    cartStatus: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "bookingDetails"
    }
})

const Cart = mongoose.model("Cart", cartSchemaStructure);

app.post("/Cart", async (req, res) => {
    try {
        const { cartQty, cartStatus, productId, bookingId } = req.body;

        let cart = new Cart({
            cartQty,
            cartStatus,
            productId,
            bookingId,
        })

        await cart.save();
        res.send({
            message: "Cart detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})


// Cart get by Aggregate

app.get("/CartwithPro", async (req, res) => {
    try {
        const cartWithPro = await Cart.aggregate([
            {
                $lookup: {
                    from: "products", // Collection name of PostHead model
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: "$product", // Deconstructs the postHead array created by $lookup
            },
            {
                $lookup: {
                    from: "bookingdetails", // Collection name of User model
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "booking",
                },
            },

            {
                $unwind: "$booking", // Deconstructs the user array created by $lookup
            },
            {
                $lookup: {
                    from: "mechanics", // Collection name of User model
                    localField: "booking.mechanicId",
                    foreignField: "_id",
                    as: "mec",
                },
            },

            {
                $unwind: "$mec", // Deconstructs the user array created by $lookup
            },
            {
                $group: {
                    _id: "$bookingId", // Group Booking id 
                    booking: { $first: "$booking" }, // Take the first as booking details
                    product:{$first :"$product"},//take second as product details
                    mec:{ $first: "$mec"},// Take third as mechanical details
                    
                    carts: { $push: "$$ROOT" }, // Push all cart in the group into an array
                },
            },

            {
                $project: {
                    // Select fields to include in the final output
                   
                    bookingMain:{
                        bookingDate: "$booking.bookingDate",
                        bookingAmount:"$booking.bookingAmount",
                    },
                    product:{
                        productName: "$product.productName",
                        productPrice: "$product.productPrice",
                    },
                    mechanic:{
                        mechanicName: "$mec.mechanicName" 
                    },
                    cart: {
                        $map: {
                          // Map cart array to include only necessary fields
                          input: "$carts",
                          as: "cart",
                          in: {
                            _id: "$$cart._id",
                            cartQty:"$$cart.cartQty",
                            cartStatus:"$$cart.cartStatus"
                          },
                        },
                      },
                    
                },
            },
            {
                $sort: { bookingDate: -1 }, // Sort posts by postDateTime in descending order
            },
        ]);

        console.log(cartWithPro);
        res.send(cartWithPro).status(200);


    } catch (err) {
        res.send({ message: "internal error occured" }).status(500)
        console.error(err);

    }
})

// Cart get by Id

app.get("/Cart/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findById(id).populate({ path: 'bookingId', populate: { path: 'mechanicId', model: "mechanic" } });
        if (cart.length === 0) {
            res.send({ message: "page not found" }).status(404);
        } else {
            res.send(cart).status(200);
        }
    } catch (err) {
        res.send({ message: "internal error occured" }).status(500)
        console.error(err);

    }
})

// Cart get using find by one 

app.get("/CartByOne/:one", async (req, res) => {
    try {
        const key = req.params.one;
        const cartByOne = await Cart.findOne({ productId: key });
        if (cartByOne.length === 0) {
            res.send({ message: "page not found" }).status(404);
        } else {
            res.send(cartByOne).status(200);
        }
    } catch (err) {
        res.send({ message: "internal error occured" }).status(500)
        console.error(err);

    }
})

// Cart delete by one
app.delete("/CartByOne/:value", async (req, res) => {
    try {
        const value = req.params.value;
        const deletedDetails = await Cart.deleteOne({ productId: value });
        if (!deletedDetails) {
            res.status(404).send({ messgae: "page not found or the page doesn't contain any data" })
        } else {
            res.send({ message: "Cart details deleted successfully", deletedDetails });
        }
    } catch (err) {
        console.error(err);

    }
})

//category collection 

const categorySchemaStructure = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    }
})

const Category = mongoose.model("category", categorySchemaStructure);

//category Post method  

app.post("/Category", async (req, res) => {
    try {
        const { categoryName } = req.body;

        let category = new Category({
            categoryName,

        })

        await category.save();
        res.send({
            message: "Category detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

//category get method
app.get("/Category", async (req, res) => {
    try {
        const category = await Cart.find();
        if (category.length === 0) {
            res.send({ message: "page not found" }).status(404);
        } else {
            res.send(category).status(200);
        }
    } catch (err) {
        res.send({ message: "internal error occured" }).status(500)
        console.error(err);
    }
})


//Complaint collection

const ComplaintSchemaStructure = new mongoose.Schema({
    complaintTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "complaintType"
    },
    complaintcontent: {
        type: String,
        required: true,
        maxlength: 300,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    workShopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "workShop"
    },
    complaintStatus: {
        type: Number,
        required: true,
    },
    complaintReply: {
        type: String,
        required: true,
        maxlength: 300,
    },
    complaintDate: {
        type: Date,
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "shop"
    },
})

const Complaint = mongoose.model("complaint", ComplaintSchemaStructure)

app.post("/Complaint", async (req, res) => {
    try {
        const { complaintcontent, complaintTypeId, userId, workShopId, complaintStatus, complaintReply, complaintDate, shopId } = req.body;
        let complaint = new Complaint({
            complaintTypeId,
            complaintcontent,
            userId,
            workShopId,
            complaintStatus,
            complaintReply,
            complaintDate,
            shopId,
        })

        await complaint.save()

        res.send({
            message: "Complaint Details insered "
        })
    } catch (error) {
        console.error(error);

    }
})
// get complaint /.

app.get("/Complaint", async (req, res) => {
    try {
        const readDats = await Complaint.find().populate("workShopId").populate("shopId");
        if (readDats) {
            res.send(readDats)
        } else {
            res.send({ message: "page not found" }).status(404)
        }
    } catch (err) {
        console.error(err);
        res.send({ message: "server error" })
    }
})




//Complaint Type collection 

const complaintTypeSchemaStructure = new mongoose.Schema({
    complaintTypeName: {
        type: String,
        required: true,
    }

})

const ComaplaintType = mongoose.model("complaintType", complaintTypeSchemaStructure);

app.post("/ComplaintType", async (req, res) => {
    try {
        const { complaintTypeName } = req.body;

        let comaplintType = new ComaplaintType({
            complaintTypeName,
        })

        await comaplintType.save();
        res.send({
            message: "complaint type detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

//District collection 

const districtSchemaStructure = new mongoose.Schema({
    districtName: {
        type: String,
        required: true,
    }

})

const District = mongoose.model("district", districtSchemaStructure);

app.post("/District", async (req, res) => {
    try {
        const { districtName } = req.body;

        let district = new District({
            districtName,

        })

        await district.save();
        res.send({
            message: "district detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})


//Location collection 

const locationSchemaStructure = new mongoose.Schema({
    locationName: {
        type: String,
        required: true,
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "place"
    },
    locationLangitude: {
        type: String,
        required: true,
    },
    locationLatitude: {
        type: String,
        required: true,
    },
})

const Location = mongoose.model("location", locationSchemaStructure);

app.post("/Location", async (req, res) => {
    try {
        const { locationName, placeId, locationLangitude, locationLatitude } = req.body;

        let location = new Location({
            locationName,
            placeId,
            locationLangitude,
            locationLatitude
        })

        await location.save();
        res.send({
            message: "Location detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

// .................  place with location group  .......................................


app.get("/PlacewithLocation-Group", async (req,res) => {
 
    try {
        
        const placewithlocation = await Location.aggregate([
            {
                $lookup:{
                    from:"places",
                    localField:"placeId",
                    foreignField:"_id",
                    as:"places"
                }
            },
            {
                $unwind:"$places"
            },
            {
                $group:{
                    _id:"placeId",
                    places:{ $first : "$places" },
                    locations:{ $push : "$$ROOT" }
                }
            },
            {
                $project:{
                    place:{
                        placeName: "$places.placeName"
                    },
                    locations:{
                        $map:{
                          input:"$locations",
                          as:"loc",
                          in:{
                            _id:"$$loc._id",
                            locationName:"$$loc.locationName",
                            locationLangitude:"$$loc.locationLangitude",
                            locationLatitude:"$$loc.locationLatitude"
                          }
                        }
                    }
                }
            }
        ])

        res.send(placewithlocation)

    } catch (err) {
        console.error(err);
        
        
    }

})

//Mechanic collection 

const mechanicSchemaStructure = new mongoose.Schema({
    mechanicName: {
        type: String,
        required: true,
    },
    mechanicContact: {
        type: Number,
        required: true,
        unique: true,
        minlenght: 10,
        maxlength: 10,
    },
    mechanicEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'please use a valid email address'],
    },
    mechanicAddress: {
        type: String,
        required: true,
        maxlength: 400,
    },
    mechanicPhoto: {
        type: String,
        required: true,
    },
    workShopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "workShop"
    },
    mechanicPassword: {
        type: String,
        required: true,
    },
    mechanicDOJ: {
        type: Date,
        required: true,
    },


})

const Mechanic = mongoose.model("mechanic", mechanicSchemaStructure);

app.post("/Mechanic", async (req, res) => {
    try {
        const { mechanicName, mechanicContact, mechanicEmail, mechanicAddress, mechanicPhoto, workShopId, mechanicPassword, mechanicDOJ } = req.body;

        let mechanic = new Mechanic({
            mechanicName,
            mechanicContact,
            mechanicEmail,
            mechanicAddress,
            mechanicPhoto,
            workShopId,
            mechanicPassword,
            mechanicDOJ
        })

        await mechanic.save();
        res.send({
            message: "Mechanic detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})


//place collection 

const placeSchemaStructure = new mongoose.Schema({
    placeName: {
        type: String,
        required: true,
    }

})

const Place = mongoose.model("place", placeSchemaStructure);

app.post("/Place", async (req, res) => {
    try {
        const { placeName } = req.body;

        let place = new Place({
            placeName,

        })

        await place.save();
        res.send({
            message: "place detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

//Shop collection 

const shopSchemaStructure = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    shopContact: {
        type: Number,
        required: true,
        unique: true,
        minlenght: 10,
        maxlength: 10,
    },
    shopEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'please use a valid email address'],
    },
    shopAddress: {
        type: String,
        required: true,
        maxlength: 400,
    },
    shopLogo: {
        type: String,
        required: true,
    },
    shopProof: {
        type: String,
        required: true,
    },
    shopPassword: {
        type: String,
        required: true,
    },
    shopDOJ: {
        type: Date,
        required: true,
    },
    shopDOJ: {
        type: Date,
        required: true,
    },
    shopLocation: {
        type: String,
        required: true,
    },
    shopStatus: {
        type: Number,
        required: true,
    }


})

const Shop = mongoose.model("shop", shopSchemaStructure);

app.post("/Shop", async (req, res) => {
    try {
        const { shopName, shopContact, shopEmail, shopAddress, shopLogo, shopProof, shopLocation, shopPassword, shopDOJ, shopStatus } = req.body;

        let shop = new Shop({
            shopName,
            shopContact,
            shopEmail,
            shopAddress,
            shopLogo,
            shopProof,
            shopLocation,
            shopPassword,
            shopDOJ,
            shopStatus
        })

        await shop.save();
        res.send({
            message: "Shop detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})


//Product collection 

const productSchemaStructure = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDetails: {
        type: String,
        required: true,

    },

    productPrice: {
        type: String,
        required: true,
    },
    productPhoto: {
        type: String,
        required: true,
    },
    shopPassword: {
        type: String,
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "workShop"
    },

    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "brand"
    }


})

const Product = mongoose.model("product", productSchemaStructure);

app.post("/Product", async (req, res) => {
    try {
        const { productName, productDetails, productPrice, productPhoto, shopPassword, shopId, subcategoryId, typeId, brandId } = req.body;

        let product = new Product({
            productName,
            productDetails,
            productPrice,
            productPhoto,
            shopPassword,
            shopId,
            subcategoryId,
            typeId,
            brandId,
        })

        await product.save();
        res.send({
            message: "product detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

//stock collection 

const stockSchemaStructure = new mongoose.Schema({
    stockDate: {
        type: Date,
        required: true,
    },
    stockQty: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
    },

})

const Stock = mongoose.model("stock", stockSchemaStructure);

app.post("/Stock", async (req, res) => {
    try {
        const { stockDate, stockQty, productId } = req.body;

        let stock = new Stock({
            stockDate,
            stockQty,
            productId,

        })

        await stock.save();
        res.send({
            message: "Stock detailes inserted"
        })
    } catch (error) {
        console.error(error);

    }
})

//User collection 

const userSchemaStructure = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userContact: {
        type: Number,
        required: true,
        unique: true,
        minlenght: 10,
        maxlength: 10,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'please use a valid email address'],
    },
    userAddress: {
        type: String,
        required: true,
        maxlength: 400,
    },
    userGender: {
        type: String,
        required: true,
    },
    userDOB: {
        type: Date,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userDOJ: {
        type: Date,
        required: true,
    },
    userPhoto: {
        type: String,
        required: true,
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "place"
    }



})

const User = mongoose.model("user", userSchemaStructure);

app.post("/User", async (req, res) => {
    try {
        const { userName, userContact, userEmail, userAddress, userGender, userDOB, userPassword, userDOJ, userPhoto, placeId } = req.body;

        let user = new User({
            userName,
            userContact,
            userEmail,
            userAddress,
            userGender,
            userDOB,
            userPassword,
            userDOJ,
            userPhoto,
            placeId
        })

        await user.save();
        res.send({
            message: "User detailes inserted"

        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

// workshop collection
const workshopSchemaStucture = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
        minlenght: 10,
        maxlength: 10,
    },

    workShopAddress: {
        type: String,
        required: true,
    },
    workShopPassword: {
        type: String,
        required: true,
    }
})

const WorkShop = mongoose.model('workShop', workshopSchemaStucture);

app.post("/Workshop", async (req, res) => {
    try {
        const { name, email, contact, workShopAddress, workShopPassword } = req.body;

        let workShop = new WorkShop({
            name,
            email,
            contact,
            workShopAddress,
            workShopPassword,
        })
        await workShop.save()
        res.send({
            message: "Inserted Succefully"
        })
    } catch (err) {
        console.error(err);
        res.send("error occured in server")
    }

})





//............................Example of Put and patch.............................................

const arjunSchemaStructure = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    }
})

const Arjun = mongoose.model('Arjun', arjunSchemaStructure);

app.post("/Arjun", async (req, res) => {
    try {
        const { name, email, phoneNumber, age } = req.body;

        let arjun = new Arjun({
            name,
            email,
            phoneNumber,
            age
        })
        await arjun.save()
        res.send({
            message: "Inserted Succefully"
        })
    } catch (err) {
        console.error(err);
        res.send("error occured in server")

    }

})

app.put("/ArjunPut/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phoneNumber, age } = req.body;

        const updatedData = await Arjun.findOneAndReplace(
            { _id: id },
            { name, email, phoneNumber, age }
        )
        res.send({ messgae: "updated", updatedData }).status(200)
    } catch (err) {
        console.error(err);
        res.send("error occured in server")

    }
})

//  patch ....................

app.patch("/ArjunPatch/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const { phoneNumber } = req.body;

        const updatedData = await Arjun.updateMany(
            { name },
            { phoneNumber }
        )
        res.send({ messgae: "updated", updatedData }).status(200)
    } catch (err) {
        console.error(err);
        res.send("error occured in server")

    }
})

//  