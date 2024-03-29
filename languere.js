const { evaluate, derivative, complex } = require("mathjs");

let fun = "x^2+x-4";
let n = 2;

function loop() {
    let i = 1;
    let ans = [1];

    let root = [];

    for (let k = 0; k < 2; k++) {
        while (i < 40) {
            ans[i] = logic(ans[i - 1], k);

            //    if(isNaN(ans[i])){
            //       return NaN
            //    }

            if (typeof ans[i] === "object") {
                console.log(ans[i]);
                let compled = complex(ans[i].real, ans[i].im);
                let data = evaluate(fun, { x: compled });
                if ((Math.abs(data.re) < 1e-7 && Math.abs(data.im) < 1e-7) || (data.re == 0 && data.im == 0)) {
                    root.push(ans[i].real + "+(" + ans[i].im + ")*i");
                    break;
                }
            }

            // if (ans[i] == ans[i - 1]) {
            //     console.log(i);
            //     let data = evaluate(fun,{x:ans[i]})
            //     console.log("res:",data)
            //     if(data ==)
            //     root.push(ans[i]);
            //     break;
            // }

            let res = evaluate(fun, { x: ans[i] });

            if (res == 0 || Math.abs(res) < 1e-7) {
                root.push(ans[i]);
                break;
            }

            i++;
        }
    }

    return root;
}

function logic(x, k) {
    let fd = derivative(fun, "x");
    let sderiv = derivative(fd.toString(), "x").evaluate({ x });
    let fderiv = fd.evaluate({ x });

    let fval = evaluate(fun, { x });

    if (fval == 0) {
        return x;
    }

    let G = fderiv / fval;
    let H = G ** 2 - sderiv / fval;

    let A = (n - 1) * (n * H - G ** 2);
    let a;
    if (A >= 0) {
        if (k == 0) {
            a = n / (G + Math.sqrt(A));
        } else {
            a = n / (G - Math.sqrt(A));
        }

        return x - a;
    } else {
        A = 0 - A;

        if (k == 0) {
            return {
                real: x - (n * G) / (G ** 2 + A),
                im: (n * Math.sqrt(A)) / (G ** 2 + A)
            };
        } else {
            return {
                real: x - (n * G) / (G ** 2 + A),
                im: (-n * Math.sqrt(A)) / (G ** 2 + A)
            };
        }
    }
}

console.log("roots:", loop());
