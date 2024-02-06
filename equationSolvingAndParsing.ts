import { derivative, evaluate } from "mathjs";

function log(x: any): void {
    console.log(x);
}

class Equation {
    private expression: string;
    private precisionRank: number;
    constructor(expression: string, precisionRank: number = 7) {
        this.expression = expression;
        this.precisionRank = Math.floor(precisionRank);
    }

    public solve(): number {
        try {
            if (this.precisionRank < 7) {
                throw new Error(
                    `new Equation('${this.expression}',<error occured here>)~~ \n Precision Rank must be greater than or equal to 7`
                );
            }
            let finalAnswer = 0;
            for (let b = 0; b < 2; b++) {
                let previousAns = [finalAnswer];
                for (let i = 1; i < this.precisionRank - 3 * b; i++) {
                    previousAns[i] = this.execute(previousAns[i - 1]);

                    if (previousAns[i] == previousAns[i - 1]) {
                        return previousAns[i];
                    }
                }

                if (this.precisionRank >= 3 * b) {
                }
                finalAnswer = previousAns[this.precisionRank - 1 - 3 * b];
            }

            return finalAnswer;
        } catch (error) {
            throw error;
        }
    }

    private execute(x: number): number {
        try {
            const exp = evaluate(this.expression, { x: x });
            const derivatedExp = derivative(this.expression, "x").evaluate({
                x: x
            });

            const temp = x - parseFloat(exp) / parseFloat(derivatedExp);

            return temp;
        } catch (error) {
            throw error;
        }
    }
}

class EquationParser {
    public expression: string;

    constructor(expression: string) {
        this.expression = ":" + expression + "$";
    }

    public identifyTokens(token: string): boolean {
        const exp = {
            start: ":",
            variable: "x",
            lp: "(",
            rp: ")",
            dot: ".",
            end: "$",
            oprators: ["+", "-", "*", "/", "^", "="],
            numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            functions: ["sin", "cos", "tan", "sec", "cosec", "log", "pow"]
        };

        for (let key of Object.keys(exp)) {
            let k = (exp as any)[key];
            if (k.includes(token)) {
                return true;
            }
        }

        return false;
    }

    public createTokens() {
        let expression = this.expression;
        try {
            let tokens: string[][] = [];
            let k: number = 0;

            while (k < expression.length - 1) {
                let t1: string;
                k != 0 ? (t1 = tokens[tokens.length - 1][1]) : (t1 = ":");
                let t2 = this.verifyToken(k + 1);
                let tokenPair = [t1, t2.t1];

                k = t2.i - 1;

                tokens.push(tokenPair);
            }

            return tokens;
        } catch (error) {
            throw error;
        }
    }

    public verifyToken(i: number) {
        try {
            let expression = this.expression;
            let t1: string;
            let p2: boolean,
                p3: boolean,
                p1 = this.identifyTokens(expression[i]);
            if (!p1) {
                let temp = expression[i] + expression[i + 1];
                p2 = this.identifyTokens(temp);

                if (!p2 && this.identifyTokens(expression[i + 1])) {
                    throw new Error(
                        `Unexpected token ${temp.slice(
                            0,
                            temp.length - 1
                        )} in ${expression}`
                    );
                }

                if (!p2) {
                    temp += expression[i + 2];
                    p3 = this.identifyTokens(temp);
                    if (!p3 && this.identifyTokens(expression[i + 2])) {
                        throw new Error(
                            `Unexpected token ${temp.slice(
                                0,
                                temp.length - 1
                            )} in ${expression}`
                        );
                    }
                    if (!p3) {
                        throw new Error(
                            `Unexpected token \u001b[31m${temp} in ${expression}`
                        );
                    }

                    t1 = temp;
                    i = i + 3;
                    // range = 3;

                    return { t1, i };
                }

                t1 = temp;
                i = i + 2;
                // range = 2;

                return { t1, i };
            }

            t1 = expression[i];
            i = i + 1;
            // range = 1;

            return { t1, i };
        } catch (error) {
            throw error;
        }
    }
}

const res = new EquationParser("2*x+sn(x)").createTokens();

log(res);
