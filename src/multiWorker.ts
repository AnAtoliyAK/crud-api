import cluster from 'cluster';
import { readFileSync, writeFile } from 'fs';
import http from 'http';
import { cpus } from 'os';
import path from 'path';
import process from 'process';
import { ApiMethods, ApiPath } from './constants/common';
import Controller from './controller';
import { IUser } from './types/types';
import getReqData from './utils/getReqData';
import uuidValidateV4 from './utils/validateId';

const numCPUs = cpus().length;

const data = readFileSync(path.join(__dirname, "./data.json"), "utf-8");
let data_users = JSON.parse(data);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer(async (req, res) => {
    if (req.url === ApiPath.API_USERS && req.method === "GET") {
        const users = await Controller.getUsers();
    
        res.writeHead(200, { "Content-Type": "application/json" });
    
        res.end(JSON.stringify(users));
      } else if (req?.url?.includes(ApiPath.API_USERS + "/")) {
        const id = req?.url?.split("/")[3];
    
        if (!uuidValidateV4(id)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end("You should use uuid for id");
        }
      } else if (
        req?.url?.includes(ApiPath.API_USERS + "/") &&
        req.method === ApiMethods.GET
      ) {
        const id = req?.url?.split("/")[3];
        try {
          const user = await Controller.getUser(id);
    
          res.writeHead(200, { "Content-Type": "application/json" });
    
          res.end(JSON.stringify(user));
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
    
          res.end(JSON.stringify({ message: error }));
        }
      } else if (
        req.url?.includes(ApiPath.API_USERS + "/") &&
        req.method === ApiMethods.DELETE
      ) {
        try {
          const id = req.url.split("/")[3];
    
          let message = await Controller.deleteUser(id);
          const filteredUsers = data_users.filter((user: IUser) => user.id !== id);
    
          writeFile(
            path.join(__dirname, "./data.json"),
            JSON.stringify(filteredUsers),
            (err) => {
              if (err) {
                const message = { message: "could not persist data!" };
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify(message, null, 2));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message }));
              }
            }
          );
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
    
          res.end(JSON.stringify({ message: error }));
        }
      } else if (
        req.url?.includes(ApiPath.API_USERS + "/") &&
        req.method === ApiMethods.PUT
      ) {
        try {
          const id = req.url.split("/")[3];
          const user_data = (await getReqData(req)) as string;
    
          const updated_user = await Controller.updateUser(
            JSON.parse(user_data),
            id
          );
    
          const filteredUsers = data_users.filter((user: IUser) => user.id !== id);
    
          filteredUsers.push(updated_user);
    
          writeFile(
            path.join(__dirname, "./data.json"),
            JSON.stringify(filteredUsers),
            (err) => {
              if (err) {
                const message = { message: "could not persist data!" };
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify(message, null, 2));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(updated_user, null, 2));
              }
            }
          );
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
    
          res.end(JSON.stringify({ message: error }));
        }
      } else if (req.url === "/api/users" && req.method === "POST") {
        try {
          const user_data = (await getReqData(req)) as string;
    
          const user = await Controller.createUser(JSON.parse(user_data));
          data_users.push(user);
    
          writeFile(
            path.join(__dirname, "./data.json"),
            JSON.stringify(data_users),
            (err) => {
              if (err) {
                const message = { message: "could not persist data!" };
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify(message, null, 2));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(data_users, null, 2));
              }
            }
          );
    
          res.end(JSON.stringify(user));
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
    
          res.end(JSON.stringify({ message: error }));
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}