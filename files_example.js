const fs = require('fs');
const http = require('http');
http.createServer(function(req, res){

    //status checking

    fs.stat("new.txt", function(err,status){
        if (err) throw err;
        console.log(status);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("it is a file : " + status.isFile());
        res.write("\n")
        res.write("it is a directory : "+ status.isDirectory());
        res.write("\n")
        res.end();
        
    })

    // fs.open("new.txt","w+", function(err){
    //     if (err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write("open file success");
    //     res.end();
    // })

    // fs.unlink("rename.txt", function(err){
    //     if (err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write("delete success");
    //     res.end();
    // })

    // fs.rename("./test1.txt","rename.txt", function(err){
    //     if (err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write("rename success");
    //     res.end();
    // })
    // fs.readFile("./test.txt", function(err, data) {
    //     if (err) throw err;
    //     console.log(data.toString());
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write(data.toString());
    //     res.end();
    // }); 

    // fs.appendFile("./test1.txt","writefile 111", function(err){
    //     if (err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write("success");
    //     res.end();
    // })
    
    // fs.writeFile("./test1.txt","writefile", function(err){
    //     if (err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write("success");
    //     res.end();
    // })
}).listen(8080);
// const datasync = fs.readFileSync("./test.txt")
// console.log(datasync.toString());