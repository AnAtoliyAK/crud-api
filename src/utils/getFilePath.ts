import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default function getFilePath(url: string, pathArray: Array<string>) {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, ...pathArray);

  return filePath;
}
