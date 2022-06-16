import data from "./data";
import { IUser } from "./types/types";

class Controller {
  async getUsers() {
    return new Promise((resolve, _) => resolve(data));
  }

  async getUser(id: string) {
    return new Promise((resolve, reject) => {
      const user = data.find((user) => user.id === Number(parseInt(id)));
      if (user) {
        resolve(user);
      } else {
        reject(`user with id ${id} not found `);
      }
    });
  }

  async createUser(user: IUser) {
    return new Promise((resolve, _) => {
      const newuser = {
        ...user,
        id: Math.floor(4 + Math.random() * 10),
      };

      resolve(newuser);
    });
  }

  async updateUser(id: string) {
    return new Promise((resolve, reject) => {
      const user = data.find((user) => user.id === parseInt(id));

      if (!user) {
        reject(`No user with id ${id} found`);
      }

      resolve(user);
    });
  }

  async deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      const user = data.find((user) => user.id === parseInt(id));

      if (!user) {
        reject(`No user with id ${id} found`);
      }

      resolve(`user deleted successfully`);
    });
  }
}
export default Controller;
