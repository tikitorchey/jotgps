import { JGEngine } from "../../src/core/jgEngine";

describe("getGPSCoordinates", () => {

  const navigatorSpy = jest.spyOn(global, "navigator", "get");

  afterEach(() => {
    // GeolocationAPIのモック化を解除
    navigatorSpy.mockRestore();
  });

  afterAll(() => {

  })

  test("ブラウザがGeolocationAPIに対応・API呼び出しが成功、端末位置情報が取得されること", async () => {

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
    };

    /**
     * Goal: GeolocationAPI部をモック化したNavigatorを作成する
     */

    // 初期状態のNavigatorおよびGeolocationを保持する
    const originalNavigator   = { ...navigator };
    const originalGeolocation = { ...navigator.geolocation };

    // GeolocationAPIをモック化（対象部分以外はオリジナルをコピー）
    const mockedNavigator: Navigator = {
      ...originalNavigator,
      geolocation: {
        ...originalGeolocation,
        getCurrentPosition: (successCallback) => {
          successCallback(EXPECTED_RESULT);
        }
      }
    }
    navigatorSpy.mockImplementation( () => { return mockedNavigator });

    const result = await JGEngine.getGPSCoords();
    expect(result).toBe(EXPECTED_RESULT);
  });

  test("ブラウザがGeolocationAPIに対応・API呼び出しが失敗、エラーが取得されること", async () => {

    /**
     * Goal: GeolocationAPI部をモック化したNavigatorを作成する
     */

    // 初期状態のNavigatorおよびGeolocationを保持する
    const originalNavigator   = { ...navigator };
    const originalGeolocation = { ...navigator.geolocation };

    // GeolocationAPIをモック化（対象部分以外はオリジナルをコピー）
    const mockedNavigator: Navigator = {
      ...originalNavigator,
      geolocation: {
        ...originalGeolocation,
        getCurrentPosition: () => {
          throw new Error();
        }
      }
    }
    navigatorSpy.mockImplementation( () => { return mockedNavigator });

    await expect( JGEngine.getGPSCoords() ).rejects.toThrow();

  });

  test("ブラウザがGeolocationAPIに非対応、エラーが取得されること", async () => {

    // 初期状態のNavigatorを保持する
    const originalNavigator = { ...navigator };

    // Navigatorを破棄
    const mockedNavigator: Navigator = { ...originalNavigator };
    {/** @ts-ignore */}
    mockedNavigator.geolocation = null;

    await expect( JGEngine.getGPSCoords() ).rejects.toThrow();

  });

});