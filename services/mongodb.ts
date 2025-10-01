import Jsons from "@/models/jsons";

export async function fetchFromMongoDB(
  route: string,
  mode: string,
  storeId: string
): Promise<string> {
  const jsonDoc = await Jsons.findOne({ storeId, route });
  if (!jsonDoc) {
    throw new Error(`Route not found: ${route} for store: ${storeId}`);
  }

  const content = mode === "lg" ? jsonDoc.lgContent : jsonDoc.smContent;
  return JSON.stringify(content);
}

export async function saveToMongoDB(
  route: string,
  mode: string,
  storeId: string,
  newLayout: any
): Promise<void> {
  const existing = await Jsons.findOne({ storeId, route });

  if (existing) {
    const updateField =
      mode === "lg" ? { lgContent: newLayout } : { smContent: newLayout };
    await Jsons.findOneAndUpdate({ storeId, route }, updateField, {
      new: true,
    });
  } else {
    const defaultContent = { children: { sections: [], order: [] } };
    await Jsons.create({
      storeId,
      route,
      lgContent: mode === "lg" ? newLayout : defaultContent,
      smContent: mode === "sm" ? newLayout : defaultContent,
      version: "1",
    });
  }
}

export async function listMongoDBTemplates(storeId: string) {
  const docs = await Jsons.find({ storeId }).select("route");

  const files = docs.flatMap((doc) => [
    `${doc.route}lg.json`,
    `${doc.route}sm.json`,
  ]);
  return { files };
}

export async function createNewMongoJSON(
  routeName: string,
  storeId: string
): Promise<void> {
  const defaultData = {
    children: {
      type: routeName,
      metaData: {
        title: routeName,
        description: routeName,
      },
      sections: [],
      order: [],
    },
  };

  await Jsons.create({
    storeId,
    route: routeName,
    lgContent: defaultData,
    smContent: defaultData,
    version: "1",
  });
}

export async function deleteMongoDBFile(
  routeName: string,
  storeId: string
): Promise<void> {
  await Jsons.deleteOne({ storeId, route: routeName });
}
