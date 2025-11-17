// import http from "http"
// const server = http.createServer((req, res)=>{
//     res.writeHead(200, {"Content-Type" : "text/plain"});
//     res.end("Hello World from node js");
// })
// server.listen(4545, ()=> console.log("server is running at port 4545"));



// import { readFileSync, writeFileSync, appendFileSync, unlinkSync, renameSync, readFile, appendFile, writeFile, rename} from "fs"

// let read = readFileSync("app.txt", 'utf8')
// console.log(read)

// writeFileSync("app.txt", "hello hello", "utf-8")

// appendFileSync('app.txt',  "\n hello hello app . txt", "utf8");

// unlinkSync("app.txt")

// let oldFileName = "myFile.txt"
// let myOldPath = path.join(__dirname, oldFileName);
// let myNewPath = path.join(__dirname, "myFileUpdated.txt");
// renameSync(myOldPath, myNewPath)



// writeFile("myFile.txt", "hello node js from async FS module", "utf8", (err)=>{
//     if(err) throw err;
//     console.log('the file has been created');
// })

// readFile("myFile.txt", (err, data)=>{
//     if(err) throw err;
//     console.log(data.toString());
// })

// appendFile("myFile.txt", "\nappend to my File", (err)=>{
//     if(err) throw err;
//     console.log('the append to my file was added');
// })


// const fs = require('fs/promises');
// const path = require('path');
// const filePath = path.join(__dirname, "newFile.txt")

// fs.promises
//     .readdir(__dirname)
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err))


// fs.promises
// .readFile(filePath, 'utf8')
// .then((data) => console.log(data))
// .catch((err) => console.log(err))

// fs.promises.appendFile('newFile.txt', '\nappend text', 'utf8')

// fs.promises.copyFile('newFile.txt', 'app.txt')


// ;(async()=>{
//     try {
//         const data = await fs.readFile(filePath, 'utf8')
//         console.log(data);    
//     } catch (error) {
//         console.log(error);
//     }
// }
// )();




    // const fs = require('fs');
    // const eventEmitter = require('events');
    // const emitter = new eventEmitter();
    // let obj = null;
    // async function getData(){
    // await fs.promises.readFile('data.json', 'utf8')
    //     .then((data) => {console.log(data, "data")})
    //     .catch((err)=>{console.log(err);})
    // }
    // getData();
    // let dt = fs.readFile('data.json', 'utf8', (err, data)=>{
    //     if(err) console.log(err);
    //     console.log(data);
    //     obj = data;
    //     return data;
    // })
    // console.log(dt, 'dt');

    // emitter.on('user-login',(username)=>{
    //     // eventCount.login++;
    //     console.log(`${username} is logged in`);
    // })
    // emitter.on('user-purchase',(username, item)=>{
    //     // eventCount.purchase++;
    //     console.log(`${username} purchase this item ${item}`);
    // })
    // emitter.on('profile-update',(username, changes)=>{
    //     // eventCount.profile++;
    //     console.log(`${username} is change in their ${changes}`);
    // })
    // emitter.on('user-logout',(username)=>{
    //     // eventCount.logout++;
    //     console.log(`${username} is logout`);
    // })



    // emitter.emit('user-login', 'ronik');
    // emitter.emit('user-purchase', "ronik", 'laptop');
    // emitter.emit('profile-update', 'ronik', 'email');
    // emitter.emit('user-logout', 'ronik');
    // console.log(eventCount);



