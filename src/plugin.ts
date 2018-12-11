#!/usr/bin/env node

import {CodeGeneratorRequest, CodeGeneratorResponse} from "google-protobuf/google/protobuf/compiler/plugin_pb";
import {getStdinAsBuffer} from "./io";
import {translateFile} from "./translation";

const main = async () => {
  const stdin = await getStdinAsBuffer();
  const request = CodeGeneratorRequest.deserializeBinary(new Uint8Array(stdin));
  const response = new CodeGeneratorResponse();

  response.setFileList(request.getProtoFileList().map((file) => {
    const filename = file.getName();
    const outputFilename = filename.replace(".proto", "_es2015.ts");
    const outputFile = new CodeGeneratorResponse.File();
    outputFile.setName(outputFilename);
    outputFile.setContent(translateFile(file));
    return outputFile;
  }));

  process.stdout.write(new Buffer(response.serializeBinary()));
};

main();
