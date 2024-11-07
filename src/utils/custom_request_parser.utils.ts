import ResponseObject from "../interfaces/response.interface";

export default class CustomRequestParser {
    public static ParseRequest(res: string) : ResponseObject {
        return {code: parseInt(res.split(":")[0]),message: res.split(":")[1]};
    }
}