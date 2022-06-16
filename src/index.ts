import http from "http";
import Controller from "./controller";
import  getReqData  from "./utils";

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {

    if (req.url === "/api/users" && req.method === "GET") {
        const users = await new Controller().getUsers();

        res.writeHead(200, { "Content-Type": "application/json" });
 
        res.end(JSON.stringify(users));
    }


    else if (req?.url?.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
        try {
      
            const id = req?.url?.split("/")[3];
      
            const user = await new Controller().getUser(id);
         
            res.writeHead(200, { "Content-Type": "application/json" });
      
            res.end(JSON.stringify(user));
        } catch (error) {
          
            res.writeHead(404, { "Content-Type": "application/json" });
           
            res.end(JSON.stringify({ message: error }));
        }
    }


    else if (req.url?.match(/\/api\/users\/([0-9]+)/) && req.method === "DELETE") {
        try {
        
            const id = req.url.split("/")[3];
        
            let message = await new Controller().deleteUser(id);
          
            res.writeHead(200, { "Content-Type": "application/json" });
          
            res.end(JSON.stringify({ message }));
        } catch (error) {
      
            res.writeHead(404, { "Content-Type": "application/json" });
     
            res.end(JSON.stringify({ message: error }));
        }
    }


    else if (req.url?.match(/\/api\/users\/([0-9]+)/) && req.method === "PATCH") {
        try {
       
            const id = req.url.split("/")[3];
            
            let updated_user = await new Controller().updateUser(id);
            
            res.writeHead(200, { "Content-Type": "application/json" });
          
            res.end(JSON.stringify(updated_user));
        } catch (error) {
         
            res.writeHead(404, { "Content-Type": "application/json" });
       
            res.end(JSON.stringify({ message: error }));
        }
    }

  
    else if (req.url === "/api/users" && req.method === "POST") {
   
        const user_data = await getReqData(req) as string;
       
        const user = await new Controller().createUser(JSON.parse(user_data));
      
        res.writeHead(200, { "Content-Type": "application/json" });
    
        res.end(JSON.stringify(user));
    }

    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});