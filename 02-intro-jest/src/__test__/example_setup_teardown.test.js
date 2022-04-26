describe("setup and teardown examples", () => {
  beforeAll(() => {
    console.log("beforeAll");
  });

  beforeEach(() => {
    console.log("beforeEach");
  });

  afterEach(() => {
    console.log("afterEach");
  });

  afterAll(() => {
    console.log("afterAll");
  });

  test("example 1", () => {
    console.log("example 1");
    expect(true).toBe(true);
  });

  test("example 2", () => {
    console.log("example 2");
    expect(true).toBe(true);
  });
});
