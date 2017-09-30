const scriptLoader = require('../scriptLoader');

describe('scriptLoader', () => {
  it('throws an error if no scripts are provided as first argument', () => {
    expect(() => {
      scriptLoader(1);
    }).toThrowError('Needs scripts to load!');
  });

  it('accepts an array with one string to load as scripts and execute onLoad function when finishes', (done) => {
    const script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    const onLoad = (res) => {
      expect(res).toBeTruthy();
      done();
    }

    scriptLoader(['test'], onLoad);
    script.load();
  });

  it('accepts an array with one string to load and execute onError if fails to load', (done) => {
    const script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    const onError = (res) => {
      expect(res).toBeFalsy();
      done();
    }

    scriptLoader(['test'], 'onLoad', onError);
    script.error();
  });

  it('returns a promise that it will receive null if no errors', (done) => {
    const script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    const scriptLoaderPromise = scriptLoader(['test']);
    script.load();

    scriptLoaderPromise.then(err => {
      expect(err).toEqual([null]);
      done();
    });
  });

  it('returns a promise that it will receive the error message if error', (done) => {
    const script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    const scriptLoaderPromise = scriptLoader(['test']);
    const errorMessage = 'Failed!';
    script.error(errorMessage);

    scriptLoaderPromise.then(res => {
      expect(res).toBe(errorMessage);
      done();
    });
  });

  it('accepts a single string as input to load', (done) => {
    const script = {
      src: '',
      addEventListener: (method, callback) => {
        script[method] = callback;
      }
    }

    document.createElement = () => script;
    document.body.appendChild = () => {}

    const scriptLoaderPromise = scriptLoader('test');
    script.load();

    scriptLoaderPromise.then(err => {
      expect(err).toEqual([null]);
      done();
    });
  });

  it('accepts an array of multiple scripts to load and receives true when all scripts are loaded', (done) => {
    class scriptMock {
      constructor() {
        this.src = '';
      }
      addEventListener(method, callback) {
        this[method] = callback;
      }
    }
    const scriptMocks = [];

    document.createElement = () => {
      const newScript = new scriptMock();
      scriptMocks.push(newScript);
      return newScript;
    }
    document.body.appendChild = () => {}
    const scripts = ['test', 'test2'];
    const scriptLoaderPromise = scriptLoader(scripts);

    scriptMocks.forEach(scriptMock => scriptMock.load());

    scriptLoaderPromise.then(err => {
      expect(err).toEqual([null, null]);
      done();
    });
  });
});