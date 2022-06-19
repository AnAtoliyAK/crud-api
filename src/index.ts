import { IUser } from "./types/types";
import http from "http";
import { ApiMethods, ApiPath } from "./constants/common";
import Controller from "./controller";
import getReqData from "./utils/getReqData";
import { writeFile, readFileSync } from "fs";
import getFilePath from "./utils/getFilePath";
import path from "path";
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import uuidValidateV4 from "./utils/validateId";

const PORT = process.env.PORT || 5000;

// const jsonPath = getFilePath(import.meta.url, ["constants", "global.js"])

const data = readFileSync(path.join(__dirname, "./data.json"), "utf-8");
let data_users = JSON.parse(data);

const server = http.createServer(async (req, res) => {
  if (req.url === ApiPath.API_USERS && req.method === "GET") {
    const users = await Controller.getUsers();

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(JSON.stringify(users));
  } else if (
    req?.url?.includes(ApiPath.API_USERS + "/") &&
    req.method === ApiMethods.GET
  ) {
      const id = req?.url?.split("/")[3];

      if (uuidValidateV4(id)) {
          try {
            const user = await Controller.getUser(id);
      
            res.writeHead(200, { "Content-Type": "application/json" });
      
            res.end(JSON.stringify(user));
          } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
      
            res.end(JSON.stringify({ message: error }));
          }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
      
            res.end("Not valid user Id");
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
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
