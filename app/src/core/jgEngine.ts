import IDBHandler from "./dataPerpetuations/iDB/iDBHandler";
import Jotting from "./types/jotting";
import { StoreName } from "./dataPerpetuations/iDB/iDBSchema";
import { JSONHandler } from "./dataPerpetuations/json/jsonHandler";
import UXSupport from "./uxSupport";
import { resolve } from "path";

const IDB_STORENAME_JOTTING: StoreName = "jotting";
const MSG_NAV_GEOAPI_UNSUPPORTED_ENG: string = "the browser does not support Geolocation API.";
const MSG_NAV_GEOAPI_UNSUPPORTED_JPN: string = "ご利用のブラウザはGPS座標の所得に対応していない可能性があります。";

export class JGEngine{

  /**
   * 端末のGPS座標（緯度経度系）を取得する関数
   * 座標取得に成功/失敗時に各コールバックを実行する
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   *  GeolocationAPIの利用はsecure origins(https://goo.gl/Y0ZkNV)からの呼び出しが必要となる
   *  例えばhttps通信やlocalhostでの接続がこれに該当する
   * 
   */
  static async getGPSCoords(): Promise<GeolocationPosition>{

    // ブラウザのGeoAPI対応可否の確認
    if("geolocation" in navigator){

      /** Memo:
       *    以下のPromise関連コードは改修を見据えて簡易記法を避けている
       */

      const executor = (
        resolve : (value  : GeolocationPosition)      => void,
        reject  : (reason : GeolocationPositionError) => void
      ) => {

        const successCallback: PositionCallback = (position: GeolocationPosition) => {
          resolve(position);
        }

        const errorCallback: PositionErrorCallback = (error: GeolocationPositionError) => {
          reject(error);
        }

        // GeolocationAPIより現在地の座標を取得
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

      };

      return new Promise(executor);

    }else{
      throw new Error(MSG_NAV_GEOAPI_UNSUPPORTED_ENG);
    }
    
  }

  /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードするメソッド
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前 拡張子を除いた部分とすること
   */
  static async exportJottings(targetData: Object, fileName: string): Promise<void>{

    try{

      await JSONHandler.exportJSON(targetData, fileName);

    } catch (e) {

      /** Memo: Errorの種類
       * AbortError ... ユーザーがファイル選択をキャンセルした際に発生するエラー
       */
      if ( (e instanceof Error) && (e.name === 'AbortError')) {
        throw e;
      } else {
        throw e;
      }

    }

  }

  /**
   * JSONファイルを読み込みJottingのリストへ復元するメソッド
   * @returns JSONから復元されたJottingのリスト
   */
  static async importJottings(): Promise<Array<Jotting>>{

    try{

      const jsObject          = await JSONHandler.importJSON();
      const importedJottings  = jsObject as Array<Jotting>;

      /** Todo:
       *    フォーマットのチェック処理（型ガード）を追加
       */

      return importedJottings;

    } catch (e) {

      /** Memo: Errorの種類
       * AbortError ... ユーザーがファイル選択をキャンセルした際に発生するエラー
       */
      if ( (e instanceof Error) && (e.name === 'AbortError')) {
        throw e;
      } else {
        throw e;
      }

    }

  }

  static async iDBfactoryReset(func?: () => void){
    const successCallback = () => {
      if(func){ func(); }
    }
    IDBHandler.factoryReset(successCallback);
  }

  static iDBCreateJottings(jottingToSave: Array<Jotting>, func?: () => void){
    const successCallback = () => {
      if(func){ func(); }
    }
    IDBHandler.createRecords(IDB_STORENAME_JOTTING, jottingToSave, successCallback);
  }

  static iDBReadAllJottings(func: (records: Array<Jotting>) => void){
    const successCallback = (records: Array<any>) => {
      func(records);
    }
    IDBHandler.readAllRecords(IDB_STORENAME_JOTTING, successCallback);
  }

  static iDBReadJottingsByKey(tardetKeys: Array<string>, func: (records: Array<any>) => void){
    const successCallback = (records: Array<any>) => {
      func(records);
    }
    IDBHandler.readRecordsByKey(IDB_STORENAME_JOTTING, tardetKeys, successCallback);
  }

  static iDBDeleteJottingsByKey(tardetKeys: Array<string>, func: () => void){
    const successCallback = () => {
      func();
    }
    IDBHandler.deleteRecordsByKey(IDB_STORENAME_JOTTING, tardetKeys, successCallback);
  }

}

export default JGEngine