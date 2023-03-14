const express = require("express");
const app = express();
const PORT = 5000;
const db = require("./config/db");
const Form = require("./models/formData");
const multer = require("multer");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,'public')))


// setting up view engine
app.set("view engine", "ejs");
app.set("views", "./view");

// Setting layout
app.set("layout", "./layout/layout");

// Setting storage engine
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    console.log('===',file);
    console.log('===>',`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    //cb = callback
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});


db(() => {
  try {
    console.log("DataBase Successfully Connected");
  } catch (error) {
    console.log("Database Not Connected : ", error);
  }
});

// ----------------------------- ROUTES ------------------------------

// Showing page with form list
app.get("/", async (req, res) => {
  const formData = await Form.find();
  res.render("ListPage", { formData: formData });
});

// To show add form page
app.get("/addForm", (req, res) => {
  res.render("AddFormPage");
});

// To add form to database
app.post("/addForm", upload.single("formPicture"), async (req, res) => {
  const imagePath = req.file.filename;
  const { title, description, category, sale, price } = req.body;

  const newForm = new Form({
    title,
    description,
    category,
    sale,
    price,
    formPicture: imagePath,
  });
  const form = await newForm.save();
  res.redirect("/");
});

//To show edit form page
app.get("/editform", async (req, res) => {
  const formId = req.query.id;
  
  const formData = await Form.findById(formId);
  res.render("EditFormPage", { formData: formData });
});

// To edit form in the databse
app.post("/editForm", upload.single("image"), async (req, res) => {
  const formId = req.query.id;
  const { title, description, category, sale, price} = req.body;
  const formPicture =req.file.filename;
  await Form.updateOne(
    { _id: formId},
    {
      $set: {
        title,
        description,
        category,
        sale,
        price,
        formPicture,
      },
    }
  );
  
  res.redirect('/')
});


// To delete the form
app.delete("/deleteForm", async (req, res) => {
  let formId = req.query.id;
  await Form.deleteOne({ _id: formId });
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log("The server is runnig at port 5000");
});
