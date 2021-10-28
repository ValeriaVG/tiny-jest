"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Test {
    constructor(title) {
        this.suite = [];
        // Stores last results
        this.results = [];
        this._before = [];
        this._after = [];
        this.it = (title, fn) => {
            this.suite.push({ title, fn });
        };
        this.xit = (title, _fn) => {
            this.suite.push({ title });
        };
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            this.results = [];
            try {
                yield Promise.all(this._before.map((fn) => fn()));
            }
            catch (error) {
                return [{ title: this.title, error, passed: false }];
            }
            for (let test of this.suite) {
                if (!test.fn) {
                    this.results.push({ title: test.title, skipped: true });
                    continue;
                }
                try {
                    yield test.fn();
                    this.results.push({ title: test.title, passed: true });
                }
                catch (error) {
                    this.results.push({ title: test.title, error, passed: false });
                }
            }
            try {
                yield Promise.all(this._after.map((fn) => fn()));
            }
            catch (error) {
                console.error(error);
            }
            return this.results;
        });
        this.before = (fn) => {
            this._before.push(fn);
        };
        this.after = (fn) => {
            this._after.push(fn);
        };
        this.title = title;
    }
}
exports.default = Test;
