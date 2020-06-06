declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // tslint:disable-next-line: interface-name
    interface Matchers<R, T> {
      toHaveBeenCalledNthWith<P>(times: number, expected: P): R;
      toHaveCoreError(message: RegExp): R;
      toHaveCoreOutput(key: string, value: string): R;
    }
  }
}

const setFailedMock = jest.fn();
export const setOutputMock = jest.fn();
const startGroupMock = jest.fn();
const endGroupMock = jest.fn();
const infoMock = jest.fn();

const actionsCoreMock = jest.mock('@actions/core', () => {
  return {
    endGroup: endGroupMock,
    getInput: (name: string, options?: { required: boolean }) => {
      if (
        options &&
        options.required &&
        !Object.keys(process.env).find((key) => `INPUT_${name.toUpperCase()}` === key)
      ) {
        throw Error(`Input required and not supplied: ${name}`);
      }
      return process.env[`INPUT_${name.toUpperCase()}`];
    },
    info: infoMock,
    setFailed: setFailedMock,
    setOutput: setOutputMock,
    startGroup: startGroupMock,
  };
});

export const uploadReleaseAssetMock = jest.fn();

const githubMock = jest.mock('@actions/github', () => {
  return {
    getOctokit: jest.fn().mockImplementation(() => {
      return {
        repos: {
          uploadReleaseAsset: uploadReleaseAssetMock,
        },
      };
    }),
    context: {
      repo: {
        owner: 'owner',
        repo: 'repo',
      },
    },
  };
});

const inputVars: { [key: string]: string } = {};

export const setInput = (name: string, value: string) => {
  const varName = `INPUT_${name.toUpperCase()}`;
  inputVars[varName] = value;
  process.env[varName] = value;
};

export const clearTestEnvironment = () => {
  Object.keys(inputVars).forEach((varName) => {
    Reflect.deleteProperty(process.env, varName);
    Reflect.deleteProperty(inputVars, varName);
  });
  actionsCoreMock.clearAllMocks();
  githubMock.clearAllMocks();
};

expect.extend({
  // tslint:disable-next-line: object-literal-shorthand space-before-function-paren
  toHaveBeenCalledNthWith: function (recieved: jest.Mock, times: number, match: any) {
    const passTimes = recieved.mock.calls.length && recieved.mock.calls.length === times ? true : false;
    const options = {
      comment: 'Error.message equality',
      isNot: this.isNot,
      promise: this.promise,
    };
    const callParams = recieved.mock.calls[0][0];
    const expectedKeys = Object.keys(match);
    const matchData = Object.create({});
    expectedKeys.forEach((key) => {
      matchData[key] = callParams[key];
    });
    const passDiff = expectedKeys.find((key) => {
      if (matchData[key] !== match[key]) {
        return key;
      }
    })
      ? false
      : true;
    const pass = passTimes && passDiff;
    return {
      message: () => {
        if (!passDiff || !passTimes) {
          // tslint:disable-next-line: max-line-length
          return this.utils.matcherHint(
            'toHaveBeenCalledNthWith',
            JSON.stringify(matchData),
            JSON.stringify(match),
            options,
          );
        } else {
          const diff = this.utils.diff(match, matchData, {
            expand: this.expand,
          });
          // tslint:disable-next-line: max-line-length
          return (
            this.utils.matcherHint(
              'toHaveBeenCalledNthWith',
              JSON.stringify(matchData),
              JSON.stringify(match),
              options,
            ) + `\n\n${diff}`
          );
        }
      },
      pass,
    };
  },
  toHaveCoreError(recieved: jest.Mock, msg: RegExp) {
    const error = setFailedMock.mock.calls.length ? (setFailedMock.mock.calls[0][0] as Error) : undefined;
    const pass = error && error.message.match(msg) ? true : false;
    const options = {
      comment: 'Error.message equality',
      isNot: this.isNot,
      promise: this.promise,
    };

    return {
      message: () => {
        if (pass) {
          return this.utils.matcherHint('toHaveCoreError', error?.message, `${msg}`, options);
        } else {
          const diff = this.utils.diff(msg, error?.message, {
            expand: this.expand,
          });
          return this.utils.matcherHint('toHaveCoreError', error?.message, `${msg}`, options) + `\n\n${diff}`;
        }
      },
      pass,
    };
  },
  toHaveCoreOutput: (recieved: jest.Mock, key: string, value: string) => {
    return {
      message: () => `No output for "${key} with ${value} found`,
      pass: recieved.mock.calls.find((call) => call[0] === key && call[1] === value) ? true : false,
    };
  },
});
