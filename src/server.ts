import { Server } from "https";
import app from "./app";


const port =3000;

const main = async()=>{
    const server:Server=app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
}

main();
