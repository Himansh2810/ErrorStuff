import {derivative,evaluate} from "mathjs";

function log(x:any):void{
    console.log(x);
}

class Equation{
    private expression:string;
    private precisionRank:number;
    constructor(expression:string,precisionRank:number=7){
      this.expression = expression;
      this.precisionRank=Math.floor(precisionRank);
    }

    public solve():number{
        try{
            if( this.precisionRank < 7) {
                throw new Error(`new Equation('${this.expression}',<error occured here>)~~ \n Precision Rank must be greater than or equal to 7`);
            } 
             let finalAnswer=0;
             for(let b=0;b<2;b++)
             {
               let previousAns=[finalAnswer];
               for(let i=1;i<this.precisionRank-3*b;i++)
               {
                   previousAns[i]=this.execute(previousAns[i-1]);

                   if(previousAns[i] == previousAns[i-1]){
                        return previousAns[i];
                   }
               }
     
               if(this.precisionRank >= 3*b){}
                finalAnswer=previousAns[this.precisionRank-1-3*b];
             }
         
             return finalAnswer;
        }catch(error){
            throw error;
        }
    }

    private execute(x:number):number{

        try {

            const exp = evaluate(this.expression,{x:x})
            const derivatedExp = derivative(this.expression,'x').evaluate({x:x});
        
            const temp = x - (parseFloat(exp)/parseFloat(derivatedExp));
        
            return temp;
        } catch (error) {
            throw error;
        }
        
    }
}

class EquationParser{
    
    public parser(){
         

         
        
    }

    public identifyTokens(token:string):boolean{

        const exp={
            start:':',
            variable:'x',
            lp:'(',
            rp:')',
            dot:'.',
            end:'$',
            oprators:['+','-','*','/','^','='],
            numbers:['0','1','2','3','4','5','6','7','8','9'],
            functions:['sin','cos','tan','sec','cosec','log','pow'],
        }

        for (let key of Object.keys(exp)) {
            let k =(exp as any)[key];
            if(k.includes(token)){
              return true
            }   
        }

        return false
    }

    public createTokens(expression:string){

        try {
             
            expression = ':'+expression+'$';
    
            let tokens:string[][]=[];
    
            for(let i=0;i<expression.length-2;i++){
                let p1 = expression[i];
                let p2 = expression[i+1];
                let p3 =expression[i+2];
    
                if(this.identifyTokens(p1) ){
                    if(this.identifyTokens(p2)){
                           let tokenPair = [p1,p2];
                           tokens.push(tokenPair);
                    }
                    else{
                        throw new Error(`Unexpected token ${p2} in ${expression}`);
                    }
                }
                else{

                    if(expression[i+2] == undefined){
                        throw new Error(`Unexpected token ${p1+p2} in ${expression}`);
                    }
                    let checkMore = p1+p2+expression[i+2];

                    if(this.identifyTokens(checkMore)){

                    }

                    throw new Error(`Unexpected token ${p1} in ${expression}`);
                }
            }
            
            return tokens;
        } catch (error) {
            throw error;
        }
    }
}

const res = new EquationParser().createTokens('xx==23(()+/');

log(res);
