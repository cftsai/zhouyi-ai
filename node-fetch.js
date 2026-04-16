const mockFetch = jest.fn();

mockFetch.mockImplementation((url, options) => {
  return Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('{}'),
    status: 200,
    ok: true
  });
});

module.exports = mockFetch;
