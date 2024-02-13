const {evaluate,derivative,complex} = require("mathjs");

let fun = "x^2+x+4";
let n=2;

function loop(){
    let i=1;
    let ans = [1];
   while(i<40){
       ans[i] = logic(ans[i-1]);

    //    if(isNaN(ans[i])){
    //       return NaN
    //    }

       if(typeof ans[i] === 'object'){
           console.log(ans[i])
           let compled = complex(ans[i].real,ans[i].im)
           console.log( evaluate(fun,{x:compled}))
           return
       }

       if(ans[i] == ans[i-1]){
         console.log(i);
          return ans[i];
       }

       let res = evaluate(fun,{x:ans[i]});

       if(res == 0 || (Math.abs(res) < 1e-5)){
        console.log(i);
        console.log(res)
         return ans[i];
       }

       i++;
   }

   return NaN;
}


function logic(x){
      let fd = derivative(fun,'x');
      let sderiv = derivative(fd.toString(),'x').evaluate({x});
      let fderiv = fd.evaluate({x});

      let fval = evaluate(fun,{x});

      if(fval ==0 ){
         return x;
      }

      let G = fderiv/fval;
      let H = G**2 - (sderiv/fval);

      let A = (n-1)*(n*H-G**2);
      let a;
      if(A >= 0){
         a = n / (G + Math.sqrt(A));
         console.log("a :",a);

         return x-a;
      }
      else{

         A = 0-A;
         return {
            real: x- ((n*G)/(G**2+A)),
            im:(n*Math.sqrt(A))/(G**2+A)
         }
      }


      
      
}


console.log(loop());
