const express = require("express");

const  studentRouter= require('./routes/studentRoutes')
const registrationRouter = require('./routes/registrationRoutes')
const adminRouter = require('./routes/adminRoutes')
const userRouter = require('./routes/userRoutes')
const discountRouter = require('./routes/discounts');
const paymentsRouter = require('./routes/payments')
const assignDiscount = require('./routes/assignDiscount')
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

app.use('/students', studentRouter)
app.use("/register", registrationRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use('/discounts', discountRouter);
app.use('/payments', paymentsRouter);
app.use('/assignDiscount', assignDiscount);


app.listen(4000, 'localhost', () => {
  console.log('server started at port 4000')
})
