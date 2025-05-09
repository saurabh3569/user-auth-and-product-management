const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
    is_verified: { type: "boolean", default: false },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    otps: {
      type: "one-to-many",
      target: "Otp",
      inverseSide: "user",
      cascade: true,
    },
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "user",
      cascade: true,
    },
  },
});
