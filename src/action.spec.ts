import { clearTestEnvironment, uploadReleaseAssetMock, setInput, setOutputMock } from "./testUtils";

import { run as testSubject } from "./action";

describe("nodejs-upload-asset", () => {

  beforeEach(() => {
    clearTestEnvironment();
    Reflect.deleteProperty(process.env, "GITHUB_TOKEN");
  });

  it("no url provided", async () => {
    setInput("path", "bar");
    return expect(testSubject()).rejects.toStrictEqual(Error("Input required and not supplied: url"));
  });

  it("no path provided", async () => {
    setInput("url", "foo");
    return expect(testSubject()).rejects.toStrictEqual(Error("Input required and not supplied: path"));
  });

  it("missing GITHUB_TOKEN", async () => {
    setInput("url", "foo");
    setInput("path", "bar");
    return expect(testSubject()).resolves.toHaveCoreError(/Missing GITHUB_TOKEN/);
  });

  it("invalid path", async () => {
    setInput("url", "foo");
    setInput("path", "bar");
    process.env.GITHUB_TOKEN = "abcd";
    return expect(testSubject()).resolves.toHaveCoreError(/lstat/);
  });

  it("valid input and GITHUB_TOKEN - upload", async () => {
    setInput("url", "foo");
    setInput("path", ".editorconfig");
    process.env.GITHUB_TOKEN = "abcd";
    uploadReleaseAssetMock.mockReturnValue({
      data: {
        browser_download_url: "download_url",
        id: 1,
      },
    });
    return testSubject().then(() => {
      expect(uploadReleaseAssetMock).toHaveBeenCalledNthWith(1, {
        name: ".editorconfig",
        url: "foo",
      });
      expect(setOutputMock).toHaveBeenCalledTimes(2);
      expect(setOutputMock).toHaveCoreOutput("id", "1");
      expect(setOutputMock).toHaveCoreOutput("url", "download_url");
    });
  });

  it("valid input and GITHUB_TOKEN - upload - custom mime type", async () => {
    setInput("url", "foo");
    setInput("path", "package.json");
    setInput("mime", "application/json");
    process.env.GITHUB_TOKEN = "abcd";
    uploadReleaseAssetMock.mockReturnValue({
      data: {
        browser_download_url: "download_url",
        id: 1,
      },
    });
    return testSubject().then(() => {
      expect(uploadReleaseAssetMock).toHaveBeenCalledNthWith(1, {
        name: "package.json",
        url: "foo",
      });
      expect(setOutputMock).toHaveBeenCalledTimes(2);
      expect(setOutputMock).toHaveCoreOutput("id", "1");
      expect(setOutputMock).toHaveCoreOutput("url", "download_url");
    });
  });


});
