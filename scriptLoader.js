const scriptLoader = (scriptsArray, onLoad, onError) => {
  if (!scriptsArray || !scriptsArray.length) throw Error('Needs scripts to load!');
  if (typeof scriptsArray === 'string') scriptsArray = [scriptsArray];

  const generatePromises = (scripts) => {
    return scripts.map(src => {
      return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', () => {
          resolve(null);
        });
        script.addEventListener('error', (e) => {
          reject(e);
        });
        document.body.appendChild(script);
      });
    });
  };

  return Promise.all(generatePromises(scriptsArray))
    .then(res => {
      if (onLoad) {
        onLoad(res);
      }
      return res;
    })
    .catch(err => {
      if (onError) {
        onError(err);
      }
      return err;
    });
};

module.exports = scriptLoader;