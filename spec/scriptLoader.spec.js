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

  it('accepts an array with one string to load and execute onError if fails to load', (done) => {
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

  it('returns a promise that it will receive null if no errors', (done) => {
    let script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    let scriptLoaderPromise = scriptLoader(['test']);
    script.load();

    scriptLoaderPromise.then(res => {
      expect(res).toBeTruthy();
      done();
    });
  });

  it('returns a promise that it will receive the error message if error', (done) => {
    let script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    let scriptLoaderPromise = scriptLoader(['test']);
    const errorMessage = 'Failed!';
    script.error(errorMessage);

    scriptLoaderPromise.then(res => {
      expect(res).toBe(errorMessage);
      done();
    });
  });
});