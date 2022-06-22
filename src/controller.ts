import { IUser } from "./types/types";

import { readFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT || 5000;
const jsonData = readFileSync(path.join(__dirname, "./data.json"), "utf-8");

let data_users = JSON.parse(jsonData) as Array<IUser>;

class Controller {
  static async getUsers() {
    return new Promise((resolve, _) => resolve(data_users));
  }

  static async getUser(id: string) {
    return new Promise((resolve, reject) => {
      const user = data_users.find((user) => user.id === id);
      if (user) {
        resolve(user);
      } else {
        reject(`user with id ${id} not found `);
      }
    });
  }

  static async createUser(user: IUser) {
    return new Promise((resolve, reject) => {
      const { age, username, hobbies } = user;
      const requiredFieldValidation =
        typeof age === "number" &&
        typeof username === "string" &&
        Array.isArray(hobbies);

      if (requiredFieldValidation) {
        const newUser = {
          ...user,
          id: uuidv4(),
        };

        resolve(newUser);
      } else {
        if (!age || typeof age !== "number") {
          reject(`age field is required and should be number`);
        }
        if (!username || typeof username === "string") {
          reject(`age field is required and should be string`);
        }
        if (!hobbies || Array.isArray(hobbies)) {
          reject(`age field is required and should be Array`);
        }
      }
    });
  }

  static async updateUser(user: IUser, id: string) {
    return new Promise((resolve, reject) => {
      const data_user = data_users.find((u) => u.id === id);

      if (!data_user) {
        reject(`No user with id ${user.id} found`);
      }

      const updatedUser = { ...user, id };

      resolve(updatedUser);
    });
  }

  static async deleteUser(id: string | number) {
    return new Promise((resolve, reject) => {
      const user = data_users.find((user) => user.id === id);

      if (!user) {
        reject(`No user with id ${id} found`);
      }

      resolve(`user deleted successfully`);
    });
  }
}

export default Controller;
