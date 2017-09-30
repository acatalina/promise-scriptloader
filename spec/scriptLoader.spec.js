const scriptLoader = require('../scriptLoader');

describe('scriptLoader', () => {
  it('throws an error if no scripts are provided as first argument', () => {
    expect(() => {
      scriptLoader(1);
    }).toThrowError('Needs scripts to load!');
  });

  it('accepts an array with one string to load as scripts and execute onLoad function when finishes', (done) => {
    let script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    let onLoad = (res) => {
      expect(res).toBeTruthy();
      done();
    }

    scriptLoader(['test'], onLoad);
    script.load();
  });

  it('accepts an array with one string to load and execute onError if fails to load', () => {
    let script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    let onError = (res) => {
      expect(res).toBeFalsy();
      done();
    }

    scriptLoader(['test'], 'onLoad', onError);
    script.error();
  });
});