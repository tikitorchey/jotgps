export const IDB_SCHEMA: IDBSchema = {
  "DB_NAME"     : "jotgps",
  "DB_VERSION"  : 1,
  "STORE"   : [
    {
      "NAME"      : "jotting",
      "KEY_PATH"  : "id"
    },
    {
      "NAME"      : "jotter",
      "KEY_PATH"  : "id"
    }
  ]
};

type IDBSchema = {
  "DB_NAME"     : string,
  "DB_VERSION"  : number,
  "STORE"       : Array<StoreInfo>
}

type StoreInfo = {
  "NAME"      : string,
  "KEY_PATH"  : string
}

export default IDB_SCHEMA;