import { JGEngine } from "../../src/core/jgEngine";

describe("getGPSCoordinates", () => {
  

  {/** @ts-ignore */}
  const EXPECTED_RESULT: GeolocationPosition = {
    coords: {
      accuracy          : 1,
      altitude          : null,
      altitudeAccuracy  : null,
      heading           : null,
      latitude          : 1,
      longitude         : 1,
      speed             : null,
      toJSON            : () => void
    {/** @ts-ignore */}
    },
    timestamp: 1
  }

  /**
   * GeolocationAPI部をモック化したNavigatorを作成
   *  変更対象の箇所以外はオリジナルのものスプレッド構文によりコピー
   */
  const originalNavigator   = { ...navigator };
  const originalGeolocation = { ...navigator.geolocation };
  const mockedNavigator: Navigator = {
    ...originalNavigator,
     geolocation: {
       ...originalGeolocation,
       getCurrentPosition: (successCallback) => {
         successCallback(EXPECTED_RESULT);
       }
     }
   }

  // GeolocationAPIをモック化（対象部分以外はオリジナルのものをコピー）
  const navigatorSpy = jest.spyOn(global, 'navigator', 'get');
  navigatorSpy.mockImplementation( () => { return mockedNavigator });

  // 各test実行後に実行する処理
  afterEach(() => {
  });

  // 全test実行後に実行する処理
  afterAll(() => {
    // GeolocationAPIのモック化を解除
    navigatorSpy.mockRestore();
  })

  test("GPS座標の取得が成功し、コールバック関数が実行されること", async () => {
    const result = await JGEngine.getGPSCoords();
    expect(result).toBe(EXPECTED_RESULT);
  });

  test("GPS座標の取得が成功し、コールバック関数が実行されること2", async () => {
    const result = await JGEngine.getGPSCoords();
    expect(result).toBe(EXPECTED_RESULT);
  });

});