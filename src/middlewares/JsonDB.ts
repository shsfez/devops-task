import path from 'path';
import fs from 'fs';

const filePath: string = path.join("data", "simple_file.json");

function ensureDirectoryExistence(fPath:string) {
    var dirname:string = path.dirname(fPath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

export function updateJson():string{
    ensureDirectoryExistence(filePath);

    var timestamp:Date = new Date() ;
    var fileContent:any = {timestamp: timestamp.toISOString()}

    fs.writeFileSync(filePath, JSON.stringify(fileContent));

    return timestamp.toLocaleString();
}
export function getFromJson():string{
    ensureDirectoryExistence(filePath);
    
    try {
        var fileData:string = fs.readFileSync(filePath, 'utf8');
        var fileObj:any = JSON.parse(fileData);
        var dateChanged = new Date(fileObj.timestamp);
        return dateChanged.toLocaleString();
    } catch (err) {
        return updateJson();
    }
}