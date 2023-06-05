const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors")
const viewroutes = require("./routes/route");
const app = express();
const PORT = 4000;

app.use(cors({
	origin:" http://localhost:3000",
	methods:["GET","POST","PUT","DELETE"]
}))
app.use(bodyParser.json());
app.get("/user",viewroutes.users);
app.post('/api', viewroutes.api_request);
app.put("/changes",viewroutes.api_data);
app.delete("/api/:regno",viewroutes.data_delete)


app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
