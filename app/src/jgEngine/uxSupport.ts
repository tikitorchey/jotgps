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

}

export default UXSupport;