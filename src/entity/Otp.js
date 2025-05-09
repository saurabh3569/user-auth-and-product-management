const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Otp",
  tableName: "otps",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar" },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    expires_at: {
      type: "timestamp",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      eager: false,
      nullable: false,
    },
  },
});
