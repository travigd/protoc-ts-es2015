/**
 * Read the entire contents of the standard input.
 *
 * This is useful for reading binary data (i.e. data that is unparseable if
 * it is incomplete).
 */
export const getStdinAsBuffer = () => new Promise<Buffer>((resolve, reject) => {
  let result: Buffer[] = [];
  const {stdin} = process;
  stdin.on("readable", () => {
    let chunk;
    while (chunk = stdin.read()) {
      if (!(chunk instanceof Buffer)) {
        throw new Error(`While reading stdin, expected buffer (got ${typeof result}).`);
      }
      result.push(chunk);
    }
  });
  stdin.on("end", () => resolve(Buffer.concat(result)));
});
