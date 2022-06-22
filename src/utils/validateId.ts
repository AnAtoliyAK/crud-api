import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";

export const UUID_VERSION = 4

export default function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === UUID_VERSION;
}
