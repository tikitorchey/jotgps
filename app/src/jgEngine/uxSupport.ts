import Jotting from "./types/jotting";

/**
 * UX向上を目的とした汎用処理を集約するクラス
 */
export class UXSupport{

  constructor(){}

  /** 
   * 位置情報利用許可のステータスを確認し、ステータスに応じてユーザー向けのレスポンスを実行するメソッド
   */
  static handleGPSPermission(){

    // 参考: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        ;   // 空分
      } else if (result.state === "prompt") {
        ;   // 空分
      } else if (result.state === "denied") {
        /**
         * TODO: QAページへの誘導テキストに変更する 
         */
        alert("位置情報へのアクセスが拒否されています。本機能をご利用いただく場合は、ご利用のブラウザの権限付与設定にて、本サイトにアクセス許可を設定してください。");
      }
    });

  }

  /**
   * レコードを受け取り、競合を解消したうえでマージするメソッド
   * 主に、DBからUIにレコードを読み込む際に重複を避ける目的で用いる
   * 検証に必要な情報（更新日時）が欠損している場合、競合を解消せずに共存させる
   * @param baseRecords 
   * @param addtionalRecords 
   * @returns 2配列をマージし新規作成したレコード
   */
  static mergeRecords(baseRecords: Array<Jotting>, addtionalRecords: Array<Jotting>): Array<Jotting>{

    let mergedRecords: Array<Jotting>;

    // 配列を複製（破壊的操作を避けるため）
    // ※ cRecsに関しては破壊的操作を伴わないので本来不要であるが、可読性の都合上で併せて複製してしまう
    const bRecs = structuredClone(baseRecords);   // clonedBaseRecords
    const aRecs = addtionalRecords;               // 可読性の都合で変数入れ替え

    // 基となるレコードへ追加するレコードを組み込む
    aRecs.forEach( (aRec: Jotting) => {

      // 競合したレコードを取得する（IDが一致したもののインデックスを抽出）
      const conflictedIndex: number | -1 = bRecs.findIndex(
        (bRec: Jotting) => { return (bRec.id == aRec.id); }
      );

      // 競合を解消する（更新日時が若いものを残す）
      if(conflictedIndex > -1){    // 競合するものが存在しない場合は-1が格納される（findIndexの仕様）
        
        const bRec = bRecs[conflictedIndex];
        console.debug(`${ bRec.id }: レコード取得時に競合を検知しました。`);

        // 検証情報が十分であることを確認
        if(bRec.metaData.date.updated && aRec.metaData.date.updated){
          
          if(bRec.metaData.date.updated > aRec.metaData.date.updated){
            // 基となるレコードがより新しい場合は更新しない
            console.debug(`${ bRec.id }: 既に読み込み済みのレコードを優先しました。`);
          }else{
            // 基となるレコードがより古い場合は置換する
            bRecs[conflictedIndex] = aRec;
            console.debug(`${ bRec.id }: 新たに取得したレコードを優先しました。`);
          }

        }else{
          // 検証に必要な情報（更新日時）が欠損している場合、競合を解消せずに共存させる
          bRecs.push(aRec);
          console.debug(`${ bRec.id }: レコードの競合状況を検証するためのデータが欠損していました。`);
          console.debug(`${ bRec.id }: 競合するレコードは双方読み込みましました`);
        }

      }else{
        bRecs.push(aRec);
      }

    });

    mergedRecords = bRecs;
    return mergedRecords;

  }

}

export default UXSupport;