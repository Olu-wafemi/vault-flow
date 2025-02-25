"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.IdempotencyRecord = void 0;
var typeorm_1 = require("typeorm");
var IdempotencyRecord = /** @class */ (function () {
    function IdempotencyRecord() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], IdempotencyRecord.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], IdempotencyRecord.prototype, "key");
    __decorate([
        (0, typeorm_1.Column)()
    ], IdempotencyRecord.prototype, "walletId");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar' })
    ], IdempotencyRecord.prototype, "transactionType");
    __decorate([
        (0, typeorm_1.Column)()
    ], IdempotencyRecord.prototype, "transactionId");
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    ], IdempotencyRecord.prototype, "amount");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], IdempotencyRecord.prototype, "createdAt");
    IdempotencyRecord = __decorate([
        (0, typeorm_1.Entity)()
    ], IdempotencyRecord);
    return IdempotencyRecord;
}());
exports.IdempotencyRecord = IdempotencyRecord;
