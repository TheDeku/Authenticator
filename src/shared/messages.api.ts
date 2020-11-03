export class MessagesApi {

    constructor(message?:string,state?:boolean,code:number=200,value?){
        this.message = message;
        this.state = state
        this.code = code
        this.value = value;
    }

    message: string;

    state: boolean;

    code: number;

    value:any;
}