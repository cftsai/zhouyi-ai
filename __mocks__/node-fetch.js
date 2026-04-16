module.exports = {
  default: function() {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ choices: [{ text: 'mocked response' }] })
    });
  }
};
