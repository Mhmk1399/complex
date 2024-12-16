import mongoose from "mongoose";

const layoutSchema = new mongoose.Schema({
  type: String,
  settings: {
    fontFamily: String,
    colorSchema: {
      primary: String,
      secondary: String,
      text: String
    }
  },
  sections: {
    sectionHeader: mongoose.Schema.Types.Mixed,
    children: mongoose.Schema.Types.Mixed,
    sectionFooter: mongoose.Schema.Types.Mixed
  },
  order: [String]
});

export const Layout = mongoose.models.Layout || mongoose.model('Layout', layoutSchema);
