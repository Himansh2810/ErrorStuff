import { derivative, evaluate } from "mathjs";

function log(x: any): void {
    console.log(x);
}

interface TokenType {
    valid?: boolean;
    type: string;
}

class Equation {
    private expression: string;
    private precisionRank: number;
    constructor(expression: string, precisionRank: number = 7) {
        new MathEquation(expression).parser();
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

class MathEquation {
    public expression: string;

    constructor(expression: string) {
        if (!expression) {
            throw new Error(
                "Required : Expression required at new MathEquation(<here>).parser() "
            );
        }
        this.expression = ":" + expression + "$";
    }

    public parser() {
        const tokens = this.createTokens();
        let final = true;

        for (let i = 0; i < tokens.length; i++) {
            let checkPair = this.syntaxChecking(tokens[i]);
            final = final && checkPair;
            if (!final) {
                throw new Error(
                    `Syntax Error : Please enter valid expression -> ${this.expression.slice(
                        1,
                        this.expression.length - 1
                    )} , ${tokens[i][0]} and ${
                        tokens[i][1]
                    } can not appear together `
                );
            }
        }
        return true;
    }

    private rules = {
        start: ["variable", "lp", "numbers", "functions"],
        variable: ["oprators", "rp", "end"],
        lp: ["lp", "rp", "variable", "numbers", "functions"],
        rp: ["rp", "lp", "end", "oprators"],
        dot: ["numbers"],
        oprators: ["lp", "variable", "numbers", "functions"],
        numbers: ["oprators", "rp", "end", "dot"],
        functions: ["lp"]
    };

    private syntaxChecking(tokenPair: string[]) {
        let key = tokenPair[0];
        let values: string[] = (this.rules as any)[key];
        if (values.includes(tokenPair[1])) {
            return true;
        }
        return false;
    }

    private identifyTokens(token: string): TokenType {
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
                return { valid: true, type: key };
            }
        }

        return { valid: false, type: "" };
    }
    private lpCount = 0;
    private rpCount = 0;
    private createTokens() {
        let expression = this.expression;
        try {
            let tokens: string[][] = [];
            let k: number = 0;

            while (k < expression.length - 1) {
                let t1: string;
                k != 0 ? (t1 = tokens[tokens.length - 1][1]) : (t1 = "start");
                let t2 = this.verifyToken(k + 1);
                let tokenPair = [t1, t2.token];

                k = t2.i - 1;

                tokens.push(tokenPair);
            }

            if (this.rpCount == this.lpCount) {
                return tokens;
            } else {
                throw new Error(
                    `Type Error : Unexpected or extra parenthsis in Expression ${this.expression.slice(
                        1,
                        expression.length - 1
                    )}`
                );
            }
        } catch (error) {
            throw error;
        }
    }

    private verifyToken(i: number) {
        try {
            let expression = this.expression;
            let token: string;
            let p2: TokenType,
                p3: TokenType,
                p1 = this.identifyTokens(expression[i]);
            if (!p1.valid) {
                let temp = expression[i] + expression[i + 1];
                p2 = this.identifyTokens(temp);

                if (!p2.valid && this.identifyTokens(expression[i + 1]).valid) {
                    throw new Error(
                        `Type Error : Unexpected token ${temp.slice(
                            0,
                            temp.length - 1
                        )} in ${expression.slice(1, expression.length - 1)}`
                    );
                }

                if (!p2.valid) {
                    temp += expression[i + 2];
                    p3 = this.identifyTokens(temp);
                    if (
                        !p3.valid &&
                        this.identifyTokens(expression[i + 2]).valid
                    ) {
                        throw new Error(
                            `Type Error : Unexpected token ${temp.slice(
                                0,
                                temp.length - 1
                            )} in ${expression.slice(1, expression.length - 1)}`
                        );
                    }
                    if (!p3.valid) {
                        throw new Error(
                            `Type Error : Unexpected token ${temp} in ${expression.slice(
                                1,
                                expression.length - 1
                            )}`
                        );
                    }

                    if (p3.type == "lp") this.lpCount++;
                    if (p3.type == "rp") this.rpCount++;
                    token = p3.type;
                    i = i + 3;
                    return { token, i };
                }

                if (p2.type == "lp") this.lpCount++;
                if (p2.type == "rp") this.rpCount++;
                token = p2.type;
                i = i + 2;
                return { token, i };
            }
            if (p1.type == "lp") this.lpCount++;
            if (p1.type == "rp") this.rpCount++;
            token = p1.type;
            i = i + 1;
            return { token, i };
        } catch (error) {
            throw error;
        }
    }
}

const res = new Equation("2-x+3*x*x+x*x*x", 15).solve();

log(res);
