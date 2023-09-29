export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.createdAt;
      delete ret.updatedAt;
      ret.success = true;
      return ret;
    },
  },
};
