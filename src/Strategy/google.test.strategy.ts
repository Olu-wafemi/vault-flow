it('should return null when the accessToken is missing', async () => {
  const googleStrategy = new GoogleStrategy(configServiceMock);
  const validateSpy = jest.spyOn(googleStrategy, 'validate');

  const accessToken = null;
  const refreshToken = 'testRefreshToken';
  const profile = {
    name: { givenName: 'John', familyName: 'Doe' },
    emails: [{ value: 'johndoe@example.com' }],
    photos: [{ value: 'https://example.com/image.jpg' }],
  };
  const done = jest.fn();

  await googleStrategy.validate(accessToken, refreshToken, profile, done);

  expect(validateSpy).toBeCalledTimes(1);
  expect(done).toBeCalledWith(null, null);
});it('should return null when the refreshToken is missing', async () => {
  const googleStrategy = new GoogleStrategy(configServiceMock);
  const validateSpy = jest.spyOn(googleStrategy, 'validate');

  const accessToken = 'testAccessToken';
  const refreshToken = null;
  const profile = {
    name: { givenName: 'John', familyName: 'Doe' },
    emails: [{ value: 'johndoe@example.com' }],
    photos: [{ value: 'https://example.com/image.jpg' }],
  };
  const done = jest.fn();

  await googleStrategy.validate(accessToken, refreshToken, profile, done);

  expect(validateSpy).toBeCalledTimes(1);
  expect(done).toBeCalledWith(null, null);
});