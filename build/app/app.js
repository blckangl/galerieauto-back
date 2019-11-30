"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sampleserver_1 = __importDefault(require("../server/sampleserver"));
var server;
server = new sampleserver_1.default();
server.start(3002);
