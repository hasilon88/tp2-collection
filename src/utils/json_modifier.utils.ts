import fs from 'fs/promises';
import path from 'path';

class JsonModifier {
    async writeDataToJsonFile(data: any, filePath: string): Promise<void> {
        const jsonData = JSON.stringify(data, null, 2);
        
        const dirPath = path.dirname(filePath);
        
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, jsonData, 'utf8');
    }

    async readJsonToData(filePath: string): Promise<any> {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }
}

export default JsonModifier;
