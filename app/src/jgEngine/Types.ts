// ToDo: 緯度経度のフォーマットを具体化する
// 参考： 10新数表記かつ、小数点以下は6桁がGPS利用時には一般的とのこと
export type LatLng = {
  lat: number | null,
  lng: number | null
}

// Jotting（GPS座標のレコード1件）をテーマごとに複数件まとめたもの
export type Jotter = {
  id        : JotterID,
  Jottings  : Array<JottingID>,
  metaData  : {
    title       : string  | null,
    description : string  | null
  }
}

// Jotting/ JotterのIDフォーマット
export type JottingID  = string;   //ULID形式を採用
export type JotterID   = string;