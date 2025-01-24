// ToDo: 緯度経度のフォーマットを具体化する
// 参考： 10新数表記かつ、小数点以下は6桁がGPS利用時には一般的とのこと
export type LatLng = {
  lat: number | undefined,
  lng: number | undefined
}