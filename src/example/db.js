import Dexie from "dexie";

export const db = new Dexie("TaskDB");

db.version(1).stores({
  tasks: "++id, text, done"
});