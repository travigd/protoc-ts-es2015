# protoc-ts-es2015
A small `protoc` plugin that generates idomatic TypeScript/ES2015 protobuf wrappers.

## Compiling Protobuf Files
The following example will compile all files of the form `./src/proto/*.proto` and
create the corresponding files (in the same `/src/proto/` directory):
* `xxx_pb.js`
* `xxx_pb.d.ts` (via the `ts-protoc-gen` plugin)
* `xxx_es2015.ts` (via this plugin)

```bash
npm install protoc-ts-es2015

PROTOC_GEN_TS=$(which protoc-gen-ts || echo "./node_modules/.bin/protoc-gen-ts")
PROTOC_GEN_TS_ES2015=$(which protoc-gen-ts-es2015 || echo "./node_modules/.bin/protoc-gen-ts-es2015")

protoc \
    --plugin="protoc-gen-ts=$PROTOC_GEN_TS" \
    --plugin="protoc-gen-ts-es2015=$PROTOC_GEN_TS_ES2015" \
    --js_out="import_style=commonjs,binary:./" \
    --ts_out="./" \
    --ts-es2015_out="./" \
    ./src/proto/*.proto
```

## Example Usage
Given the following `.proto` file,
```proto
message User {
    uint64 id = 1;
    string name = 2;
    string email = 3;
}
```
the following TypeScript code would work:
```ts
import {User} from "./user_es2015";

function printUser(user: User) {
  const {id, name, email} = user;
  console.log(`User ${name} has id ${id} and can be reached at ${email}.`);
}

const user = new User();
user.id = 123;
user.name = "Jane Doe";
user.email = "janedoe@example.com";
printUser(user);
```

## To Do
There's no support for nested messages yet.
I'm also not sure how this would be implemented in a context like gRPC where
we don't have direct control over how the messages are deserialized.
We also need to override the deserialize methods.
