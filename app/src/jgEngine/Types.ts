import { ULID } from "ulid";

// ToDo: 緯度経度のフォーマットを具体化する
// 参考： 10新数表記かつ、小数点以下は6桁がGPS利用時には一般的とのこと
export type LatLng = {
  lat: number | undefined,
  lng: number | undefined
}

// GPS座標のレコード1件
export type Jotting = {
  id        : JottingID,
  gpsCoords : LatLng,
  metaData  : {
    date        : Date    | undefined,    // レコードの作成日時を示すものではなく、ユーザーがメモ用に使用するフィールド
    title       : string  | undefined,
    description : string  | undefined
  }
}

// Jotting（GPS座標のレコード1件）をテーマごとに複数件まとめたもの
export type Jotter = {
  id        : JotterID,
  Jottings  : Array<JottingID>,
  metaData  : {
    title       : string  | undefined,
    description : string  | undefined
  }
}

// Jotting/ JotterのIDフォーマット
type JottingID  = ULID;   //ULID形式を採用
type JotterID   = ULID;