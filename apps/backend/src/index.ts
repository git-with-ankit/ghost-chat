import express, { RequestHandler } from "express"
const app = express();
import cookieParser from "cookie-parser"
import cors from "cors"
app.use(express.json())

app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}))

app.get('/', (req, res) => {
    res.send("BE Running")
})

app.use("/api/auth", require("./routes/auth"))
app.use("api/chat", require("./routes/chat"))

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})